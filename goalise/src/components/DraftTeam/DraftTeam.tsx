"use client";
import DraftTeamHeader from "@/entities/DraftTeamHeader";
import Image from "next/image";
import React from "react";
import emptyImage from '../../assets/pngs/nextMatchEmpty.svg';
import styles from './DraftTeam.module.css';
import { ITeamDraft } from "@/types/api/temas";
import { useTranslations } from "next-intl";

interface IDraftTeamProps {
    draftData?: ITeamDraft;
    teamId: number;
    isLoading?: boolean;
    isError?: boolean;
    isCaptain?: boolean;
}

export const DraftTeam: React.FC<IDraftTeamProps> = ({
    draftData,
    teamId,
    isLoading,
    isError,
    isCaptain,
}) => {
    const t = useTranslations("draftTeam");
    return <div className={styles.container}>
        <DraftTeamHeader
            draftData={draftData}
            teamId={teamId}
            isLoading={isLoading}
            isError={isError}
            isCaptain={isCaptain}
        />
        <div className={styles.imageWrapper}>
            <Image
                src={emptyImage}
                alt=""
                className={styles.image}
            />
            <span>{t("underReview")}</span>
        </div>
    </div>;
};
