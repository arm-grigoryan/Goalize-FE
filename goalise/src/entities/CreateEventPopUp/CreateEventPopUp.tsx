import React from "react";
import styles from './CreateEventPopUp.module.css';
import Image from "next/image";
import redClipboard from '../../assets/pngs/redClipboard.svg';
import addressGray from '../../assets/pngs/addressGray.svg';
import startTime from '../../assets/pngs/startTime.svg';
import dateGray from '../../assets/pngs/dateGray.svg';
import dramSymbolGray from '../../assets/pngs/dramSymbolGray.svg';
import infoGray from '../../assets/pngs/infoGray.svg';
import Button from "@/shared/Button";
import rightArrow from '../../assets/pngs/rightArrow.svg';
import trash from '../../assets/pngs/trash.svg';
// import AddressPicker from "../AddressPicker";
// import { TimePicker } from "../TimePicker/TimePicker";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export interface ICreateEventPopUpProps {
    onClose: () => void;
}
export const CreateEventPopUp: React.FC<ICreateEventPopUpProps> = ({ onClose }) => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;

    return <div className={styles.overlay}>
                <div className={`${styles.container} ${isMobile && styles.mobileContainer}`}>
                    <div className={styles.title}>Create Event</div>
                    <div className={styles.inputsWrapper}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputTitle}>Event Title</div>
                            <div className={styles.inputWithIcon}>
                                <Image
                                    src={redClipboard}
                                    alt=""
                                    className={styles.inputIcon}
                                />
                                <input className={styles.input} placeholder="Event Title"/>
                            </div>
                        </div>
                        <div className={styles.addressWrapper}>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Address</div>
                                <div className={styles.inputWithIcon}>
                                    <Image 
                                        src={addressGray}
                                        alt=""
                                        className={styles.inputIcon}
                                    />
                                    <input className={styles.input} placeholder="Address"/>
                                </div>
                            </div>
                            {/* <AddressPicker />  */}
                        </div>
                        <div className={styles.timeInputsWrapper}> 
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Start Time</div>
                                <div className={styles.inputWithIcon}>
                                    <Image 
                                        src={startTime}
                                        alt=""
                                        className={styles.inputIcon}
                                    />
                                    <input className={styles.input} placeholder="Start Time"/>
                                </div>
                            </div>
                            <div className={styles.dateWrapper}> 
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>Registration Closed</div>
                                    <div className={styles.inputWithIcon}>
                                        <Image 
                                            src={dateGray}
                                            alt=""
                                            className={styles.inputIcon}
                                        />
                                        <input className={styles.input} placeholder="Date"/>
                                    </div>
                                </div>
                                {/* <TimePicker /> */}
                            </div>
                        </div>
                        <div className={styles.paymentInputsWrapper}>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}> Duration</div>
                                <div className={styles.inputWithIcon}> 
                                    <div className={styles.inputText}>Min</div>
                                    <input className={styles.input}/>
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Payment Amount</div>
                                <div className={styles.inputWithIcon}>
                                    <Image 
                                        src={dramSymbolGray}
                                        alt=""
                                        className={styles.inputIcon}
                                    />
                                    <input className={styles.input} placeholder="Amount"/>
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Participant Count</div>
                                <input className={styles.inputNoIcon} placeholder="00"/>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputTitle}>Additional Info</div>
                            <div className={styles.inputWithIcon}>
                                    <Image 
                                        src={infoGray}
                                        alt=""
                                        className={styles.inputIcon}
                                    />
                                    <input className={styles.input} placeholder="Additional Info"/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonsWrapper}>
                        <Button className="gray_buttonIcon" handleClick={onClose} content="Create" rightIcon={rightArrow}/>
                        <div className={styles.textButtonWrapper} onClick={onClose}> 
                            <div className={styles.textButton}>Cancel</div>
                            <Image src={trash} alt="" />
                        </div>
                    </div>
                    </div>
            </div>
}