"use client";

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthTokens,
  clearTokens,
  getStoredTokens,
  refreshTokens,
  startLoginRedirect,
  startLogoutRedirect,
  useMemoizedProfile,
} from "./oidcService";

export type AuthContextValue = {
  tokens: AuthTokens | null;
  loading: boolean;
  isAuthenticated: boolean;
  user: ReturnType<typeof useMemoizedProfile>;
  signIn: (returnPath?: string) => Promise<void>;
  signOut: (returnPath?: string) => void;
  updateTokens: (tokens: AuthTokens | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTokens(getStoredTokens());
    setLoading(false);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "goalize_auth_tokens") {
        setTokens(getStoredTokens());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const scheduleRefresh = useCallback(() => {
    if (!tokens?.expiresAt || !tokens.refreshToken) return undefined;
    const now = Date.now();
    const refreshIn = tokens.expiresAt - now - 60_000;
    if (refreshIn <= 0) {
      refreshTokens(tokens.refreshToken)
        .then((t) => setTokens(t))
        .catch((err) => console.error("Refresh token failed", err));
      return undefined;
    }
    const id = window.setTimeout(() => {
      refreshTokens(tokens.refreshToken as string)
        .then((t) => setTokens(t))
        .catch((err) => {
          console.error("Refresh token failed", err);
          clearTokens();
          setTokens(null);
        });
    }, refreshIn);
    return () => window.clearTimeout(id);
  }, [tokens?.expiresAt, tokens?.refreshToken]);

  useEffect(() => {
    const cleanup = scheduleRefresh();
    return () => {
      if (cleanup) cleanup();
    };
  }, [scheduleRefresh]);

  const signIn = useCallback(async (returnPath?: string) => {
    await startLoginRedirect(returnPath);
  }, []);

  const signOut = useCallback(
    (returnPath?: string) => {
      const idToken = tokens?.idToken;
      clearTokens();
      setTokens(null);
      startLogoutRedirect(idToken, returnPath);
    },
    [tokens?.idToken]
  );

  const updateTokens = useCallback((newTokens: AuthTokens | null) => {
    if (!newTokens) {
      clearTokens();
      setTokens(null);
      return;
    }
    setTokens(newTokens);
  }, []);

  const profile = useMemoizedProfile(tokens?.profile);

  const value = useMemo<AuthContextValue>(() => {
    return {
      tokens,
      loading,
      isAuthenticated: Boolean(tokens?.accessToken),
      user: profile,
      signIn,
      signOut,
      updateTokens,
    };
  }, [tokens, loading, signIn, signOut, updateTokens, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
