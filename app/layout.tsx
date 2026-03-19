import type { Metadata } from "next";
import localFont from "next/font/local";

// Font Awesome
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // 자동으로 CSS 추가하는 기능 끄기

import "../styles/globals.css";
import { AlertProvider } from "./components/alert";
import GlobalTopFloatingButton from "./components/floating-button/global-top-floating-button";
import { Toaster } from "./components/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "./providers/query-client-provider";
import SupabaseAuthListener from "./components/supabase-auth-listener";
import { cn } from "@/lib/utils";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    default: "Detox",
    template: "%s | Detox",
  },
  description: "구독 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} antialiased`}>
      <body className={cn(pretendard.className, "max-w-(--max-width) mx-auto")}>
        <SupabaseAuthListener />
        <QueryProvider>
          <TooltipProvider>
            <AlertProvider />
            <Toaster />
            {children}
            <GlobalTopFloatingButton />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
