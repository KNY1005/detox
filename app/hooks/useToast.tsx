import { ToastMessage } from "@/app/components/toast";
import { cn } from "@/app/utils/class";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { ToastMessageVariant } from "@/app/components/toast/toast-message";
import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";

export type { ExternalToast as ToastOptions };

function getCenteredToastOptions(options?: ExternalToast): ExternalToast {
  return {
    ...options,
    className: cn("!justify-center", options?.className ?? ""),
    style: {
      textAlign: "center",
      ...(options?.style ?? {}),
    },
  };
}

export function useToast() {
  const toast = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast(message, options);
    },
    []
  );

  const variantToast = useCallback(
    (
      variant: ToastMessageVariant,
      message: React.ReactNode,
      options?: ExternalToast
    ) => {
      return sonnerToast(
        <ToastMessage variant={variant}>{message}</ToastMessage>,
        getCenteredToastOptions(options)
      );
    },
    []
  );

  const iconToast = useCallback(
    (icon: IconProp, message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast(
        <ToastMessage icon={icon}>{message}</ToastMessage>,
        getCenteredToastOptions(options)
      );
    },
    []
  );

  const success = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return variantToast("success", message, options);
    },
    [variantToast]
  );

  const error = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return variantToast("error", message, options);
    },
    [variantToast]
  );

  const info = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return variantToast("info", message, options);
    },
    [variantToast]
  );

  const warning = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return variantToast("warning", message, options);
    },
    [variantToast]
  );

  const promise = useCallback(
    (...args: Parameters<typeof sonnerToast.promise>) =>
      sonnerToast.promise(...args),
    []
  );

  const dismiss = useCallback((toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  }, []);

  const custom = useCallback(
    (
      jsx: (id: number | string) => React.ReactElement,
      options?: ExternalToast
    ) => {
      return sonnerToast.custom(jsx, options);
    },
    []
  );

  const loading = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.loading(message, options);
    },
    []
  );

  return {
    toast,
    variantToast,
    iconToast,
    success,
    error,
    info,
    warning,
    promise,
    dismiss,
    custom,
    loading,
  };
}
