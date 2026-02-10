"use client";

import { useGetLeaguesInfoQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";
import { Loader } from "@/shared/Loader/Loader";
import React from "react";

export const LeaguePageWrapper = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { leagueId } = useParams();
    const id = Number(leagueId);

    const { data: leagueInfo, isLoading } = useGetLeaguesInfoQuery(id, {
        skip: !id,
    });

    if (isLoading || !leagueInfo) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
};
