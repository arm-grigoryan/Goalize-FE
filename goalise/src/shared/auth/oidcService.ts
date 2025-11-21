"use client";

import { useMemo } from "react";

const AUTH_STORAGE_KEY = "goalize_auth_tokens";
const PKCE_STATE_PREFIX = "goalize_pkce_state:";
const LOGOUT_STATE_PREFIX = "goalize_logout_state:";

export type AuthProfile = {
  name?: string;
  email?: string;
  phone_number?: string;
  picture?: string;
  preferred_username?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
  scope?: string;
  tokenType?: string;
  profile?: AuthProfile;
};

export const authConfig = {
  authority: process.env.NEXT_PUBLIC_IDENTITY_AUTHORITY,
  clientId: process.env.NEXT_PUBLIC_IDENTITY_CLIENT_ID,
  redirectUri:
    process.env.NEXT_PUBLIC_IDENTITY_REDIRECT,
  postLogoutRedirectUri:
    process.env.NEXT_PUBLIC_IDENTITY_LOGOUT_REDIRECT,
  scope:
    "openid profile email phone offline_access",
};

type PendingAuth = {
  state: string;
  codeVerifier: string;
  returnPath?: string;
};

type PendingLogout = {
  state: string;
  returnPath?: string;
};

const base64UrlEncode = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const generateRandomString = (size = 32) => {
  if (typeof window === "undefined") return "";
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(hash);
};

const savePendingAuth = (pending: PendingAuth) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    `${PKCE_STATE_PREFIX}${pending.state}`,
    JSON.stringify(pending)
  );
};

const consumePendingAuth = (state: string | null): PendingAuth | null => {
  if (typeof window === "undefined" || !state) return null;
  const key = `${PKCE_STATE_PREFIX}${state}`;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  sessionStorage.removeItem(key);
  try {
    return JSON.parse(raw) as PendingAuth;
  } catch (e) {
    console.error("Failed to parse pending auth state", e);
    return null;
  }
};

const savePendingLogout = (pending: PendingLogout) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    `${LOGOUT_STATE_PREFIX}${pending.state}`,
    JSON.stringify(pending)
  );
};

const consumePendingLogout = (state: string | null): PendingLogout | null => {
  if (typeof window === "undefined" || !state) return null;
  const key = `${LOGOUT_STATE_PREFIX}${state}`;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  sessionStorage.removeItem(key);
  try {
    return JSON.parse(raw) as PendingLogout;
  } catch (e) {
    console.error("Failed to parse pending logout state", e);
    return null;
  }
};

const decodeJwtPayload = (token?: string): AuthProfile | undefined => {
  if (!token) return undefined;
  const parts = token.split(".");
  if (parts.length < 2) return undefined;
  try {
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const json = JSON.parse(decoded);
    return {
      name: json.name || json.given_name || json.family_name,
      email: json.email,
      phone_number: json.phone_number,
      picture: json.picture
    };
  } catch (e) {
    console.error("Unable to decode id_token", e);
    return undefined;
  }
};

export const getStoredTokens = (): AuthTokens | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch (e) {
    console.error("Failed to parse stored tokens", e);
    return null;
  }
};

export const persistTokens = (tokens: AuthTokens | null) => {
  if (typeof window === "undefined") return;
  if (!tokens) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
};

const buildAuthorizeUrl = async (returnPath?: string) => {
  const state = generateRandomString(16);
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await sha256(codeVerifier);
  const authorizeUrl = new URL(`${authConfig.authority}/connect/authorize`);

  authorizeUrl.searchParams.set("client_id", authConfig.clientId);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", authConfig.scope);
  authorizeUrl.searchParams.set("redirect_uri", authConfig.redirectUri);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("state", state);

  savePendingAuth({ state, codeVerifier, returnPath });
  return authorizeUrl.toString();
};

export const startLoginRedirect = async (returnPath?: string) => {
  if (typeof window === "undefined") return;
  const target = await buildAuthorizeUrl(returnPath);
  window.location.href = target;
};

const requestTokens = async (code: string, codeVerifier: string) => {
  const tokenEndpoint = `${authConfig.authority}/connect/token`;
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: authConfig.clientId,
    code,
    redirect_uri: authConfig.redirectUri,
    code_verifier: codeVerifier,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token endpoint error: ${response.status} ${errorText}`);
  }

  const json = await response.json();
  const expiresInMs = (json.expires_in ? Number(json.expires_in) : 0) * 1000;
  const expiresAt = Date.now() + expiresInMs;

  const profile = decodeJwtPayload(json.id_token);

  const tokens: AuthTokens = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    idToken: json.id_token,
    expiresAt,
    scope: json.scope,
    tokenType: json.token_type,
    profile,
  };

  persistTokens(tokens);
  return tokens;
};

export const handleSignInCallback = async (url: string) => {
  const currentUrl = new URL(url);
  const code = currentUrl.searchParams.get("code");
  const state = currentUrl.searchParams.get("state");
  const error = currentUrl.searchParams.get("error");

  if (error) {
    throw new Error(error);
  }

  if (!code) {
    throw new Error("Authorization code not found");
  }

  const pending = consumePendingAuth(state);
  if (!pending?.codeVerifier) {
    throw new Error("Missing or invalid PKCE state");
  }

  const tokens = await requestTokens(code, pending.codeVerifier);
  return { tokens, returnPath: pending.returnPath || "/" };
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
  const tokenEndpoint = `${authConfig.authority}/connect/token`;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: authConfig.clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Refresh token error: ${response.status} ${errorText}`);
  }

  const json = await response.json();
  const expiresInMs = (json.expires_in ? Number(json.expires_in) : 0) * 1000;
  const expiresAt = Date.now() + expiresInMs;
  const profile = decodeJwtPayload(json.id_token);

  const tokens: AuthTokens = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token || refreshToken,
    idToken: json.id_token,
    expiresAt,
    scope: json.scope,
    tokenType: json.token_type,
    profile,
  };

  persistTokens(tokens);
  return tokens;
};

export const clearTokens = () => {
  persistTokens(null);
};

export const startLogoutRedirect = (
  idTokenHint?: string,
  returnPath?: string
) => {
  if (typeof window === "undefined") return;
  const state = generateRandomString(16);
  savePendingLogout({ state, returnPath });

  const url = new URL(`${authConfig.authority}/connect/endsession`);
  url.searchParams.set("post_logout_redirect_uri", authConfig.postLogoutRedirectUri);
  url.searchParams.set("state", state);
  if (idTokenHint) {
    url.searchParams.set("id_token_hint", idTokenHint);
  }

  window.location.href = url.toString();
};

export const handleSignOutCallback = (url: string) => {
  const currentUrl = new URL(url);
  const state = currentUrl.searchParams.get("state");
  const pending = consumePendingLogout(state);
  clearTokens();
  return pending?.returnPath || "/";
};

export const useMemoizedProfile = (profile?: AuthProfile) =>
  useMemo(() => profile, [profile]);
