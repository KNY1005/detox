"use client";

import { useSyncExternalStore } from "react";

const TOP_BUTTON_SHOW_SCROLL_Y = 200;

function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange);

  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getScrollY() {
  return window.scrollY;
}

function getServerScrollY() {
  return 0;
}

export function useTopFloatingButtonVisible() {
  const scrollY = useSyncExternalStore(
    subscribeToScroll,
    getScrollY,
    getServerScrollY
  );

  return scrollY > TOP_BUTTON_SHOW_SCROLL_Y;
}
