'use client'
import Image from 'next/image';
import styles from './EventsHeader.module.css';
import eventBanner from '../../assets/pngs/Event.svg';
import Button from '@/shared/Button';
import { useRef, useState } from 'react';
import CreateEventPopUp from '../CreateEventPopUp';
import hostIcon from '../../assets/pngs/hostIcon.svg';
import CustomDivider from '@/shared/Divider';
import addressIcon from '../../assets/pngs/location.svg';
import dateIcon from '../../assets/pngs/calendar.svg';
import clockWhite from '../../assets/pngs/clockWhite.svg';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';
import { useAuth } from '@/shared/auth/AuthContext';
import { IEventDetail } from '@/types/api/events';
import { formatUTCDate } from '@/helper/formatDateAndTime';
import noPhoto from '../../assets/pngs/noPhoto.png';
import { useJoinEventMutation, useUnjoinEventMutation } from '@/app/store/services/api';
import PlayerInvitationCard from '../PlayerInvitationCard';
import { NotificationPopUp } from '../NotificationPopUp/NotificationPopUp';
import { useTranslations } from 'next-intl';

const isValidUrl = (url: string): boolean => {
    try { new URL(url); return true; } catch { return false; }
};

export interface IEventsHeaderProps {
    type?: 'default' | 'detailed';
    event?: IEventDetail;
    myPlayerId?: number;
}

export const EventsHeader: React.FC<IEventsHeaderProps> = ({ type, event, myPlayerId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalState, setModalState] = useState<{
        open: boolean;
        type: 'join' | 'unjoin' | 'success' | 'error';
        title: string;
        description: string;
    }>({ open: false, type: 'join', title: '', description: '' });
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    const { isAuthenticated, signIn } = useAuth();
    const [joinEvent] = useJoinEventMutation();
    const [unjoinEvent] = useUnjoinEventMutation();
    const t = useTranslations("events.header");
    const tEvents = useTranslations("events");
    const tCommon = useTranslations("common");

    const showServerErrorToast = (message: string) => {
        setServerError(message);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => setServerError(null), 4000);
    };

    const handleCreateEventClick = () => {
        if (!isAuthenticated) {
            signIn();
            return;
        }
        setIsOpen(true);
    };

    const handleOpenJoinModal = () => {
        if (!isAuthenticated) { signIn(); return; }
        setModalState({ open: true, type: 'join', title: t('joinEventTitle'), description: t('joinEventDescription') });
    };

    const handleOpenUnjoinModal = () => {
        setModalState({ open: true, type: 'unjoin', title: t('unjoinEventTitle'), description: t('unjoinEventDescription') });
    };

    const handleCloseModal = () => setModalState((prev) => ({ ...prev, open: false }));

    const handleConfirmAction = async () => {
        if (!event) return;
        const actionType = modalState.type;
        setIsActionLoading(true);
        try {
            if (actionType === 'join') {
                await joinEvent(event.id).unwrap();
                setModalState({ open: true, type: 'success', title: t('successTitle'), description: t('joinSuccess') });
            } else if (actionType === 'unjoin') {
                await unjoinEvent(event.id).unwrap();
                setModalState({ open: true, type: 'success', title: t('successTitle'), description: t('leaveSuccess') });
            }
        } catch (error) {
            const apiError = error as { status?: number; data?: { errorMessage?: string } };
            const status = apiError?.status;
            const isServerError = typeof status !== 'number' || status >= 500;
            if (isServerError) {
                setModalState((prev) => ({ ...prev, open: false }));
                showServerErrorToast(apiError?.data?.errorMessage || t('genericError'));
            } else {
                setModalState({ open: true, type: 'error', title: t('errorTitle'), description: apiError?.data?.errorMessage || t('errorOccurred') });
            }
        } finally {
            setIsActionLoading(false);
        }
    };

    if (type !== 'detailed') {
        return (
            <div className={`${styles.container} ${isMobile && styles.mobileContainer}`}>
                <Image
                    src="/pngs/nextMatchLeftInnerBackground.png"
                    alt=""
                    className={styles.bgImage}
                    aria-hidden
                    width={600}
                    height={300}
                />
                <div className={styles.titleWrapper}>
                    <div className={styles.title}>{t("title")}</div>
                    {!isMobile &&
                        <div className={styles.description}>
                            {t("description")}
                        </div>}
                </div>
                <div className={styles.imageButtonWrapper}>
                    <Image src={eventBanner} alt='' className={styles.image} />
                    <Button
                        className='red_button'
                        handleClick={handleCreateEventClick}
                        content={t("createEvent")}
                    />
                </div>
                {isOpen && <CreateEventPopUp onClose={() => setIsOpen(false)} />}
            </div>
        );
    }

    if (!event) return null;

    const now = new Date();
    const participants = event.participants ?? [];
    const participantsCount = participants.length;
    const isFull = event.requiredPlayersAmount > 0 && participantsCount >= event.requiredPlayersAmount;
    const isRegClosed = event.registrationCloseDate
        ? new Date(event.registrationCloseDate) <= now
        : false;
    const isPast = event.state === 'Past' || new Date(event.startTime) <= now;

    const isHost = myPlayerId !== undefined && myPlayerId === event.hostId;
    const isParticipant = participants.some((p) => p.playerId === myPlayerId);

    const hostPic = event.hostUser.profilePic && isValidUrl(event.hostUser.profilePic)
        ? event.hostUser.profilePic
        : noPhoto;

    const formattedStartTime = formatUTCDate(event.startTime, 'dd/mm/yyyy HH:MM');
    const formattedRegClose = event.registrationCloseDate
        ? formatUTCDate(event.registrationCloseDate, 'dd/mm/yyyy HH:MM')
        : null;

    const handleJoin = () => {
        if (!isAuthenticated) {
            signIn();
        }
    };

    const payAmount = event.registrationAmount?.toLocaleString('en-US').replace(/,/g, '.') ?? 0;

    const renderRightSection = () => {
        if (event.state === 'Cancelled') {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.cancelledLabel}>{t("canceledLabel")}</div>
                </div>
            );
        }

        if (isPast) {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.detailsPay}>
                        <div>{t("payLabel")} ֏ {payAmount}</div>
                    </div>
                    <div className={styles.finishedLabel}>{t("finishedLabel")}</div>
                </div>
            );
        }

        // Upcoming — host always sees Manage + Pay, nothing else
        if (isHost) {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <Button
                        className='red_button_transparant_white_text'
                        handleClick={() => setIsOpen(true)}
                        content={t("manageButton")}
                    />
                    <div className={styles.detailsPay}>
                        <div>{t("payLabel")} ֏ {payAmount}</div>
                    </div>
                </div>
            );
        }

        // Upcoming — participant (not host): only registrationCloseDate matters
        if (isAuthenticated && isParticipant) {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <Button
                        className='red_button_transparant_white_text'
                        handleClick={handleOpenUnjoinModal}
                        content={t("unjoinButton")}
                        disabled={isRegClosed || isActionLoading}
                    />
                    <div className={styles.detailsPay}>
                        <div>{t("payLabel")} ֏ {payAmount}</div>
                    </div>
                    {isRegClosed && (
                        <div className={styles.maximumText}>
                            {t("canNoLongerLeave")}
                        </div>
                    )}
                </div>
            );
        }

        // Upcoming — not logged in or logged in but not a participant
        if (isFull) {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.detailsPay}>
                        <div>{t("payLabel")} ֏ {payAmount}</div>
                    </div>
                    <div className={styles.maximumText}>
                        {t("maxParticipants")}
                    </div>
                </div>
            );
        }

        if (isRegClosed) {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.detailsPay}>
                        <div>{t("payLabel")} ֏ {payAmount}</div>
                    </div>
                    <div className={styles.maximumText}>
                        {t("canNoLongerRegister")}
                    </div>
                </div>
            );
        }

        // Registration is open
        return (
            <div className={styles.joinedPaymentWrapper}>
                <Button
                    className='red_button_transparant_white_text'
                    handleClick={isAuthenticated ? handleOpenJoinModal : handleJoin}
                    content={t("joinButton")}
                    disabled={isActionLoading}
                />
                <div className={styles.detailsPay}>
                    <div>{t("payLabel")} ֏ {payAmount}</div>
                </div>
            </div>
        );
    };

    return (
        <div className={`${styles.container} ${isMobile && styles.mobileContainer}`}>
            <div className={styles.content}>
                <div className={styles.imageDetailsWrapper}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={hostPic}
                            className={styles.hostImage}
                            alt=''
                            width={166}
                            height={166}
                            unoptimized={typeof hostPic === 'string'}
                        />
                        <Image src={hostIcon} alt='' className={styles.hostIcon} />
                    </div>
                    <div className={styles.eventNameWrapper}>
                        <div className={styles.contactNameWrapper}>
                            <div className={styles.eventName}>
                                {event.name}
                                {event.hostUser.phoneNumber && (
                                    <div className={styles.button}>
                                        {t("contactLabel")} <span>{event.hostUser.phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {event.additionalInfo && (
                            <div className={styles.eventDetails}>{event.additionalInfo}</div>
                        )}
                    </div>
                </div>
                <CustomDivider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem />
                <div className={styles.detailsWrapper}>
                    {isMobile && <CustomDivider orientation='horizontal' flexItem />}
                    <div className={styles.detailsIconText}>
                        <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                            <Image src={addressIcon} alt='' className={styles.icon} />
                        </div>
                        <div className={styles.detailsText}>{event.address}</div>
                    </div>
                    {isMobile && <CustomDivider orientation='horizontal' flexItem />}
                    <div className={isMobile ? styles.mobileDetailsWrapper : styles.details}>
                                                <div className={styles.detailsIconText}>
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={dateIcon} alt='' className={styles.icon} />
                            </div>
                            <div className={styles.detailsText}>{formattedStartTime}</div>
                        </div>
                        {isMobile && <CustomDivider orientation='vertical' flexItem />}
                        <div className={styles.detailsIconText}>
                                <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                    <Image src={clockWhite} alt='' className={styles.icon} />
                                </div>
                                <div className={styles.detailsText}>{t("minSession", { duration: event.duration })}</div>
                        </div>
                    </div>
                </div>
                <CustomDivider orientation='vertical' flexItem />
                {renderRightSection()}
                  {isMobile && !isRegClosed && formattedRegClose && !isPast && event.state !== 'Cancelled' && (!isAuthenticated || !isParticipant || isHost) && (
                        <div className={styles.registrationDate}>
                            {tEvents("registrationsWillBeClosedOn")}
                            <span>{formattedRegClose}</span>
                        </div>
                  )}
            </div>
            {isOpen && <CreateEventPopUp onClose={() => setIsOpen(false)} event={event} />}

            {modalState.open && modalState.type !== 'error' && modalState.type !== 'success' && (
                <PlayerInvitationCard
                    title={modalState.title}
                    description={modalState.description}
                    confirmButtonText={tCommon("confirm")}
                    cancelButtonText={tCommon("cancel")}
                    onConfirmButtonClick={handleConfirmAction}
                    onCancelButtonClick={handleCloseModal}
                    loading={isActionLoading}
                />
            )}

            {modalState.open && (modalState.type === 'error' || modalState.type === 'success') && (
                <PlayerInvitationCard
                    title={modalState.title}
                    description={modalState.description}
                    cancelButtonText={tCommon("close")}
                    onCancelButtonClick={handleCloseModal}
                />
            )}

            {serverError && (
                <NotificationPopUp
                    title={t("serverError")}
                    description={serverError}
                />
            )}
        </div>
    );
};