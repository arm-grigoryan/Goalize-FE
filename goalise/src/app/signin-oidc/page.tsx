"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { handleSignInCallback } from "@/shared/auth/oidcService";
import { useAuth } from "@/shared/auth/AuthContext";
import { AuthTransition } from "@/components/generalComponents/AuthTransition";

const SignInOidcPage = () => {
  const router = useRouter();
  const { updateTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("auth.signingIn");
  const tErrors = useTranslations("errors");

  useEffect(() => {
    (async () => {
      try {
        const { tokens, returnPath } = await handleSignInCallback(
          window.location.href
        );
        updateTokens(tokens);
        router.replace(returnPath || "/");
      } catch (err) {
        console.error("Sign-in callback failed", err);
        setError(err instanceof Error ? err.message : t("unexpectedError"));
        updateTokens(null);
      }
    })();
  }, [router, updateTokens, t]);

  if (error) {
    return (
      <AuthTransition
        variant="error"
        title={t("failed")}
        description={error}
        backHref="/"
        backText={tErrors("backButtonText")}
      />
    );
  }

  return (
    <AuthTransition
      title={t("title")}
      description={t("description")}
    />
  );
};

export default SignInOidcPage;
