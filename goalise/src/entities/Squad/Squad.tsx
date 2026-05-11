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
import { useTranslations } from "next-intl";

export const Squad: React.FC = () => {
  const params = useParams();
  const teamId = Number(params?.teamId);
  const { tokens } = useAuth();
  const tModals = useTranslations("playerProfile.modals");
  const tSquadModals = useTranslations("squad.modals");
  const tCommon = useTranslations("common");

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
  const [showShirtNumberSuccess, setShowShirtNumberSuccess] = useState(false);
  const [showShirtNumberError, setShowShirtNumberError] = useState(false);
  const [shirtNumberError, setShirtNumberError] = useState<string | null>(null);

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
      setInviteError(err?.data?.errorMessage || tModals('errorOccurred'));
      setShowInviteError(true);
    }
  }, [selectedPlayer, userTeamId, sendInvitation, refetchUserInfo, tModals]);

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
      setMakeCaptainError(err?.data?.errorMessage || tModals('errorOccurred'));
      setShowMakeCaptainError(true);
    }
  }, [selectedPlayer, teamId, makeCaptain, tokens?.refreshToken, refetchUserInfo, refetchSquad, tModals]);

  const handleConfirmRemove = useCallback(async () => {
    if (!selectedPlayer) return;
    setShowRemoveConfirm(false);
    try {
      await removeMember({ teamId, playerId: selectedPlayer.playerId }).unwrap();
      setShowRemoveSuccess(true);
      refetchSquad();
    } catch (error) {
      const err = error as { data?: { errorMessage?: string } };
      setRemoveError(err?.data?.errorMessage || tModals('errorOccurred'));
      setShowRemoveError(true);
    }
  }, [selectedPlayer, teamId, removeMember, refetchSquad, tModals]);

  const handleShirtNumberSubmit = useCallback(async (newShirtNumber: number) => {
    if (!selectedPlayer) return;
    setShowShirtNumberModal(false);
    try {
      await updateShirtNumber({ teamId, playerId: selectedPlayer.playerId, shirtNumber: newShirtNumber }).unwrap();
      setShowShirtNumberSuccess(true);
      refetchSquad();
    } catch (error) {
      const err = error as { data?: { errorMessage?: string } };
      setShirtNumberError(err?.data?.errorMessage || tModals('errorOccurred'));
      setShowShirtNumberError(true);
    }
  }, [selectedPlayer, teamId, updateShirtNumber, refetchSquad, tModals]);

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

      {/* Shirt Number Success / Error */}
      {showShirtNumberSuccess && (
        <PlayerInvitationCard
          title={tSquadModals("shirtNumberUpdatedTitle")}
          description={tSquadModals("shirtNumberUpdatedDescription")}
          cancelButtonText={tCommon("close")}
          onCancelButtonClick={() => setShowShirtNumberSuccess(false)}
        />
      )}
      {showShirtNumberError && (
        <PlayerInvitationCard
          title={tSquadModals("cannotUpdateShirtNumber")}
          description={shirtNumberError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
          onCancelButtonClick={() => setShowShirtNumberError(false)}
        />
      )}

      {/* Invite Confirm */}
      {showInviteConfirm && (
        <PlayerInvitationCard
          title={tSquadModals("invitePlayerTitle")}
          playerName={selectedPlayerName}
          confirmButtonText={tSquadModals("inviteButton")}
          cancelButtonText={tCommon("cancel")}
          onConfirmButtonClick={handleConfirmInvite}
          onCancelButtonClick={() => setShowInviteConfirm(false)}
        />
      )}
      {showInviteSuccess && (
        <PlayerInvitationCard
          title={tModals("invitationSentTitle")}
          description={tModals("invitationSentDescription")}
          cancelButtonText={tCommon("close")}
          onCancelButtonClick={() => setShowInviteSuccess(false)}
        />
      )}
      {showInviteError && (
        <PlayerInvitationCard
          title={tModals("cannotSendInvitation")}
          description={inviteError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
          onCancelButtonClick={() => setShowInviteError(false)}
        />
      )}

      {/* Make Captain */}
      {showMakeCaptainConfirm && selectedPlayer && (
        <PlayerInvitationCard
          title={tModals("makeCaptainTitle")}
          description={tModals("makeCaptainDescription", {
            firstName: selectedPlayer.firstName,
            lastName: selectedPlayer.lastName,
          })}
          confirmButtonText={tCommon("confirm")}
          cancelButtonText={tCommon("cancel")}
          onConfirmButtonClick={handleConfirmMakeCaptain}
          onCancelButtonClick={() => setShowMakeCaptainConfirm(false)}
        />
      )}
      {showMakeCaptainSuccess && (
        <PlayerInvitationCard
          title={tModals("captainChangedTitle")}
          description={tModals("captainChangedDescription")}
          cancelButtonText={tCommon("close")}
          onCancelButtonClick={() => setShowMakeCaptainSuccess(false)}
        />
      )}
      {showMakeCaptainError && (
        <PlayerInvitationCard
          title={tModals("cannotMakeCaptain")}
          description={makeCaptainError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
          onCancelButtonClick={() => setShowMakeCaptainError(false)}
        />
      )}

      {/* Remove */}
      {showRemoveConfirm && selectedPlayer && (
        <PlayerInvitationCard
          title={tModals("removeMemberTitle")}
          description={tModals("removeMemberDescription", {
            firstName: selectedPlayer.firstName,
            lastName: selectedPlayer.lastName,
          })}
          confirmButtonText={tCommon("confirm")}
          cancelButtonText={tCommon("cancel")}
          onConfirmButtonClick={handleConfirmRemove}
          onCancelButtonClick={() => setShowRemoveConfirm(false)}
        />
      )}
      {showRemoveSuccess && (
        <PlayerInvitationCard
          title={tModals("memberRemovedTitle")}
          description={tModals("memberRemovedDescription")}
          cancelButtonText={tCommon("close")}
          onCancelButtonClick={() => setShowRemoveSuccess(false)}
        />
      )}
      {showRemoveError && (
        <PlayerInvitationCard
          title={tModals("cannotRemovePlayer")}
          description={removeError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
          onCancelButtonClick={() => setShowRemoveError(false)}
        />
      )}

      {/* Loading overlays */}
      {(isSendingInvitation || isRemovingMember || isMakingCaptain || isUpdatingShirtNumber) && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader} />
        </div>
      )}
    </>
  );
};
