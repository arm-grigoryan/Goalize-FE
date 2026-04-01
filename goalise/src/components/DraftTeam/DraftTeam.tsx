import DraftTeamHeader from "@/entities/DraftTeamHeader";
import Image from "next/image";
import React from "react";
import emptyImage from '../../assets/pngs/nextMatchEmpty.svg';
import styles from './DraftTeam.module.css';
import { ITeamDraft } from "@/types/api/temas";
import { useGetPlayerBasicInfoQuery } from "@/app/store/services/api";

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
    const { data: captainData } = useGetPlayerBasicInfoQuery(draftData?.captainId as number, {
        skip: !draftData?.captainId,
    });

    return <div className={styles.container}>
        <DraftTeamHeader
            draftData={draftData}
            captainData={captainData}
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
            <span>No data available yet — your team is still under review.</span>
        </div>
    </div>;
};
