"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLocale } from "@/app/store/slices/localeSlice";
import { getLocaleFromCookie } from "@/shared/utils/localeCookie";

export function LocaleInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const locale = getLocaleFromCookie();
    dispatch(setLocale(locale));
  }, [dispatch]);

  return null;
}
