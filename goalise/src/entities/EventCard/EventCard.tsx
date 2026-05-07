'use client'
import Image from 'next/image';
import styles from './EventCard.module.css';
import noPhoto from '../../assets/pngs/noPhoto.png';
import hostIcon from '../../assets/pngs/hostIcon.svg';
import locationIcon from '../../assets/pngs/location.svg';
import calendarIcon from '../../assets/pngs/calendarIcon.svg';
import arrowRight from '../../assets/pngs/arrowRight.svg';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';
import CustomDivider from '@/shared/Divider';
import { IEvent } from '@/types/api/events';
import { formatUTCDate } from '@/helper/formatDateAndTime';
import { useRouter } from 'next/navigation';

export interface IEventCardProps {
    variant?: 'upcoming' | 'past';
    event: IEvent;
}

export const EventCard: React.FC<IEventCardProps> = ({
    variant = 'upcoming',
    event,
}) => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    const router = useRouter();

    const isCancelled = event.state === 'Cancelled';
    const formattedDate = formatUTCDate(event.startTime, 'dd/mm/yyyy');
    const formattedCloseDate = formatUTCDate(event.registrationCloseDate ?? null, 'dd/mm/yyyy HH:MM');
    const formattedAmount = event.registrationAmount !== null && event.registrationAmount !== undefined
        ? `֏ ${event.registrationAmount.toLocaleString('en-US').replace(/,/g, '.')}`
        : null;

    const hostPic = event.hostUser?.profilePic?.startsWith('http') ? event.hostUser.profilePic : noPhoto;
    const isExternalHostPic = !!event.hostUser?.profilePic?.startsWith('http');

    const handleNavigate = () => router.push(`/events/${event.id}`);

    return <div className={styles.container}>
        {isCancelled && (
            <div className={styles.canceledRibbon}>
                Canceled
            </div>
        )}
        {!isMobile ?
            <>
                <div className={styles.imageWrapper}>
                    <Image
                        src={hostPic}
                        width={166}
                        height={166}
                        className={styles.image}
                        alt=''
                        unoptimized={isExternalHostPic}
                    />
                    <Image src={hostIcon} alt='' className={styles.hostIcon} />
                </div>
                <div className={styles.infoWrapper}>
                    <div className={styles.row}>
                        <div className={styles.namePriceContainer}>
                            <div className={styles.eventName}>{event.name}</div>
                            {variant === 'upcoming' && formattedAmount &&
                                <div className={styles.price}>{formattedAmount}</div>
                            }
                            {variant === 'past' && !isCancelled &&
                                <div className={styles.participants}>
                                    <div className={styles.participantsText}>Participants</div>
                                    <div className={styles.participantsCount}>{event.participatedPlayersCount}</div>
                                </div>
                            }
                        </div>
                        {variant === 'upcoming' &&
                            <div className={styles.registerDateWrapper}>
                                <div className={styles.registerText}>Registration will be closed on
                                    <span>{formattedCloseDate}</span>
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.row}>
                        <div className={styles.dateWrapper}>
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={calendarIcon} alt='' className={styles.icon} />
                            </div>
                            <div className={styles.date}>{formattedDate}</div>
                        </div>
                        <div className={styles.adressWrapper}>
                            <div className={styles.addressIconWrapper}>
                                <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                    <Image src={locationIcon} alt='' className={styles.icon} />
                                </div>
                                <div className={styles.adress}>{event.address}</div>
                            </div>
                            <div className={styles.circleButton} onClick={handleNavigate}>
                                <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                    <Image src={arrowRight} alt='' className={styles.icon} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </> :
            <div className={styles.mobileContainer}>
                <div className={styles.mobileImageContainer}>
                    <div className={styles.mobileImageWrapper}>
                        <Image
                            src={hostPic}
                            width={100}
                            height={100}
                            className={styles.mobileImage}
                            alt=''
                            unoptimized={isExternalHostPic}
                        />
                        <Image src={hostIcon} alt='' className={styles.hostIconMobile} />
                    </div>
                    <div className={styles.mobileNamePriceContainer}>
                        <div className={styles.eventNameMobile}>{event.name}</div>
                        <div className={styles.dateWrapper}>
                            <div className={styles.date}>{formattedDate}</div>
                        </div>
                        {variant === 'upcoming' &&
                            <div className={styles.mobileParticipantsWrapper}>
                                {formattedAmount && <div className={styles.price}>{formattedAmount}</div>}
                                <div className={styles.circleButton} onClick={handleNavigate}>
                                    <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                        <Image src={arrowRight} alt='' className={styles.icon} />
                                    </div>
                                </div>
                            </div>
                        }
                        {variant === 'past' &&
                            <div className={styles.mobileParticipantsWrapper}>
                                {!isCancelled &&
                                    <div className={styles.participants}>
                                        <div className={styles.participantsTextMobile}>Participants</div>
                                        <div className={styles.participantsCountMobile}>{event.participatedPlayersCount}</div>
                                    </div>
                                }
                                <div className={styles.circleButton} onClick={handleNavigate}>
                                    <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                        <Image src={arrowRight} alt='' className={styles.icon} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <CustomDivider orientation='horizontal' flexItem />
                <div className={styles.mobileAddressWrapper}>
                    {variant === 'upcoming' &&
                        <div className={styles.registerDateWrapper}>
                            <div className={styles.registerText}>Registration will be closed on
                                <span>{formattedCloseDate}</span>
                            </div>
                        </div>
                    }
                    <div className={styles.addressIconWrapper}>
                        <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                            <Image src={locationIcon} alt='' className={styles.icon} />
                        </div>
                        <div className={styles.adress}>{event.address}</div>
                    </div>
                </div>
            </div>
        }
    </div>
}
