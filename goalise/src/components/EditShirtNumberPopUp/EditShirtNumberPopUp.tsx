import React from "react";
import styles from './EditShirtNumberPopUp.module.css';
import Image from "next/image";
import redArrowRight from '../../assets/pngs/redArrowRight.svg';
import shirt from '../../assets/pngs/shirt.svg';
import Button from "@/shared/Button";
import arrowRightIcon from '../../assets/pngs/arrowRightIcon.png';
export interface IEditShirtNumberPopUpProps {
    shirtNumber?: string;
    onButtonClick: () => void;
}
export const EditShirtNumberPopUp: React.FC<IEditShirtNumberPopUpProps> = ({
    shirtNumber,
    onButtonClick
}) => {
    return <div className={styles.overlay}>
        <div className={styles.container}>
            <div className={styles.titleWrapper}> 
                <div className={styles.title}>Edit Shirt Number</div>
                <div className={styles.subTitle}>Your winning journey starts here!</div>
            </div>
            <div className={styles.inputsContainer}>
                <div className={styles.editText}>Edit Shirt Number</div>
                <div className={styles.inputsWrapper}>
                    <div className={styles.inputWrapper}>
                        <input type="text" required />
                            <label>Current</label>
                    </div>
                    <Image src={redArrowRight} alt=""/>
                    <div className={styles.inputWrapper}>
                        <input type="text" required />
                            <label>New</label>
                    </div>
                </div>
            </div>
            <div className={styles.describtionWrapper}>
                <div className={`${styles.iconWrapper} ${styles.blueGlow}`}> 
                    <Image src={shirt} alt="" className={styles.icon}/>
                </div>
                <div className={styles.describtion}>The player with shirt number {shirtNumber} will be switch to new number</div>
            </div>
            <Button className="gray_buttonIcon" handleClick={onButtonClick} content="Save" icon={arrowRightIcon}/>
    </div>
    </div> 
}