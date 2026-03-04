import { useCallback } from "react";
import type { AlertVariant } from "@/store/useAlertStore";
import { useAlertStore } from "@/store/useAlertStore";

export interface AlertOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: AlertVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useAlert() {
  const push = useAlertStore((state) => state.push);
  const clear = useAlertStore((state) => state.clear);

  const alert = useCallback(
    (options: AlertOptions) => {
      push(options);
    },
    [push]
  );

  return { alert, clear };
}
