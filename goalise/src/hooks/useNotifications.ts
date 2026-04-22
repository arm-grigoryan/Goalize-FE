"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useLazyGetInAppNotificationsQuery,
  useMarkAllNotificationsSeenMutation,
  useRespondToTeamApplicationMutation,
  useRespondToTeamInvitationMutation,
} from "@/app/store/services/api";
import {
  NotificationItemDto,
  LiveNotificationDto,
  NotificationPresentation,
} from "@/types/api/notifications";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    signalR?: {
      HubConnectionBuilder: new () => SignalRHubConnectionBuilder;
      LogLevel: { Error: number };
      HttpTransportType: { WebSockets: number };
    };
  }
}

interface SignalRHubConnection {
  on: (event: string, callback: (payload: unknown) => void) => void;
  onreconnected: (callback: () => void) => void;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

interface SignalRHubConnectionBuilder {
  withUrl: (url: string, options?: Record<string, unknown>) => SignalRHubConnectionBuilder;
  withAutomaticReconnect: () => SignalRHubConnectionBuilder;
  build: () => SignalRHubConnection;
}

const PAGE_SIZE = 20;
const SIGNAL_R_SCRIPT =
  "https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/8.0.7/signalr.min.js";

const mergeById = (list: NotificationItemDto[]) => {
  const map = new Map<string, NotificationItemDto>();
  list.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return [...map.values()];
};

const parseData = (raw: string) => {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
};

const normalizeHubUrl = (apiUrl?: string) => {
  if (!apiUrl) return "/notificationHub";
  const trimmed = apiUrl.replace(/\/$/, "");
  if (trimmed.toLowerCase().endsWith("/api")) {
    return `${trimmed.slice(0, -4)}/notificationHub`;
  }
  return `${trimmed}/notificationHub`;
};

const useNotificationTemplate = () => {
  const t = useTranslations();

  return useCallback(
    (notification: NotificationItemDto): NotificationPresentation => {
      const data = parseData(notification.data);

      switch (notification.templateKey) {
        case "PlayerInvited":
          return {
            icon: data?.team?.logoUrl,
            title: data?.team?.name,
            description: t("home.notifications.templates.playerInvited", {
              firstName: data?.userInfo?.firstName,
              teamName: data?.team?.name,
              phoneNumber: data?.userInfo?.phoneNumber,
            }),
          };
        case "PlayerApplied":
          return {
            icon: data?.userInfo?.profilePic,
            title: `${data?.userInfo?.firstName ?? ""} ${data?.userInfo?.lastName ?? ""}`.trim(),
            description: t("home.notifications.templates.playerApplied", {
              firstName: data?.userInfo?.firstName,
              phoneNumber: data?.userInfo?.phoneNumber,
            }),
          };
        case "PlayerQuit":
          return {
            icon: data?.player?.profilePic,
            title: `${data?.player?.firstName ?? ""} ${data?.player?.lastName ?? ""}`.trim(),
            description: t("home.notifications.templates.playerQuit", {
              firstName: data?.player?.firstName,
            }),
          };
        case "PlayerRemoved":
          return {
            icon: data?.fromTeam?.logoUrl,
            title: data?.fromTeam?.name,
            description: t("home.notifications.templates.playerRemoved", {
              teamName: data?.fromTeam?.name,
            }),
          };
        case "PlayerPromoted":
          return {
            icon: data?.team?.logoUrl,
            title: data?.team?.name,
            description: t("home.notifications.templates.playerPromoted", {
              teamName: data?.team?.name,
            }),
          };
        case "PlayerShirtNumberChanged":
          return {
            title: t("home.notifications.templates.shirtNumberChangedTitle"),
            description: t("home.notifications.templates.playerShirtNumberChanged", {
              oldNumber: data?.oldNumber,
              newNumber: data?.newNumber,
            }),
          };
        case "TeamCreationApproved":
          return {
            icon: data?.team?.logoUrl,
            title: data?.team?.name,
            description: t("home.notifications.templates.teamCreationApproved"),
          };
        case "TeamCreationRejected":
          return {
            icon: data?.team?.logoUrl,
            title: data?.team?.name,
            description: t("home.notifications.templates.teamCreationRejected", {
              rejectionReason: data?.rejectionReason,
            }),
          };
        case "ProfilePictureApproved":
          return {
            icon: data?.profilePictureUrl,
            title: t("home.notifications.templates.profilePictureApprovedTitle"),
            description: t("home.notifications.templates.profilePictureApproved"),
          };
        case "ProfilePictureRejected":
          return {
            icon: data?.profilePictureUrl,
            title: t("home.notifications.templates.profilePictureRejectedTitle"),
            description: t("home.notifications.templates.profilePictureRejected", {
              rejectionReason: data?.rejectionReason,
            }),
          };
        case "PlayerRespondedToInvitation":
          return {
            icon: data?.userInfo?.profilePic,
            title: `${data?.userInfo?.firstName ?? ""} ${data?.userInfo?.lastName ?? ""}`.trim(),
            description: t("home.notifications.templates.playerRespondedToInvitation", {
              firstName: data?.userInfo?.firstName,
              response: data?.response,
            }),
          };
        case "CaptainRespondedToApplication":
          return {
            icon: data?.team?.logoUrl,
            title: data?.team?.name,
            description: t("home.notifications.templates.captainRespondedToApplication", {
              firstName: data?.captainInfo?.firstName,
              response: data?.response,
              teamName: data?.team?.name,
            }),
          };
        case "EventCancelled":
          return {
            title: data?.eventInfo?.name,
            description: t("home.notifications.templates.eventCancelled", {
              eventName: data?.eventInfo?.name,
            }),
          };
        case "EventUpdated":
          return {
            title: data?.eventInfo?.name,
            description: t("home.notifications.templates.eventUpdated", {
              eventName: data?.eventInfo?.name,
            }),
          };
        default:
          return {
            title: t("home.notifications.defaultTitle"),
            description: t("home.notifications.defaultDescription"),
          };
      }
    },
    [t],
  );
};

const loadSignalR = async () => {
  if (typeof window === "undefined") return false;
  if (window.signalR) return true;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src='${SIGNAL_R_SCRIPT}']`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = SIGNAL_R_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });

  return Boolean(window.signalR);
};

const toNotificationItemDto = (live: LiveNotificationDto): NotificationItemDto => {
  const id =
    (globalThis.crypto?.randomUUID?.() ?? `live_${Date.now()}_${Math.random()}`);

  return {
    id,
    templateKey: live.templateKey,
    data: JSON.stringify(live.payload ?? {}),
    status: "Unseen",
    createdAtUtc: live.sentAtUtc,
    notificationRelatedFlowType: live.notificationRelatedFlowType,
    notificationRelatedFlowId: live.notificationRelatedFlowId,
    flowCompleted: false,
    flowOutcome: null,
  };
};

const JUST_SEEN_HIGHLIGHT_MS = 5000;

export const useNotifications = (accessToken?: string) => {
  const [notifications, setNotifications] = useState<NotificationItemDto[]>([]);
  const [toastNotification, setToastNotification] =
    useState<NotificationItemDto | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [justSeenIds, setJustSeenIds] = useState<string[]>([]);
  const connectionRef = useRef<SignalRHubConnection | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);
  const notificationsRef = useRef<NotificationItemDto[]>([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const [fetchNotifications, { isFetching }] = useLazyGetInAppNotificationsQuery();
  const [markAllSeen] = useMarkAllNotificationsSeenMutation();
  const [respondToInvitation] = useRespondToTeamInvitationMutation();
  const [respondToApplication] = useRespondToTeamApplicationMutation();

  const toPresentation = useNotificationTemplate();

  const unseenCount = useMemo(
    () => notifications.filter((item) => item.status === "Unseen").length,
    [notifications],
  );

  const loadNotifications = useCallback(
    async ({ skip, reset }: { skip: number; reset?: boolean }) => {
      const response = await fetchNotifications({ skip, take: PAGE_SIZE }, true);
      if (!("data" in response) || !response.data) return;

      const fetched = response.data;
      setHasLoadedOnce(true);
      setHasMore(fetched.length >= PAGE_SIZE);

      setNotifications((prev) => {
        if (reset) {
          return mergeById(fetched);
        }
        return mergeById([...prev, ...fetched]);
      });
    },
    [fetchNotifications],
  );

  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    loadNotifications({ skip: notifications.length });
  }, [hasMore, isFetching, loadNotifications, notifications.length]);

  const markSeenOptimistically = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, status: "Seen" })));
  }, []);

  const onBellOpen = useCallback(async () => {
    if (!hasLoadedOnce) {
      await loadNotifications({ skip: 0, reset: true });
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }

    const unseenIds = notificationsRef.current
      .filter((item) => item.status === "Unseen")
      .map((item) => item.id);

    if (unseenIds.length === 0) return;

    setJustSeenIds(unseenIds);
    markSeenOptimistically();
    void markAllSeen();

    if (highlightTimeoutRef.current) {
      window.clearTimeout(highlightTimeoutRef.current);
    }
    highlightTimeoutRef.current = window.setTimeout(() => {
      setJustSeenIds([]);
    }, JUST_SEEN_HIGHLIGHT_MS);
  }, [hasLoadedOnce, loadNotifications, markAllSeen, markSeenOptimistically]);

  const addLiveNotification = useCallback((notif: NotificationItemDto) => {
      setNotifications((prev) => mergeById([notif, ...prev]));
      setToastNotification(notif);

      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = window.setTimeout(() => {
        setToastNotification(null);
      }, 4000);
    }, []);

  const reconnectFetch = useCallback(async () => {
    await loadNotifications({ skip: 0, reset: true });
  }, [loadNotifications]);

  useEffect(() => {
    if (!accessToken) {
      setNotifications([]);
      setHasLoadedOnce(false);
      setHasMore(true);
      connectionRef.current?.stop?.();
      connectionRef.current = null;
      return;
    }

    void loadNotifications({ skip: 0, reset: true });

    let cancelled = false;

    const connect = async () => {
      const loaded = await loadSignalR().catch(() => false);
      if (!loaded || cancelled || !window.signalR) return;

      const signalR = window.signalR;
      const hubUrl = normalizeHubUrl(process.env.NEXT_PUBLIC_API_URL);
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => accessToken
        })
        .withAutomaticReconnect()
        .build();

      connection.on("Notify", (payload) => {
        console.log("🔥 LIVE NOTIF:", payload);

        const mapped = toNotificationItemDto(payload as LiveNotificationDto);
        addLiveNotification(mapped);
      });

      connection.onreconnected(() => {
        void reconnectFetch();
      });

      connection.start().catch(() => undefined);
      connectionRef.current = connection;
    };

    void connect();

    return () => {
      cancelled = true;
      connectionRef.current?.stop?.();
      connectionRef.current = null;
    };
  }, [accessToken, addLiveNotification, loadNotifications, reconnectFetch]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const decideFlow = useCallback(
    async (notification: NotificationItemDto, status: "Accepted" | "Rejected") => {
      const data = parseData(notification.data);
      const teamId = data?.team?.id;
      const flowId = notification.notificationRelatedFlowId;

      if (!teamId || !flowId) return;

      if (notification.notificationRelatedFlowType === "TeamInvitation") {
        await respondToInvitation({
          teamId,
          invitationId: flowId,
          status,
        }).unwrap();
      }

      if (notification.notificationRelatedFlowType === "TeamApplication") {
        await respondToApplication({
          teamId,
          applicationId: flowId,
          status,
        }).unwrap();
      }

      const outcome = status === "Accepted" ? "Accepted" : "Declined";
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, flowCompleted: true, flowOutcome: outcome }
            : item,
        ),
      );
    },
    [respondToApplication, respondToInvitation],
  );

  return {
    notifications,
    unseenCount,
    hasMore,
    isFetching,
    toastNotification,
    justSeenIds,
    loadMore,
    onBellOpen,
    closeToast: () => setToastNotification(null),
    toPresentation,
    decideFlow,
  };
};
