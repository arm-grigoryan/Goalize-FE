import {
  useGetPlayerBasicInfoQuery,
  useGetPlayerStatsQuery,
  useGetUserInfoQuery,
  useSendTeamInvitationMutation,
  useRemoveTeamMemberMutation,
  useMakeTeamCaptainMutation,
  useQuitTeamMutation,
} from "@/app/store/services/api";
import { useCallback, useState } from "react";
import { AuthTokens } from "@/shared/auth/oidcService";

interface UsePlayerProfileProps {
  playerId: number;
  refreshTokens?: (refreshToken: string) => Promise<AuthTokens>;
  tokens?: AuthTokens | null;
}

export function usePlayerProfile({ playerId, refreshTokens, tokens }: UsePlayerProfileProps) {
  const { data: userInfo, refetch: refetchUserInfo } = useGetUserInfoQuery();
  const { data: playerBasicInfo, refetch: refetchPlayerBasicInfo, isLoading: isLoadingPlayerInfo } = useGetPlayerBasicInfoQuery(playerId);
  const { data: playerStats } = useGetPlayerStatsQuery(playerId);

  const [sendInvitation, { isLoading: isSendingInvitation }] =
    useSendTeamInvitationMutation();
  const [removeMember, { isLoading: isRemovingMember }] =
    useRemoveTeamMemberMutation();
  const [makeCaptain, { isLoading: isMakingCaptain }] =
    useMakeTeamCaptainMutation();
  const [quitTeamMutation, { isLoading: isQuitting }] = useQuitTeamMutation();

  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [showInvitationErrorModal, setShowInvitationErrorModal] =
    useState(false);

  const [removeMemberError, setRemoveMemberError] = useState<string | null>(
    null
  );
  const [showRemoveMemberErrorModal, setShowRemoveMemberErrorModal] =
    useState(false);

  const [makeCaptainError, setMakeCaptainError] = useState<string | null>(null);
  const [showMakeCaptainErrorModal, setShowMakeCaptainErrorModal] =
    useState(false);
  const [quitTeamError, setQuitTeamError] = useState<string | null>(null);
  const [showQuitTeamErrorModal, setShowQuitTeamErrorModal] = useState(false);

  const [showNotCaptainModal, setShowNotCaptainModal] = useState(false);

  // Confirmation modals
  const [showMakeCaptainConfirmModal, setShowMakeCaptainConfirmModal] =
    useState(false);
  const [showRemoveMemberConfirmModal, setShowRemoveMemberConfirmModal] =
    useState(false);
  const [showQuitTeamConfirmModal, setShowQuitTeamConfirmModal] =
    useState(false);

  // Success modals
  const [showMakeCaptainSuccessModal, setShowMakeCaptainSuccessModal] =
    useState(false);
  const [showRemoveMemberSuccessModal, setShowRemoveMemberSuccessModal] =
    useState(false);
  const [showQuitTeamSuccessModal, setShowQuitTeamSuccessModal] =
    useState(false);

  const [showInvitationSuccessModal, setShowInvitationSuccessModal] =
    useState(false);

  const sendTeamInvitation = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    if (!teamId) {
      console.error("User team ID not available");
      return { success: false, error: "Team ID not found" };
    }

    try {
      await sendInvitation({ teamId, playerId }).unwrap();
      setShowInvitationSuccessModal(true);
      refetchUserInfo();
      refetchPlayerBasicInfo();
      return { success: true };
    } catch (error) {
      console.error("Failed to send invitation:", error);

      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        (error.status === 400 || error.status === 409)
      ) {
        const errorData = error as { data?: { errorMessage?: string } };
        const errorMessage =
          errorData?.data?.errorMessage || "Invalid request. Please try again.";
        setInvitationError(errorMessage);
        setShowInvitationErrorModal(true);
        return { success: false, error: errorMessage, is400: error.status === 400, is409: error.status === 409 };
      }

      return { success: false, error };
    }
  }, [
    userInfo?.playerInfo?.team?.id,
    playerId,
    sendInvitation,
    refetchUserInfo,
    refetchPlayerBasicInfo,
  ]);

  const removeTeamMember = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    const targetPlayerId = playerBasicInfo?.playerInfo?.id;
    if (!teamId || !targetPlayerId) {
      return { success: false, error: "Team ID or Player ID not found" };
    }

    try {
      await removeMember({ teamId, playerId: targetPlayerId }).unwrap();
      setShowRemoveMemberSuccessModal(true);
      refetchUserInfo();
      refetchPlayerBasicInfo();
      return { success: true };
    } catch (error) {
      console.error("Failed to remove team member:", error);

      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 400
      ) {
        const errorData = error as { data?: { errorMessage?: string } };
        const errorMessage =
          errorData?.data?.errorMessage || "Invalid request. Please try again.";
        setRemoveMemberError(errorMessage);
        setShowRemoveMemberErrorModal(true);
        return { success: false, error: errorMessage, is400: true };
      }

      const unexpectedError =
        "An unexpected error occurred. Please try again later.";
      setRemoveMemberError(unexpectedError);
      setShowRemoveMemberErrorModal(true);
      return { success: false, error: unexpectedError };
    }
  }, [
    userInfo?.playerInfo?.team?.id,
    playerBasicInfo?.playerInfo?.id,
    removeMember,
    refetchUserInfo,
    refetchPlayerBasicInfo,
  ]);

  const quitTeam = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    const isUserCaptain = userInfo?.playerInfo?.id === userInfo?.playerInfo?.team?.captainId;

    if (!teamId) {
      console.error("Team ID not available");
      return { success: false, error: "Team ID not found" };
    }

    try {
      await quitTeamMutation({ teamId }).unwrap();

      // Refresh access token if user was captain (captain role will be gone)
      if (isUserCaptain && refreshTokens && tokens?.refreshToken) {
        try {
          await refreshTokens(tokens.refreshToken);
        } catch (refreshError) {
          console.error("Failed to refresh tokens after quitting team:", refreshError);
        }
      }

      setShowQuitTeamSuccessModal(true);
      refetchUserInfo();
      refetchPlayerBasicInfo();
      return { success: true };
    } catch (error) {
      console.error("Failed to quit team:", error);

      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        (error.status === 400 || error.status === 409)
      ) {
        const errorData = error as { data?: { errorMessage?: string } };
        const errorMessage =
          errorData?.data?.errorMessage || "Invalid request. Please try again.";
        setQuitTeamError(errorMessage);
        setShowQuitTeamErrorModal(true);
        return { success: false, error: errorMessage, is400: error.status === 400, is409: error.status === 409 };
      }

      const unexpectedError =
        "An unexpected error occurred. Please try again later.";
      setQuitTeamError(unexpectedError);
      setShowQuitTeamErrorModal(true);
      return { success: false, error: unexpectedError };
    }
  }, [
    userInfo?.playerInfo?.team?.id,
    userInfo?.playerInfo?.id,
    userInfo?.playerInfo?.team?.captainId,
    quitTeamMutation,
    refreshTokens,
    tokens?.refreshToken,
    refetchUserInfo,
    refetchPlayerBasicInfo,
  ]);

  const makeTeamCaptain = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    const targetPlayerId = playerBasicInfo?.playerInfo?.id;
    if (!teamId || !targetPlayerId) {
      console.error("Team ID or Player ID not available");
      return { success: false, error: "Team ID or Player ID not found" };
    }

    try {
      await makeCaptain({ teamId, playerId: targetPlayerId }).unwrap();

      // Refresh access token since current user's captain role is now gone
      if (refreshTokens && tokens?.refreshToken) {
        try {
          await refreshTokens(tokens.refreshToken);
        } catch (refreshError) {
          console.error("Failed to refresh tokens after making captain:", refreshError);
        }
      }

      setShowMakeCaptainSuccessModal(true);
      refetchUserInfo();
      refetchPlayerBasicInfo();
      return { success: true };
    } catch (error) {
      console.error("Failed to make team captain:", error);

      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 400
      ) {
        const errorData = error as { data?: { errorMessage?: string } };
        const errorMessage =
          errorData?.data?.errorMessage || "Invalid request. Please try again.";
        setMakeCaptainError(errorMessage);
        setShowMakeCaptainErrorModal(true);
        return { success: false, error: errorMessage, is400: true };
      }

      const unexpectedError =
        "An unexpected error occurred. Please try again later.";
      setMakeCaptainError(unexpectedError);
      setShowMakeCaptainErrorModal(true);
      return { success: false, error: unexpectedError };
    }
  }, [
    userInfo?.playerInfo?.team?.id,
    playerBasicInfo?.playerInfo?.id,
    makeCaptain,
    refreshTokens,
    tokens?.refreshToken,
    refetchUserInfo,
    refetchPlayerBasicInfo,
  ]);

  return {
    userInfo,
    playerBasicInfo,
    playerStats,
    isLoadingPlayerInfo,
    sendTeamInvitation,
    isSendingInvitation,
    invitationError,
    showInvitationErrorModal,
    closeInvitationErrorModal: () => setShowInvitationErrorModal(false),
    showInvitationSuccessModal,
    closeInvitationSuccessModal: () => setShowInvitationSuccessModal(false),
    removeTeamMember,
    isRemovingMember,
    removeMemberError,
    showRemoveMemberErrorModal,
    closeRemoveMemberErrorModal: () => setShowRemoveMemberErrorModal(false),
    makeTeamCaptain,
    isMakingCaptain,
    makeCaptainError,
    showMakeCaptainErrorModal,
    closeMakeCaptainErrorModal: () => setShowMakeCaptainErrorModal(false),
    quitTeam,
    isQuitting,
    quitTeamError,
    showQuitTeamErrorModal,
    closeQuitTeamErrorModal: () => setShowQuitTeamErrorModal(false),
    showNotCaptainModal,
    setShowNotCaptainModal,
    showMakeCaptainConfirmModal,
    setShowMakeCaptainConfirmModal,
    showRemoveMemberConfirmModal,
    setShowRemoveMemberConfirmModal,
    showQuitTeamConfirmModal,
    setShowQuitTeamConfirmModal,
    showMakeCaptainSuccessModal,
    closeMakeCaptainSuccessModal: () => setShowMakeCaptainSuccessModal(false),
    showRemoveMemberSuccessModal,
    closeRemoveMemberSuccessModal: () => setShowRemoveMemberSuccessModal(false),
    showQuitTeamSuccessModal,
    closeQuitTeamSuccessModal: () => setShowQuitTeamSuccessModal(false),
  };
}
