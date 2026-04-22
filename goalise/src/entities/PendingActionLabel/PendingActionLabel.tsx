"use client";

import { useState } from "react";
import Image from "next/image";
import { ClickAwayListener, Tooltip } from "@mui/material";
import leaguesHeaderStyles from "@/components/LeaguesHeader/LeaguesHeader.module.css";
import joinedIcon from "@/assets/pngs/joinedIcon.svg";

interface PendingActionLabelProps {
  text: string;
  tooltipText: string;
}

export const PendingActionLabel: React.FC<PendingActionLabelProps> = ({
  text,
  tooltipText,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        title={tooltipText}
        open={open}
        arrow
        disableHoverListener
        disableFocusListener
        disableTouchListener
        onClose={() => setOpen(false)}
        slotProps={{ tooltip: { sx: { fontSize: 13 } } }}
      >
        <div
          className={leaguesHeaderStyles.joinedButton}
          style={{ cursor: "default" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className={leaguesHeaderStyles.joinedButtonWrapper}>
            <Image
              className={leaguesHeaderStyles.joinedButtonIcon}
              src={joinedIcon}
              alt=""
            />
            <div className={leaguesHeaderStyles.stageButtonName}>{text}</div>
          </div>
        </div>
      </Tooltip>
    </ClickAwayListener>
  );
};
