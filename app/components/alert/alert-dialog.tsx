"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { cn } from "@/app/utils/class";
import type { AlertItem } from "@/store/useAlertStore";
import Button from "../button";

interface Props {
  alert: AlertItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AlertDialogComponent({
  alert,
  open,
  onOpenChange,
}: Props) {
  const handleConfirm = () => {
    alert.onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    alert.onCancel?.();
    onOpenChange(false);
  };

  const isDanger = alert.variant === "danger";

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <AlertDialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-gray-100 bg-white p-6 shadow-lg"
          )}
        >
          <AlertDialog.Title className="title-md text-gray-400 text-center">
            {alert.title}
          </AlertDialog.Title>
          {alert.description && (
            <AlertDialog.Description className="body-md mt-2 text-gray-300 text-center">
              {alert.description}
            </AlertDialog.Description>
          )}
          <div className="mt-6 flex gap-3 justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="neutral" size="md" onClick={handleCancel}>
                {alert.cancelText ?? "취소"}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant={isDanger ? "danger" : "secondary"}
                size="md"
                onClick={handleConfirm}
              >
                {alert.confirmText ?? "확인"}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
