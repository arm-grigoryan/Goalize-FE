"use client";

import { useEffect, useState } from "react";
import { PlayerInvitationCard } from "@/entities/PlayerInvitationCard/PlayerInvitationCard";

export default function GlobalErrorHandler() {
    const [show403Modal, setShow403Modal] = useState(false);

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
            title=""
            description="You are not allowed to perform this action"
            cancelButtonText="Close"
        />
    );
}
