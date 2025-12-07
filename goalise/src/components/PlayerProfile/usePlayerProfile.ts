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

export function usePlayerProfile(playerId: number) {
  const { data: userInfo } = useGetUserInfoQuery();
  const { data: playerBasicInfo } = useGetPlayerBasicInfoQuery(playerId);
  const { data: playerStats } = useGetPlayerStatsQuery(playerId);

  const [sendInvitation, { isLoading: isSendingInvitation }] =
    useSendTeamInvitationMutation();
  const [removeMember, { isLoading: isRemovingMember }] =
    useRemoveTeamMemberMutation();
  const [makeCaptain, { isLoading: isMakingCaptain }] =
    useMakeTeamCaptainMutation();
  const [quitTeamMutation, { isLoading: isQuitting }] = useQuitTeamMutation();

  // State to track invitation error modal
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [showInvitationErrorModal, setShowInvitationErrorModal] =
    useState(false);

  // State to track remove member error
  const [removeMemberError, setRemoveMemberError] = useState<string | null>(
    null
  );
  const [showRemoveMemberErrorModal, setShowRemoveMemberErrorModal] =
    useState(false);

  // State to track make captain error
  const [makeCaptainError, setMakeCaptainError] = useState<string | null>(null);
  const [showMakeCaptainErrorModal, setShowMakeCaptainErrorModal] =
    useState(false);

  // State to track quit team error
  const [quitTeamError, setQuitTeamError] = useState<string | null>(null);
  const [showQuitTeamErrorModal, setShowQuitTeamErrorModal] = useState(false);

  // State to track non-captain invite attempt
  const [showNotCaptainModal, setShowNotCaptainModal] = useState(false);

  const sendTeamInvitation = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    if (!teamId) {
      console.error("User team ID not available");
      return { success: false, error: "Team ID not found" };
    }

    try {
      await sendInvitation({ teamId, playerId }).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Failed to send invitation:", error);

      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 400
      ) {
        const errorData = error as { data?: { errorMessage?: string } };
        const errorMessage =
          errorData?.data?.errorMessage || "Invalid request. Please try again.";
        setInvitationError(errorMessage);
        setShowInvitationErrorModal(true);
        return { success: false, error: errorMessage, is400: true };
      }

      return { success: false, error };
    }
  }, [userInfo?.playerInfo?.team?.id, playerId, sendInvitation]);

  const removeTeamMember = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    const targetPlayerId = playerBasicInfo?.playerInfo?.id;
    if (!teamId || !targetPlayerId) {
      return { success: false, error: "Team ID or Player ID not found" };
    }

    try {
      await removeMember({ teamId, playerId: targetPlayerId }).unwrap();
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
  ]);

  const quitTeam = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    if (!teamId) {
      console.error("Team ID not available");
      return { success: false, error: "Team ID not found" };
    }

    try {
      await quitTeamMutation({ teamId }).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Failed to quit team:", error);

      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 400
      ) {
        const errorData = error as { data?: { errorMessage?: string } };
        const errorMessage =
          errorData?.data?.errorMessage || "Invalid request. Please try again.";
        setQuitTeamError(errorMessage);
        setShowQuitTeamErrorModal(true);
        return { success: false, error: errorMessage, is400: true };
      }

      const unexpectedError =
        "An unexpected error occurred. Please try again later.";
      setQuitTeamError(unexpectedError);
      setShowQuitTeamErrorModal(true);
      return { success: false, error: unexpectedError };
    }
  }, [userInfo?.playerInfo?.team?.id, quitTeamMutation]);

  const makeTeamCaptain = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    const targetPlayerId = playerBasicInfo?.playerInfo?.id;
    if (!teamId || !targetPlayerId) {
      console.error("Team ID or Player ID not available");
      return { success: false, error: "Team ID or Player ID not found" };
    }

    try {
      await makeCaptain({ teamId, playerId: targetPlayerId }).unwrap();
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
  ]);

  return {
    userInfo,
    playerBasicInfo,
    playerStats,
    // invitation
    sendTeamInvitation,
    isSendingInvitation,
    invitationError,
    showInvitationErrorModal,
    closeInvitationErrorModal: () => setShowInvitationErrorModal(false),
    // member removal
    removeTeamMember,
    isRemovingMember,
    removeMemberError,
    showRemoveMemberErrorModal,
    closeRemoveMemberErrorModal: () => setShowRemoveMemberErrorModal(false),
    // make captain
    makeTeamCaptain,
    isMakingCaptain,
    makeCaptainError,
    showMakeCaptainErrorModal,
    closeMakeCaptainErrorModal: () => setShowMakeCaptainErrorModal(false),
    // quit team
    quitTeam,
    isQuitting,
    quitTeamError,
    showQuitTeamErrorModal,
    closeQuitTeamErrorModal: () => setShowQuitTeamErrorModal(false),
    // non-captain invite
    showNotCaptainModal,
    setShowNotCaptainModal,
  };
}
