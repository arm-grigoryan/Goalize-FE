"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleSignOutCallback } from "@/shared/auth/oidcService";
import { useAuth } from "@/shared/auth/AuthContext";
import { useTranslations } from "next-intl";

const SignOutCallbackPage = () => {
  const router = useRouter();
  const { updateTokens } = useAuth();
  const t = useTranslations("auth");

  useEffect(() => {
    const next = handleSignOutCallback(window.location.href);
    updateTokens(null);
    router.replace(next || "/");
  }, [router, updateTokens]);

  return (
    <div style={{ padding: "24px" }}>
      <h2>{t("signingOut.title")}</h2>
      <p>{t("signingOut.description")}</p>
    </div>
  );
};

export default SignOutCallbackPage;
