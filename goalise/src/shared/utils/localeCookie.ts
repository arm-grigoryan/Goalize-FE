export const SUPPORTED_LOCALES = ["en", "hy"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const COOKIE_NAME = ".AspNetCore.Culture";

export function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/\.AspNetCore\.Culture=c=([^|;]+)/);
  if (match && SUPPORTED_LOCALES.includes(match[1] as Locale)) {
    return match[1] as Locale;
  }
  return "en";
}

export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${COOKIE_NAME}=c=${locale}|uic=${locale}; path=/; max-age=31536000`;
}
