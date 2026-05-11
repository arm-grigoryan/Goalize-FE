import { useRef, useState } from "react";
import { useParams } from "next/navigation";
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
import { useTranslations } from "next-intl";

export const useLeagueHeader = () => {
  const { leagueId } = useParams();
  const t = useTranslations("leagues.header.modal");

  const { isAuthenticated, signIn } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const id = Number(leagueId);

  const { data: leagueData, refetch: refetchLeague } = useGetLeaguesInfoQuery(
    id,
    { skip: !id }
  );
  const { data: joinedTeams, refetch: refetchJoinedTeams } =
    useGetLeaguesJoinedTeamsQuery(id, { skip: !id });
  const { data: userInfo } = useGetUserInfoQuery(undefined, {
    skip: !isAuthenticated,
  });


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
  const [serverError, setServerError] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showServerErrorToast = (message: string) => {
    setServerError(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setServerError(null), 4000);
  };

  const clearServerError = () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setServerError(null);
  };

  const isRegistrationClosed =
    leagueData?.state === "Registration" &&
    (new Date(leagueData.registrationDate) < new Date() ||
      (joinedTeams &&
        leagueData?.maxTeamsCount &&
        joinedTeams.length >= leagueData.maxTeamsCount));

  const registrationClosedReason = isRegistrationClosed
    ? joinedTeams &&
      leagueData?.maxTeamsCount &&
      joinedTeams.length >= leagueData.maxTeamsCount
      ? t("maxTeamsCountReached")
      : t("registrationDateExpired")
    : null;

  const userTeam = userInfo?.playerInfo?.team;
  const isUserCaptain =
    userTeam && userTeam.captainId === userInfo?.playerInfo?.id;
  const isTeamJoined =
    userTeam && joinedTeams?.some((team) => team.id === userTeam.id);

  const handleOpenJoinModal = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }

    if (!userTeam) {
      setModalState({
        open: true,
        type: "error",
        title: t("errorTitle"),
        description: t("needTeamFirst"),
      });
      return;
    }

    if (!isUserCaptain) {
      setModalState({
        open: true,
        type: "error",
        title: t("errorTitle"),
        description: t("onlyCaptainCanRegister"),
      });
      return;
    }

    if (isTeamJoined) {
      setModalState({
        open: true,
        type: "error",
        title: t("infoTitle"),
        description: t("teamAlreadyRegistered"),
      });
      return;
    }

    setModalState({
      open: true,
      type: "join",
      title: t("joinLeagueTitle"),
      description: t("joinLeagueDescription"),
    });
  };

  const handleOpenUnjoinModal = () => {
    if (isRegistrationClosed && registrationClosedReason === t("registrationDateExpired")) {
      setModalState({
        open: true,
        type: "error",
        title: "",
        description: t("contactSupport"),
      });
      return;
    }

    if (!isUserCaptain) {
      setModalState({
        open: true,
        type: "error",
        title: t("errorTitle"),
        description: t("onlyCaptainCanUnregister"),
      });
      return;
    }

    setModalState({
      open: true,
      type: "unjoin",
      title: t("unjoinLeagueTitle"),
      description: t("unjoinLeagueDescription"),
    });
  };

  const handleConfirmAction = async () => {
    if (!userTeam) return;

    const actionType = modalState.type;
    setModalState((prev) => ({ ...prev, open: false }));
    setIsLoading(true);
    try {
      if (actionType === "join") {
        await joinLeague({ leagueId: id, teamId: userTeam.id }).unwrap();
        setModalState({
          open: true,
          type: "success",
          title: t("successTitle"),
          description: t("joinSuccess"),
        });
      } else if (actionType === "unjoin") {
        await unjoinLeague({ leagueId: id, teamId: userTeam.id }).unwrap();
        setModalState({
          open: true,
          type: "success",
          title: t("successTitle"),
          description: t("leaveSuccess"),
        });
      }
      refetchLeague();
      refetchJoinedTeams();
    } catch (error) {
      const apiError = error as { status?: number; data?: { errorMessage?: string } };
      const status = apiError?.status;
      const isServerError = typeof status !== "number" || status >= 500;

      if (isServerError) {
        showServerErrorToast(
          apiError?.data?.errorMessage || t("genericError")
        );
      } else {
        setModalState({
          open: true,
          type: "error",
          title: t("errorTitle"),
          description:
            apiError?.data?.errorMessage || t("errorOccurred"),
        });
      }
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
    isUserCaptain,
    modalState,

    isLoading: isLoading || isJoining || isUnjoining,
    serverError,
    clearServerError,
    handleOpenJoinModal,
    handleOpenUnjoinModal,
    handleConfirmAction,
    handleCloseModal,
    formatDate,
    formatPrize,
    leagueId,
  };
};
