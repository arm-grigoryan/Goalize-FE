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
        setModalState({ open: true, type: 'join', title: 'Join Event', description: 'Are you sure you want to join this event?' });
    };

    const handleOpenUnjoinModal = () => {
        setModalState({ open: true, type: 'unjoin', title: 'Unjoin Event', description: 'Are you sure you want to leave this event?' });
    };

    const handleCloseModal = () => setModalState((prev) => ({ ...prev, open: false }));

    const handleConfirmAction = async () => {
        if (!event) return;
        const actionType = modalState.type;
        setIsActionLoading(true);
        try {
            if (actionType === 'join') {
                await joinEvent(event.id).unwrap();
                setModalState({ open: true, type: 'success', title: 'Success', description: 'You have successfully joined the event!' });
            } else if (actionType === 'unjoin') {
                await unjoinEvent(event.id).unwrap();
                setModalState({ open: true, type: 'success', title: 'Success', description: 'You have successfully left the event.' });
            }
        } catch (error) {
            const apiError = error as { status?: number; data?: { errorMessage?: string } };
            const status = apiError?.status;
            const isServerError = typeof status !== 'number' || status >= 500;
            if (isServerError) {
                setModalState((prev) => ({ ...prev, open: false }));
                showServerErrorToast(apiError?.data?.errorMessage || 'Something went wrong. Please try again later.');
            } else {
                setModalState({ open: true, type: 'error', title: 'Error', description: apiError?.data?.errorMessage || 'An error occurred. Please try again.' });
            }
        } finally {
            setIsActionLoading(false);
        }
    };

    if (type !== 'detailed') {
        return (
            <div className={`${styles.container} ${isMobile && styles.mobileContainer}`}>
                <div className={styles.titleWrapper}>
                    <div className={styles.title}>Events</div>
                    {!isMobile &&
                        <div className={styles.description}>
                            Stay in the game. Catch all the latest matches, tournaments, and live action happening near you or around the world.
                        </div>}
                </div>
                <div className={styles.imageButtonWrapper}>
                    <Image src={eventBanner} alt='' className={styles.image} />
                    <Button
                        className='red_button'
                        handleClick={handleCreateEventClick}
                        content='Create Event'
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
    const showRegistrationOpen = event.state === 'Upcoming' && !isFull && !isRegClosed;

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

    const renderRightSection = () => {
        if (event.state === 'Cancelled') {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.cancelledLabel}>Canceled</div>
                </div>
            );
        }

        if (event.state === 'Past') {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.detailsPay}>
                        <div>Pay ֏ {event.registrationAmount?.toLocaleString('en-US').replace(/,/g, '.') ?? 0}</div>
                    </div>
                </div>
            );
        }

        // Upcoming
        if (isFull) {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.detailsPay}>
                        <div>Pay ֏ {event.registrationAmount?.toLocaleString('en-US').replace(/,/g, '.') ?? 0}</div>
                    </div>
                    <div className={styles.maximumText}>
                        Maximum number of participants are already registered
                    </div>
                </div>
            );
        }

        if (isRegClosed) {
            return (
                <div className={styles.joinedPaymentWrapper}>
                    <div className={styles.detailsPay}>
                        <div>Pay ֏ {event.registrationAmount?.toLocaleString('en-US').replace(/,/g, '.') ?? 0}</div>
                    </div>
                    <div className={styles.maximumText}>
                        You can no longer register. The registration period is over.
                    </div>
                </div>
            );
        }

        // Registration is open
        let actionButton;
        if (isHost) {
            actionButton = (
                <Button
                    className='red_button_transparant_white_text'
                    handleClick={() => setIsOpen(true)}
                    content='Manage'
                />
            );
        } else if (isAuthenticated && isParticipant) {
            actionButton = (
                <Button
                    className='red_button_transparant_white_text'
                    handleClick={handleOpenUnjoinModal}
                    content='Unjoin'
                    disabled={isActionLoading}
                />
            );
        } else {
            actionButton = (
                <Button
                    className='red_button_transparant_white_text'
                    handleClick={isAuthenticated ? handleOpenJoinModal : handleJoin}
                    content='Join'
                    disabled={isActionLoading}
                />
            );
        }

        return (
            <div className={styles.joinedPaymentWrapper}>
                {actionButton}
                <div className={styles.detailsPay}>
                    <div>Pay ֏ {event.registrationAmount?.toLocaleString('en-US').replace(/,/g, '.') ?? 0}</div>
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
                                        Contact: <span>{event.hostUser.phoneNumber}</span>
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
                    {isMobile && showRegistrationOpen && formattedRegClose && (
                        <div className={styles.registrationDate}>
                            Registrations will be closed on
                            <span>{formattedRegClose}</span>
                        </div>
                    )}
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
                            <div className={styles.detailsText}>{event.duration}min session</div>
                        </div>
                    </div>
                </div>
                <CustomDivider orientation='vertical' flexItem />
                {renderRightSection()}
            </div>
            {isOpen && <CreateEventPopUp onClose={() => setIsOpen(false)} />}

            {modalState.open && modalState.type !== 'error' && modalState.type !== 'success' && (
                <PlayerInvitationCard
                    title={modalState.title}
                    description={modalState.description}
                    confirmButtonText='Confirm'
                    cancelButtonText='Cancel'
                    onConfirmButtonClick={handleConfirmAction}
                    onCancelButtonClick={handleCloseModal}
                    loading={isActionLoading}
                />
            )}

            {modalState.open && (modalState.type === 'error' || modalState.type === 'success') && (
                <PlayerInvitationCard
                    title={modalState.title}
                    description={modalState.description}
                    cancelButtonText='Close'
                    onCancelButtonClick={handleCloseModal}
                />
            )}

            {serverError && (
                <NotificationPopUp
                    title='Server Error'
                    description={serverError}
                />
            )}
        </div>
    );
};
