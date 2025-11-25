"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleSignInCallback } from "@/shared/auth/oidcService";
import { useAuth } from "@/shared/auth/AuthContext";

const SignInOidcPage = () => {
  const router = useRouter();
  const { updateTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
        setError(err instanceof Error ? err.message : "Unexpected error");
        updateTokens(null);
      }
    })();
  }, [router, updateTokens]);

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>Sign-in failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Completing sign-in...</h2>
      <p>Please wait while we process your login.</p>
    </div>
  );
};

export default SignInOidcPage;
