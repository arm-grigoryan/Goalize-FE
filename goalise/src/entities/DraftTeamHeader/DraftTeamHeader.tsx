"use client";
import React, { useState } from "react";
import styles from './DraftTeamHeader.module.css';
import Image from "next/image";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import Link from "next/link";
import edit from '../../assets/pngs/edit.svg';
import Button from "@/shared/Button";
import infoIcon from '../../assets/pngs/infoIcon.svg';
import { ITeamDraft } from "@/types/api/temas";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import { useDeleteTeamDraftMutation } from "@/app/store/services/api";
import { useAuth } from "@/shared/auth/AuthContext";
import { refreshTokens } from "@/shared/auth/oidcService";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { UpdateDraftTeamPopUp } from "@/entities/UpdateDraftTeamPopUp";
import { useTranslations } from "next-intl";

export interface IDraftTeamHeaderProps {
    isLoading?: boolean;
    isCaptain?: boolean;
    isError?: boolean;
    draftData?: ITeamDraft;
    teamId: number;
}
export const DraftTeamHeader: React.FC<IDraftTeamHeaderProps> = ({
    isCaptain,
    isLoading,
    isError,
    draftData,
    teamId,
}) => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    const t = useTranslations("draftTeam");
    const tHeader = useTranslations("draftTeamHeader");
    const tCommon = useTranslations("common");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
    const [statusTooltip, setStatusTooltip] = useState<{ x: number; y: number } | null>(null);
    const [deleteTeamDraft, { isLoading: isDeleting }] = useDeleteTeamDraftMutation();
    const { tokens, updateTokens, user } = useAuth();

    const captainId = draftData?.captainId;

    const lastEditedDate = draftData?.updateDate ?? draftData?.createDate ?? null;
    const editedDateStr = formatUTCDate(lastEditedDate, "dd.mm.yyyy");
    const editedTimeStr = formatUTCDate(lastEditedDate, "HH:MM");

    const reviewedDateStr = draftData?.reviewedAt ? formatUTCDate(draftData.reviewedAt, "dd.mm.yyyy") : null;
    const reviewedTimeStr = draftData?.reviewedAt ? formatUTCDate(draftData.reviewedAt, "HH:MM") : null;

    const handleDelete = async () => {
        setShowDeleteModal(false);
        try {
            await deleteTeamDraft(teamId).unwrap();
            if (tokens?.refreshToken) {
                const newTokens = await refreshTokens(tokens.refreshToken);
                updateTokens(newTokens);
            }
            setShowDeleteSuccessModal(true);
        } catch (error) {
            const errorData = error as { data?: { errorMessage?: string } };
            setDeleteError(errorData?.data?.errorMessage || tHeader("errorFallback"));
        }
    };

    return <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
        {isDeleting && (
            <div className={styles.loader_container}>
                <div className={styles.loader}></div>
            </div>
        )}
        <UpdateDraftTeamPopUp
            open={showUpdatePopUp}
            onClose={() => setShowUpdatePopUp(false)}
            teamId={teamId}
            initialName={draftData?.name ?? ""}
            initialAbbreviation={draftData?.abbreviation ?? ""}
            initialLogoUrl={draftData?.logo}
        />
        {showDeleteModal && (
            <PlayerInvitationCard
                title={t("deleteDraftTitle")}
                description={t("deleteDraftDescription")}
                confirmButtonText={tCommon("delete")}
                cancelButtonText={tCommon("cancel")}
                onConfirmButtonClick={handleDelete}
                onCancelButtonClick={() => setShowDeleteModal(false)}
            />
        )}
        {showDeleteSuccessModal && (
            <PlayerInvitationCard
                title={t("deleteSuccessTitle")}
                description={t("deleteSuccessDescription")}
                cancelButtonText={tCommon("close")}
                onCancelButtonClick={() => { window.location.href = '/'; }}
            />
        )}
        {deleteError && (
            <PlayerInvitationCard
                title={tHeader("cannotDeleteTitle")}
                description={deleteError}
                cancelButtonText={tCommon("close")}
                onCancelButtonClick={() => setDeleteError(null)}
            />
        )}
        <div className={styles.inner}>
            <div className={styles.name_container}>
                {isLoading ? (
                    <div
                        className={styles.skeleton}
                        style={{ width: 130, height: 130, borderRadius: 8 }}
                    />
                ) : (
                    !isMobile && draftData?.logo && (
                        <Image
                            src={draftData.logo}
                            alt={"Team"}
                            className={styles.teamLogo}
                            width={130}
                            height={130}
                            unoptimized
                        />
                    )
                )}
                <div className={styles.name_and_button}>
                    <div className={styles.nameWrapper}>
                        {isLoading ? (
                            <div
                                className={styles.skeleton}
                                style={{ width: 200, height: 32, borderRadius: 6 }}
                            />
                        ) : isError ? (
                            <div className={styles.errorText}>{t("failedToLoadTeamInfo")}</div>
                        ) : (
                            <div className={styles.name}>
                                {isMobile && draftData?.logo && (
                                    <Image
                                        src={draftData.logo}
                                        alt={"Team"}
                                        className={styles.teamLogo}
                                        width={130}
                                        height={130}
                                        unoptimized
                                    />
                                )}
                                {draftData?.name}
                                {draftData?.abbreviation && (
                                    <span className={styles.abbreviation}>
                                        {" "}({draftData.abbreviation})
                                    </span>
                                )}
                            </div>
                        )}
                        {!isMobile && isCaptain && (
                            <div
                                className={styles.editButton}
                                onClick={() => setShowUpdatePopUp(true)}
                                style={{ cursor: "pointer" }}
                            >
                                <Image src={edit} alt="" />
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonsWrapper}>
                        <div className={styles.deleteButtonWrapper}>
                            <Button
                                handleClick={() => setShowDeleteModal(true)}
                                content={t("delete")}
                                className="red_button_transparant_white_text"
                            />
                            {isMobile && isCaptain && (
                                <div
                                    className={styles.editButton}
                                    onClick={() => setShowUpdatePopUp(true)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Image src={edit} alt="" />
                                </div>
                            )}
                            <div className={styles.button}>
                                <div> {t("lastEdited")} </div>
                                <span>
                                    {editedDateStr}
                                    <div>{editedTimeStr}</div>
                                </span>
                            </div>
                        </div>
                        <div className={styles.rejectedWrapper}>
                            <div className={styles.rejectedInner}>
                                <div className={styles.status}> {t("status")} </div>
                                <div className={styles.abandoned}>
                                    <Image
                                        src={infoIcon}
                                        alt=""
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => {
                                            if (isMobile) {
                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                setStatusTooltip(
                                                    statusTooltip ? null : { x: rect.left + rect.width / 2, y: rect.top - 8 }
                                                );
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isMobile) {
                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                setStatusTooltip({ x: rect.right + 8, y: rect.top });
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (!isMobile) setStatusTooltip(null);
                                        }}
                                    />
                                    <div className={styles.abandonedText}>
                                        {draftData?.reviewStatus ?? '—'}
                                    </div>
                                </div>
                                {!isMobile && reviewedDateStr && (
                                    <div className={styles.button}>
                                        <div> {t("reviewed")} </div>
                                        <span>
                                            {reviewedDateStr}
                                            <div className={styles.clock}>{reviewedTimeStr}</div>
                                        </span>
                                    </div>
                                )}
                            </div>
                            {draftData?.rejectionReason && (
                                <div className={styles.rejectedText}>{draftData.rejectionReason}</div>
                            )}
                            {isMobile && reviewedDateStr && (
                                <div className={styles.button}>
                                    <div> {t("reviewed")} </div>
                                    <span>
                                        {reviewedDateStr}
                                        <div className={styles.clock}>{reviewedTimeStr}</div>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className={styles.infoImageWrapper}>
                    <div className={styles.nameButtonWrapper}>
                        <div
                            className={styles.skeleton}
                            style={{ width: 180, height: 36, borderRadius: 6 }}
                        />
                        <div className={styles.buttonsWrapper}>
                            <div className={styles.skeleton} style={{ width: 80, height: 40, borderRadius: 10 }} />
                            <div className={styles.skeleton} style={{ width: 80, height: 40, borderRadius: 10 }} />
                            <div className={styles.skeleton} style={{ width: 90, height: 40, borderRadius: 10 }} />
                        </div>
                    </div>
                    <div className={styles.skeleton} style={{ width: 173, height: 221, borderRadius: 14 }} />
                </div>
            )}

            {!isLoading && (
                <div className={styles.infoImageWrapper}>
                    <div className={styles.nameButtonWrapper}>
                        <Link
                            href={captainId ? `/players/${captainId}` : '#'}
                            style={{ textDecoration: "none" }}
                        >
                            <div className={styles.playerName}>
                                {user?.name ?? '—'}
                                {!isCaptain && (
                                    <div className={styles.captainLabel}> {t("captainLabel")} </div>
                                )}
                            </div>
                        </Link>
                    </div>

                    <Link
                        href={captainId ? `/players/${captainId}` : '#'}
                        style={{ textDecoration: "none" }}
                        className={styles.playerImageWrapper}
                    >
                        {user?.picture ? (
                            <Image
                                src={user.picture}
                                alt={''}
                                className={styles.playerImage}
                                width={173}
                                height={221}
                                unoptimized
                            />
                        ) : (
                            <div
                                className={styles.playerImage}
                                style={{ width: 173, height: 221, background: 'rgba(255,255,255,0.05)', borderRadius: 14 }}
                            />
                        )}
                    </Link>
                </div>
            )}
        </div>

        {statusTooltip && draftData?.reviewStatus && (
            <div
                className={styles.statusTooltip}
                style={{
                    left: statusTooltip.x,
                    top: statusTooltip.y,
                    transform: isMobile ? "translate(-50%, -100%)" : "none",
                }}
            >
                <div className={styles.statusTooltipDesc}>
                    {draftData.reviewStatus === "Pending"
                        ? t("statusPending")
                        : t("statusRejected")}
                </div>
            </div>
        )}
    </div>;
};
