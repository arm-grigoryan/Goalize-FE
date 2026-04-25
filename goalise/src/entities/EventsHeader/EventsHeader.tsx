'use client'
import Image from 'next/image';
import styles from './EventsHeader.module.css';
import event from '../../assets/pngs/Event.svg';
import Button from '@/shared/Button';
import { useState } from 'react';
import CreateEventPopUp from '../CreateEventPopUp';
import teamLogo from '../../assets/pngs/teamLogo.png';
import hostIcon from '../../assets/pngs/hostIcon.svg';
import CustomDivider from '@/shared/Divider';
import addressIcon from '../../assets/pngs/location.svg';
import dateIcon from '../../assets/pngs/calendar.svg';
import clockWhite from '../../assets/pngs/clockWhite.svg';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';

export interface IEventsHeaderProps {
    type?: 'default' | 'detailed';
}
export const EventsHeader: React.FC<IEventsHeaderProps> = ({
    type
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;

    return <div className={`${styles.container} ${isMobile && styles.mobileContainer}`}>
                {type === 'default' ?
                <> 
                    <div className={styles.titleWrapper}>
                        <div className={styles.title}>Events</div>
                        {!isMobile && 
                            <div className={styles.description}>
                                Stay in the game. Catch all the latest matches, tournaments, and live action happening near you or around the world.
                            </div>}
                    </div>
                    <div className={styles.imageButtonWrapper}> 
                        <Image src={event} alt='' className={styles.image}/>
                        <Button 
                            className='red_button'
                            handleClick={() => setIsOpen(true)}
                            content='Create Event'
                        />
                    </div>
                        {isOpen && (
                            <CreateEventPopUp onClose={() => setIsOpen(false)} />
                        )}
                </> :
                <div className={styles.content}>
                     <div className={styles.imageDetailsWrapper}> 
                        <div className={styles.imageWrapper}>
                            <Image src={teamLogo} className={styles.hostImage} alt=''/>
                            <Image src={hostIcon} alt='' className={styles.hostIcon}/>
                        </div>
                        <div className={styles.eventNameWrapper}>
                            <div className={styles.contactNameWrapper}> 
                                <div className={styles.eventName}>Event Name here
                                <div className={styles.button}>
                                    Contact: <span> 01838399289 </span>
                                </div></div>
                            </div>
                            <div className={styles.eventDetails}>
                                Join us for an unforgettable experience at the 
                                Future Forward Summit 2025, a dynamic gathering of 
                                innovators, creatives, and changemakers exploring what’s 
                                next in tech, culture, and society.
                            </div>
                        </div>
                    </div>
                    <CustomDivider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem/>
                    <div className={styles.detailsWrapper}>
                        {isMobile && <CustomDivider orientation='horizontal' flexItem/>}
                        {isMobile &&
                                <div className={styles.registrationDate}>
                                    Registrations will be closed on 
                                    <span>19/04/2025 </span>
                                </div>}
                        <div className={styles.detailsIconText}>
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                                <Image src={addressIcon} alt='' className={styles.icon}/>
                            </div>
                            <div className={styles.detailsText}>742 Evergreen Terrace, Springfield</div>
                        </div>
                        {isMobile && <CustomDivider orientation='horizontal' flexItem/>}
                        <div className={isMobile ? styles.mobileDetailsWrapper : styles.details}> 
                            <div className={styles.detailsIconText}>
                                <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                                    <Image src={dateIcon} alt='' className={styles.icon}/>
                                </div>
                                <div className={styles.detailsText}> 20th Saturday, 10:23 Pm</div>
                            </div>
                            {isMobile && <CustomDivider orientation='vertical' flexItem/>}
                            <div className={styles.detailsIconText}>
                                <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                                    <Image src={clockWhite} alt='' className={styles.icon}/>
                                </div>
                                <div className={styles.detailsText}>30min session</div>
                            </div>
                        </div>
                    </div>
                    <CustomDivider orientation='vertical' flexItem/>
                    <div className={styles.joinedPaymentWrapper}>
                        <Button className='red_button_transparant_white_text' handleClick={() => {}} content='Join'/>
                            <div className={styles.detailsPay}>
                                <div>Pay ֏ 10000</div>
                            </div>
                {/* ------------uncoment below div when needed, this is red text ---------------*/}

                            {/* <div className={styles.maximumText}>
                                Maximum number of participants are already registered
                            </div> */}
                    </div>
                </div>
                }
    </div>
}