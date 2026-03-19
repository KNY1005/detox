"use client";

import { usePathname } from "next/navigation";
import FloatingButton from "@/app/components/floating-button";
import { useTopFloatingButtonVisible } from "@/app/hooks/use-top-floating-button-visible";

const TOP_BUTTON_VISIBLE_PATHS = new Set([
  "/",
  "/statistics",
  "/mypage",
]);

export default function GlobalTopFloatingButton() {
  const pathname = usePathname();
  const isVisible = useTopFloatingButtonVisible();

  if (!TOP_BUTTON_VISIBLE_PATHS.has(pathname)) {
    return null;
  }

  return (
    <div
      className={`fixed right-0 bottom-24 z-10 transition-opacity duration-200 ease-out ${
        isVisible ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
      aria-hidden={!isVisible}
    >
      <FloatingButton variant="top" />
    </div>
  );
}
