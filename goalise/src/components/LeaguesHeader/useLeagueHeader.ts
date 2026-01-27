import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    useGetLeaguesInfoQuery,
    useGetLeaguesJoinedTeamsQuery,
    useJoinLeagueMutation,
    useUnjoinLeagueMutation,
    useGetUserInfoQuery,
} from "@/app/store/services/api";
import { useAuth } from "@/shared/auth/AuthContext";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export const useLeagueHeader = () => {
    const { leagueId } = useParams();
    const router = useRouter();
    const { isAuthenticated, signIn } = useAuth();
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;

    const id = Number(leagueId);

    const { data: leagueData, refetch: refetchLeague } = useGetLeaguesInfoQuery(id, { skip: !id });
    const { data: joinedTeams, refetch: refetchJoinedTeams } = useGetLeaguesJoinedTeamsQuery(id, { skip: !id });
    const { data: userInfo, refetch: refetchUserInfo } = useGetUserInfoQuery(undefined, { skip: !isAuthenticated });

    const [joinLeague, { isLoading: isJoining }] = useJoinLeagueMutation();
    const [unjoinLeague, { isLoading: isUnjoining }] = useUnjoinLeagueMutation();

    const [modalState, setModalState] = useState<{
        open: boolean;
        type: "join" | "unjoin" | "success" | "error";
        title: string;
        description: string;
    }>({
        open: false,
        type: "join",
        title: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const isRegistrationClosed = (leagueData?.state === "Registration") &&
        (new Date(leagueData.registrationDate) < new Date() ||
            (joinedTeams && leagueData?.maxTeamsCount && joinedTeams.length >= leagueData.maxTeamsCount));

    const registrationClosedReason = isRegistrationClosed
        ? (joinedTeams && leagueData?.maxTeamsCount && joinedTeams.length >= leagueData.maxTeamsCount)
            ? "Max teams count is reached"
            : "Registration date is expired"
        : null;

    const userTeam = userInfo?.playerInfo?.team;
    const isUserCaptain = userTeam && userTeam.captainId === userInfo?.playerInfo?.id;
    const isTeamJoined = userTeam && joinedTeams?.some((team) => team.id === userTeam.id);

    const handleOpenJoinModal = () => {
        if (!isAuthenticated) {
            signIn();
            return;
        }

        if (!userTeam) {
            setModalState({
                open: true,
                type: "error",
                title: "Error",
                description: "You need to be in a team first, to join a league",
            });
            return;
        }

        if (!isUserCaptain) {
            setModalState({
                open: true,
                type: "error",
                title: "Error",
                description: "Only Captain can register the team to the league",
            });
            return;
        }

        if (isTeamJoined) {
            setModalState({
                open: true,
                type: "error",
                title: "Info",
                description: "Your team is already registered",
            });
            return;
        }

        setModalState({
            open: true,
            type: "join",
            title: "Join League",
            description: "Are you sure you want to join this league?",
        });
    };

    const handleOpenUnjoinModal = () => {
        if (!isUserCaptain) {
            setModalState({
                open: true,
                type: "error",
                title: "Error",
                description: "Only Captain can unregister the team from the league",
            });
            return;
        }

        setModalState({
            open: true,
            type: "unjoin",
            title: "Unjoin League",
            description: "Are you sure you want to leave this league?",
        });
    };

    const handleConfirmAction = async () => {
        if (!userTeam) return;

        setIsLoading(true);
        try {
            if (modalState.type === "join") {
                await joinLeague({ leagueId: id, teamId: userTeam.id }).unwrap();
                setModalState({
                    open: true,
                    type: "success",
                    title: "Success",
                    description: "You have successfully joined the league!",
                });
            } else if (modalState.type === "unjoin") {
                await unjoinLeague({ leagueId: id, teamId: userTeam.id }).unwrap();
                setModalState({
                    open: true,
                    type: "success",
                    title: "Success",
                    description: "You have successfully left the league.",
                });
            }
            refetchLeague();
            refetchJoinedTeams();
        } catch (error: any) {
            setModalState({
                open: true,
                type: "error",
                title: "Error",
                description: error?.data?.message || "An error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalState((prev) => ({ ...prev, open: false }));
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const pad = (num: number) => num.toString().padStart(2, "0");
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formatPrize = (value?: number) =>
        value ? value.toLocaleString("de-DE") : "";

    return {
        leagueData,
        isMobile,
        isRegistrationClosed,
        registrationClosedReason,
        isTeamJoined,
        modalState,
        isLoading: isLoading || isJoining || isUnjoining,
        handleOpenJoinModal,
        handleOpenUnjoinModal,
        handleConfirmAction,
        handleCloseModal,
        formatDate,
        formatPrize,
        leagueId,
    };
};
