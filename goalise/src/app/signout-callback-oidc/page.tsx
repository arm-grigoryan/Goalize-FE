"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleSignOutCallback } from "@/shared/auth/oidcService";
import { useAuth } from "@/shared/auth/AuthContext";

const SignOutCallbackPage = () => {
  const router = useRouter();
  const { updateTokens } = useAuth();

  useEffect(() => {
    const next = handleSignOutCallback(window.location.href);
    updateTokens(null);
    router.replace(next || "/");
  }, [router, updateTokens]);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Signing you out...</h2>
      <p>You will be redirected shortly.</p>
    </div>
  );
};

export default SignOutCallbackPage;
