'use client'
import Image from 'next/image';
import styles from './EventCard.module.css';
import teamLogo from '../../assets/pngs/teamLogo.png';
import location from '../../assets/pngs/location.svg';
import calendarIcon from '../../assets/pngs/calendarIcon.svg';
import Button from '@/shared/Button';
import arrowRight from '../../assets/pngs/arrowRight.svg';
import hostIcon from '../../assets/pngs/hostIcon.svg';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';
import CustomDivider from '@/shared/Divider';

export interface IEventCardProps {
    variant?: 'upcoming' | 'past';
    canceled?: boolean;
}
export const EventCard: React.FC<IEventCardProps> = ({
    variant = 'upcoming',
    canceled = false,
}) => {
     const { width } = useWindowSize();
     const isMobile = width <= MEDIA_TABLET_SMALL;
    return <div className={styles.container}>
                {canceled && (
                    <div className={styles.canceledRibbon}>
                        Canceled
                    </div>
                    )}
            {!isMobile ? 
            <>
            <div className={styles.imageWrapper}>
                <Image src={teamLogo} className={styles.image} alt=''/>
                <Image src={hostIcon} alt='' className={styles.hostIcon}/>
            </div>
            <div className={styles.infoWrapper}>
                <div className={styles.row}>
                    <div className={styles.namePriceContainer}>
                        <div className={styles.eventName}>Event Name 1</div>
                        {variant === 'upcoming' ? 
                                <div className={styles.price}>
                                    ֏ 10.000
                                </div> : 
                                <div className={styles.participants}>
                                    <div className={styles.participantsText}>Participants</div>
                                    <div className={styles.participantsCount}>241</div>
                            </div>}
                    </div>
                    {variant === 'upcoming' && 
                        <div className={styles.registerDateWrapper}>
                            <div className={styles.registerText}>Registration will be closed on
                            <span>10/04/2026</span></div>
                        </div>}
                </div>
                <div className={styles.row}>
                    <div className={styles.dateWrapper}> 
                        <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                            <Image src={calendarIcon} alt='' className={styles.icon}/>
                        </div>
                        <div className={styles.date}>10/04/2026</div>
                    </div>
                    <div className={styles.adressWrapper}> 
                        <div className={styles.addressIconWrapper}> 
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={location} alt='' className={styles.icon}/>
                            </div>
                            <div className={styles.adress}>742 Evergreen Terrace, Springfield</div>
                        </div>
                            <div className={styles.circleButton} onClick={() => {}}>
                                <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                    <Image src={arrowRight} alt='' className={styles.icon}/> 
                                </div>
                            </div>
                    </div>
                </div>
                {/* {variant === 'upcoming' && 
                    <div className={styles.row}>
                    <div className={styles.buttonsWrapper}> 
                            <Button className='red_button_transparant_white_text' content='Join' handleClick={() => {}}/>
                            <div className={styles.circleButton} onClick={() => {}}>
                                <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                    <Image src={arrowRight} alt='' className={styles.icon}/> 
                                </div>
                            </div>
                        </div> 
                    </div>} */}
            </div>
            </>:
            <div className={styles.mobileContainer}> 
                <div className={styles.mobileImageContainer}>
                     <div className={styles.mobileImageWrapper}>
                        <Image src={teamLogo} className={styles.mobileImage} alt=''/>
                        <Image src={hostIcon} alt='' className={styles.hostIconMobile}/>
                    </div>
                      <div className={styles.mobileNamePriceContainer}>
                        <div className={styles.eventNameMobile}>Event Name 1</div>
                            <div className={styles.dateWrapper}> 
                                <div className={styles.date}>10/04/2026</div>
                        </div>
                        {variant === 'upcoming' ? 
                               <div className={styles.mobileParticipantsWrapper}>
                                 <div className={styles.price}>
                                    ֏ 10.000
                                </div>
                                <div className={styles.circleButton} onClick={() => {}}>
                                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                                <Image src={arrowRight} alt='' className={styles.icon}/> 
                                            </div>
                                        </div>
                            </div> : 
                               <div className={styles.mobileParticipantsWrapper}>
                                    <div className={styles.participants}>
                                        <div className={styles.participantsTextMobile}>Participants</div>
                                        <div className={styles.participantsCountMobile}>241</div>
                                    </div> 
                                        <div className={styles.circleButton} onClick={() => {}}>
                                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                                <Image src={arrowRight} alt='' className={styles.icon}/> 
                                            </div>
                                        </div>
                            </div>}
                    </div>
                </div>
                <CustomDivider orientation='horizontal' flexItem />
                <div className={styles.mobileAddressWrapper}> 
                        <div className={styles.registerDateWrapper}>
                            <div className={styles.registerText}>Registration will be closed on
                            <span>10/04/2026</span>
                            </div>
                        </div>
                    <div className={styles.addressIconWrapper}> 
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={location} alt='' className={styles.icon}/>
                            </div>
                            <div className={styles.adress}>742 Evergreen Terrace, Springfield</div>
                        </div>
                </div>
                {/* {variant === 'upcoming' &&  
                <CustomDivider orientation='horizontal' flexItem />}
                
                  {variant === 'upcoming' && 
                      <div className={styles.row}>
                            <div className={styles.buttonsWrapper}> 
                                    <Button className='red_button_transparant_white_text' content='Join' handleClick={() => {}}/>
                                    <div className={styles.circleButton} onClick={() => {}}>
                                        <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                            <Image src={arrowRight} alt='' className={styles.icon}/> 
                                        </div>
                                    </div>
                                </div> 
                            </div>} */}
            </div>}
   </div>
}