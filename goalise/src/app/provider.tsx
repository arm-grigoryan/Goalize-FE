"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "@/shared/auth/AuthContext";
import { GlobalErrorDisplay } from "@/components/GlobalErrorDisplay";
import { LocaleInitializer } from "@/shared/LocaleInitializer/LocaleInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LocaleInitializer />
      <AuthProvider>
        <GlobalErrorDisplay />
        {children}
      </AuthProvider>
    </Provider>
  );
}
