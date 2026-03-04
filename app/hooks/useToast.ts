import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";

export type { ExternalToast as ToastOptions };

export function useToast() {
  const toast = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast(message, options);
    },
    []
  );

  const success = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.success(message, options);
    },
    []
  );

  const error = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.error(message, options);
    },
    []
  );

  const info = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.info(message, options);
    },
    []
  );

  const warning = useCallback(
    (message: React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.warning(message, options);
    },
    []
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
