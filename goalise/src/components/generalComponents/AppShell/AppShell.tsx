"use client";

import type { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/generalComponents/Header";
import Footer from "@/components/generalComponents/Footer";
import GlobalErrorHandler from "@/components/generalComponents/GlobalErrorHandler";

const CHROMELESS_PATHS = ["/signin-oidc", "/signout-callback-oidc"];

export const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isChromeless = CHROMELESS_PATHS.includes(pathname);

  if (isChromeless) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <GlobalErrorHandler />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
};
