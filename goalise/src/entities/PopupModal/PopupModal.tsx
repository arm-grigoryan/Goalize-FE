"use client";
import type { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import styles from "./PopupModal.module.css";
import Button from "@/shared/Button";
import Title from "@/shared/Title";
import { useTranslations } from "next-intl";

interface PopupModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonContent: string;
  hasCloseButton?: boolean;
  onButtonClick?: () => void;
  showCancelButton?: boolean;
  cancelButtonContent?: string;
}

export const PopupModal: FC<PopupModalProps> = ({
  open,
  onClose,
  title,
  description,
  buttonContent,
  hasCloseButton = false,
  onButtonClick,
  showCancelButton = false,
  cancelButtonContent,
}) => {
  const tCommon = useTranslations("common");
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.popup_modal}>
      <Title content={title} className="title_40" />
      <span className={styles.popup_modal_description_wrapper}>
        {description}
      </span>
      <DialogActions>
        <Button
          className="red_button"
          content={buttonContent}
          handleClick={handleButtonClick}
        />
        {(hasCloseButton || showCancelButton) && (
          <Button
            className="red_button_transparant_white_text"
            content={cancelButtonContent ?? tCommon("cancel")}
            handleClick={() => onClose()}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};
