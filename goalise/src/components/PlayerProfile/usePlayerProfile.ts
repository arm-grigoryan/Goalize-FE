import {
  useGetPlayerBasicInfoQuery,
  useGetPlayerStatsQuery,
  useGetUserInfoQuery,
  useSendTeamInvitationMutation,
  useRemoveTeamMemberMutation,
  useMakeTeamCaptainMutation,
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

  // State to track invitation error modal
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [showInvitationErrorModal, setShowInvitationErrorModal] =
    useState(false);

  // Method to send team invitation
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

      // Check if the error is a 400 Bad Request
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

  // Method to remove a member from the current user's team
  const removeTeamMember = useCallback(async () => {
    const teamId = userInfo?.playerInfo?.team?.id;
    const targetPlayerId = playerBasicInfo?.playerInfo?.id;
    if (!teamId || !targetPlayerId) {
      console.error("Team ID or Player ID not available");
      return { success: false, error: "Team ID or Player ID not found" };
    }

    try {
      await removeMember({ teamId, playerId: targetPlayerId }).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Failed to remove team member:", error);
      return { success: false, error };
    }
  }, [
    userInfo?.playerInfo?.team?.id,
    playerBasicInfo?.playerInfo?.id,
    removeMember,
  ]);

  // Method to make a specific player the captain of the current user's team
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
      return { success: false, error };
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
    // make captain
    makeTeamCaptain,
    isMakingCaptain,
  };
}
