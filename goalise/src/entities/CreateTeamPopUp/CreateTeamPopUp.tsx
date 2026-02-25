import React from "react";
import styles from './CreateTeamPopUp.module.css';
import Image from "next/image";
import editIcon from '../../assets/pngs/editIcon.svg';
import teamLogo from '../../assets/pngs/teamLogo.png';
import leftArrow from '../../assets/pngs/leftArrow.svg';
import teamIcon from '../../assets/pngs/teamIcon.svg';
import searchIconGray from '../../assets/pngs/searchIconGray.svg';
import abbreviationIcon from '../../assets/pngs/abbreviation.svg';
import inviteIcon from '../../assets/pngs/inviteIcon.svg';
import Button from "@/shared/Button";

export interface ICreateTeamPopUpProps {
    open: boolean;
    onClose: () => void;
}
export const CreateTeamPopUp: React.FC<ICreateTeamPopUpProps> = ({
    open,
    onClose,
}) => {
        if (!open) return null;

    return <>
    <div className={styles.overlay} onClick={onClose}></div>
    <div className={styles.container}>
                <div className={styles.titleWrapper}>
                    <div className={styles.title}>Create Team</div>
                    <div className={styles.subTitle}> Your wining journey starts here!</div>
                </div>
            <div className={styles.imageWrapper}>
                <Image
                    src={teamLogo}
                    alt=""
                    className={styles.image}
                />
                <div className={styles.editWrapper}>
                    <Image src={editIcon} alt="" className={styles.editIcon}/>
                    <div className={styles.editText}>Upload logo</div>
                </div>
            </div>
            <div className={styles.inputs}>
                <div className={styles.inputWrapper}>
                    <div className={styles.label}>Team Name</div>
                   <div className={styles.inputWithIcon}>
                    <Image src={teamIcon} alt="" className={styles.inputIcon} />
                    <input className={styles.input} placeholder="e.g. Barcelona" />
                </div>
                </div>
                <div className={styles.inputWrapper}>
                    <div className={styles.label}>Abbreviation</div>
                    <div className={styles.inputWithIcon}>
                        <Image src={abbreviationIcon} alt="" className={styles.inputIcon} />
                        <input className={styles.input} placeholder="e.g. FCB"/>
                    </div>
                </div>
                <div>
                    <div className={styles.label}>Invite Members</div>
                    <div className={styles.inputWithIcon}>
                        <Image src={inviteIcon} alt="" className={styles.inputIcon} />
                        <input  className={styles.input} placeholder="Invite Members"/>
                        <Image src={searchIconGray} alt="" className={styles.serachIcon}/>
                    </div>
                </div>
                
            </div>
            <div className={styles.buttonWrappper}>
               {onClose && 
                <Button 
                    className="gray_buttonIcon"
                    content="Create"
                    handleClick={onClose}
                    leftIcon={leftArrow}
                />}
            </div>
    </div>
    </>
}