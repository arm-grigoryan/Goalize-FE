import React, { useCallback, useRef } from "react";
import { INotificationCardProps } from "./NotificationCard.types";
import styles from "./NotificationCard.module.css";
import { useTranslations } from "next-intl";
import { NotificationItem } from "../NotificationItem/NotificationItem";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const NotificationCard: React.FC<INotificationCardProps> = ({
  object,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations();
  const loadRequestedRef = useRef(false);

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      if (!onLoadMore || !hasMore || loading) {
        loadRequestedRef.current = false;
        return;
      }

      const isNearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 30;

      if (isNearBottom && !loadRequestedRef.current) {
        loadRequestedRef.current = true;
        onLoadMore();
        return;
      }

      if (!isNearBottom) {
        loadRequestedRef.current = false;
      }
    },
    [hasMore, loading, onLoadMore],
  );

  return (
    <div className={`${isMobile ? styles.mobile : styles.container}`}>
      <div className={styles.title}>{t("home.notifications.title")}</div>
      <div className={styles.itemsContainer} onScroll={onScroll}>
        {object?.map((item) => (
          <div key={item.id ?? `${item.title}-${item.description}`}>
            <NotificationItem {...item} />
          </div>
        ))}

        {!loading && !object?.length && (
          <div className={styles.empty}>{t("home.notifications.empty")}</div>
        )}

        {loading && (
          <div className={styles.loading}>{t("home.notifications.loading")}</div>
        )}
      </div>
    </div>
  );
};
