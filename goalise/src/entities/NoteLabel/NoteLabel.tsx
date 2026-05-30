import styles from './NoteLabel.module.css';
import Image from 'next/image';
import infoIcon from '../../assets/pngs/infoIcon.svg';
import { useTranslations } from 'next-intl';

export const NoteLabel: React.FC= () => {
   const t = useTranslations("notes");
    return <div className={styles.note}>
          <Image src={infoIcon} alt="" className={styles.infoIcon}/>
          <div> 
            <span> Note:</span> 
            {t("note")}
          </div>
      </div>
}