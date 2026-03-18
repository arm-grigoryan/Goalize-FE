'use client'
import React, { useState, useCallback } from "react";
import SquadCard from "../SquadCard";
import styles from './Squad.module.css';
import {
  useGetTeamSquadQuery,
  useGetUserInfoQuery,
  useSendTeamInvitationMutation,
  useRemoveTeamMemberMutation,
  useMakeTeamCaptainMutation,
  useUpdateShirtNumberMutation,
} from "@/app/store/services/api";
import { useParams } from "next/navigation";
import { ISquadPlayer } from "@/types/api/squad";
import PlayerInvitationCard from "../PlayerInvitationCard";
import EditShirtNumberPopUp from "@/components/EditShirtNumberPopUp";
import { useAuth } from "@/shared/auth/AuthContext";
import { refreshTokens } from "@/shared/auth/oidcService";

export const Squad: React.FC = () => {
  const params = useParams();
  const teamId = Number(params?.teamId);
  const { tokens } = useAuth();

  const { data: squad, isLoading, refetch: refetchSquad } = useGetTeamSquadQuery(teamId, {
    skip: !teamId,
  });
  const { data: userInfo, refetch: refetchUserInfo } = useGetUserInfoQuery();

  const [sendInvitation, { isLoading: isSendingInvitation }] = useSendTeamInvitationMutation();
  const [removeMember, { isLoading: isRemovingMember }] = useRemoveTeamMemberMutation();
  const [makeCaptain, { isLoading: isMakingCaptain }] = useMakeTeamCaptainMutation();
  const [updateShirtNumber, { isLoading: isUpdatingShirtNumber }] = useUpdateShirtNumberMutation();

  const [selectedPlayer, setSelectedPlayer] = useState<ISquadPlayer | null>(null);

  // Invite
  const [showInviteConfirm, setShowInviteConfirm] = useState(false);
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [showInviteError, setShowInviteError] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Make Captain
  const [showMakeCaptainConfirm, setShowMakeCaptainConfirm] = useState(false);
  const [showMakeCaptainSuccess, setShowMakeCaptainSuccess] = useState(false);
  const [showMakeCaptainError, setShowMakeCaptainError] = useState(false);
  const [makeCaptainError, setMakeCaptainError] = useState<string | null>(null);

  // Remove
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
  const [showRemoveError, setShowRemoveError] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  // Shirt Number
  const [showShirtNumberModal, setShowShirtNumberModal] = useState(false);

  // Role determination
  const isLoggedIn = Boolean(userInfo);
  const userPlayerId = userInfo?.playerInfo?.id;
  const userTeamId = userInfo?.playerInfo?.team?.id;
  const userCaptainId = userInfo?.playerInfo?.team?.captainId;
  const isUserCaptain = isLoggedIn && userPlayerId === userCaptainId;
  const isOwnTeam = isUserCaptain && userTeamId === teamId;

  const menuType: 'captain' | 'invite' | 'none' = isOwnTeam
    ? 'captain'
    : isUserCaptain
    ? 'invite'
    : 'none';

  // Handlers for opening modals
  const handleMakeCaptainClick = (player: ISquadPlayer) => {
    setSelectedPlayer(player);
    setShowMakeCaptainConfirm(true);
  };

  const handleRemoveClick = (player: ISquadPlayer) => {
    setSelectedPlayer(player);
    setShowRemoveConfirm(true);
  };

  const handleEditShirtNumberClick = (player: ISquadPlayer) => {
    setSelectedPlayer(player);
    setShowShirtNumberModal(true);
  };

  const handleInviteClick = (player: ISquadPlayer) => {
    setSelectedPlayer(player);
    setShowInviteConfirm(true);
  };

  // API actions
  const handleConfirmInvite = useCallback(async () => {
    if (!selectedPlayer || !userTeamId) return;
    setShowInviteConfirm(false);
    try {
      await sendInvitation({ teamId: userTeamId, playerId: selectedPlayer.playerId }).unwrap();
      setShowInviteSuccess(true);
      refetchUserInfo();
    } catch (error) {
      const err = error as { data?: { errorMessage?: string } };
      setInviteError(err?.data?.errorMessage || 'An error occurred.');
      setShowInviteError(true);
    }
  }, [selectedPlayer, userTeamId, sendInvitation, refetchUserInfo]);

  const handleConfirmMakeCaptain = useCallback(async () => {
    if (!selectedPlayer) return;
    setShowMakeCaptainConfirm(false);
    try {
      await makeCaptain({ teamId, playerId: selectedPlayer.playerId }).unwrap();
      if (tokens?.refreshToken) {
        try { await refreshTokens(tokens.refreshToken); } catch { /* ignore */ }
      }
      setShowMakeCaptainSuccess(true);
      refetchUserInfo();
      refetchSquad();
    } catch (error) {
      const err = error as { data?: { errorMessage?: string } };
      setMakeCaptainError(err?.data?.errorMessage || 'An error occurred.');
      setShowMakeCaptainError(true);
    }
  }, [selectedPlayer, teamId, makeCaptain, tokens?.refreshToken, refetchUserInfo, refetchSquad]);

  const handleConfirmRemove = useCallback(async () => {
    if (!selectedPlayer) return;
    setShowRemoveConfirm(false);
    try {
      await removeMember({ teamId, playerId: selectedPlayer.playerId }).unwrap();
      setShowRemoveSuccess(true);
      refetchSquad();
    } catch (error) {
      const err = error as { data?: { errorMessage?: string } };
      setRemoveError(err?.data?.errorMessage || 'An error occurred.');
      setShowRemoveError(true);
    }
  }, [selectedPlayer, teamId, removeMember, refetchSquad]);

  const handleShirtNumberSubmit = useCallback(async (newShirtNumber: number) => {
    if (!selectedPlayer) return;
    try {
      await updateShirtNumber({ teamId, playerId: selectedPlayer.playerId, shirtNumber: newShirtNumber }).unwrap();
      setShowShirtNumberModal(false);
      refetchSquad();
    } catch (error) {
      console.error('Failed to update shirt number:', error);
    }
  }, [selectedPlayer, teamId, updateShirtNumber, refetchSquad]);

  if (isLoading) return null;
  if (!squad?.length) return null;

  const selectedPlayerName = selectedPlayer
    ? `${selectedPlayer.firstName} ${selectedPlayer.lastName}`
    : '';

  return (
    <>
      <div className={styles.container}>
        {squad.map((player) => (
          <SquadCard
            key={player.id}
            playerName={`${player.firstName} ${player.lastName}`}
            shirtNumber={player.shirtNumber}
            picture={player.picture}
            playerId={player.playerId}
            menuType={menuType}
            isOwnCard={player.playerId === userPlayerId}
            onMakeCaptain={() => handleMakeCaptainClick(player)}
            onRemove={() => handleRemoveClick(player)}
            onEditShirtNumber={() => handleEditShirtNumberClick(player)}
            onInvite={() => handleInviteClick(player)}
          />
        ))}
      </div>

      {/* Shirt Number Modal */}
      {showShirtNumberModal && selectedPlayer && squad && (
        <EditShirtNumberPopUp
          player={selectedPlayer}
          squad={squad}
          onClose={() => setShowShirtNumberModal(false)}
          onSubmit={handleShirtNumberSubmit}
          isLoading={isUpdatingShirtNumber}
        />
      )}

      {/* Invite Confirm */}
      {showInviteConfirm && (
        <PlayerInvitationCard
          title="Invite Player"
          playerName={selectedPlayerName}
          confirmButtonText="Invite"
          cancelButtonText="Cancel"
          onConfirmButtonClick={handleConfirmInvite}
          onCancelButtonClick={() => setShowInviteConfirm(false)}
        />
      )}
      {showInviteSuccess && (
        <PlayerInvitationCard
          title="Invitation Sent Successfully"
          description="The player has been invited to your team."
          cancelButtonText="Close"
          onCancelButtonClick={() => setShowInviteSuccess(false)}
        />
      )}
      {showInviteError && (
        <PlayerInvitationCard
          title="Cannot Send Invitation"
          description={inviteError || 'An error occurred.'}
          confirmButtonText="OK"
          onCancelButtonClick={() => setShowInviteError(false)}
        />
      )}

      {/* Make Captain */}
      {showMakeCaptainConfirm && (
        <PlayerInvitationCard
          title="Make Team Captain"
          description={`Are you sure you want to make ${selectedPlayerName} the team captain? You will lose your captain privileges.`}
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
          onConfirmButtonClick={handleConfirmMakeCaptain}
          onCancelButtonClick={() => setShowMakeCaptainConfirm(false)}
        />
      )}
      {showMakeCaptainSuccess && (
        <PlayerInvitationCard
          title="Captain Changed Successfully"
          description="The team captain has been updated."
          cancelButtonText="Close"
          onCancelButtonClick={() => setShowMakeCaptainSuccess(false)}
        />
      )}
      {showMakeCaptainError && (
        <PlayerInvitationCard
          title="Cannot Make Captain"
          description={makeCaptainError || 'An error occurred.'}
          confirmButtonText="OK"
          onCancelButtonClick={() => setShowMakeCaptainError(false)}
        />
      )}

      {/* Remove */}
      {showRemoveConfirm && (
        <PlayerInvitationCard
          title="Remove Team Member"
          description={`Are you sure you want to remove ${selectedPlayerName} from the team?`}
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
          onConfirmButtonClick={handleConfirmRemove}
          onCancelButtonClick={() => setShowRemoveConfirm(false)}
        />
      )}
      {showRemoveSuccess && (
        <PlayerInvitationCard
          title="Member Removed Successfully"
          description="The team member has been removed."
          cancelButtonText="Close"
          onCancelButtonClick={() => setShowRemoveSuccess(false)}
        />
      )}
      {showRemoveError && (
        <PlayerInvitationCard
          title="Cannot Remove Player"
          description={removeError || 'An error occurred.'}
          confirmButtonText="OK"
          onCancelButtonClick={() => setShowRemoveError(false)}
        />
      )}

      {/* Loading overlays */}
      {(isSendingInvitation || isRemovingMember || isMakingCaptain) && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader} />
        </div>
      )}
    </>
  );
};
