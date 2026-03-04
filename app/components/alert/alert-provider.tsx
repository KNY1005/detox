"use client";

import { useCallback } from "react";
import AlertDialogComponent from "./alert-dialog";
import { useAlertStore } from "@/store/useAlertStore";

export default function AlertProvider() {
  const { stack, shift } = useAlertStore();
  const current = stack[0] ?? null;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        shift();
      }
    },
    [shift]
  );

  if (!current) return null;

  return (
    <AlertDialogComponent
      alert={current}
      open={!!current}
      onOpenChange={handleOpenChange}
    />
  );
}
