"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: "var(--font-pretendard), sans-serif",
        },
      }}
    />
  );
}
