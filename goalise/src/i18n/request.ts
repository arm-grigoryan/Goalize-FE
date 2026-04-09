import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { SUPPORTED_LOCALES, type Locale } from "@/shared/utils/localeCookie";

export default getRequestConfig(async () => {
  let locale: Locale = "en";

  const cookieStore = await cookies();
  const cultureCookie = cookieStore.get(".AspNetCore.Culture")?.value;
  if (cultureCookie) {
    const match = cultureCookie.match(/c=([^|;]+)/);
    const extracted = match?.[1] as Locale | undefined;
    if (extracted && SUPPORTED_LOCALES.includes(extracted)) {
      locale = extracted;
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
