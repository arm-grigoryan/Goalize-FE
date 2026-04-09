"use client";

import { useEffect, useState } from "react";
import { PlayerInvitationCard } from "@/entities/PlayerInvitationCard/PlayerInvitationCard";
import { useTranslations } from "next-intl";

export default function GlobalErrorHandler() {
    const [show403Modal, setShow403Modal] = useState(false);
    const t = useTranslations("errors");
    const tCommon = useTranslations("common");

    useEffect(() => {
        const handle403 = () => {
            setShow403Modal(true);
        };

        window.addEventListener("app:403", handle403);
        return () => {
            window.removeEventListener("app:403", handle403);
        };
    }, []);

    if (!show403Modal) return null;

    return (
        <PlayerInvitationCard
            onCancelButtonClick={() => setShow403Modal(false)}
            title={t("actionNotAllowed")}
            description={t("notAllowedDescription")}
            cancelButtonText={tCommon("close")}
        />
    );
}
