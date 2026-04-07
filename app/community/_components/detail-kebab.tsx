"use client";

import { useState } from "react";
import AlertDialogComponent from "@/app/components/alert/alert-dialog";
import KebabMenu from "@/app/components/kebabmenu";
import { useToast } from "@/app/hooks/useToast";
import type { AlertItem } from "@/store/useAlertStore";

type ErrorWithMessage = {
  message?: string | null;
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ErrorWithMessage).message === "string" &&
    (error as ErrorWithMessage).message
  ) {
    return (error as ErrorWithMessage).message as string;
  }

  return fallbackMessage;
}

interface DetailKebabProps {
  variant?: "default" | "edit";
  entityName?: string;
  onEdit?: () => void;
  onDelete?: () => Promise<void> | void;
  onReport?: () => Promise<void> | void;
}

export default function DetailKebab({
  variant = "default",
  entityName = "게시글",
  onEdit,
  onDelete,
  onReport,
}: DetailKebabProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { success, warning, error: errorToast } = useToast();

  const deleteAlert: AlertItem = {
    id: `delete-${entityName}-alert`,
    title: `${entityName}을 삭제할까요?`,
    description: "삭제 후에는 되돌릴 수 없습니다.",
    confirmText: "삭제",
    cancelText: "취소",
    variant: "danger",
    onConfirm: async () => {
      if (!onDelete) return;

      try {
        await onDelete();
        success(`${entityName}이 삭제되었습니다.`);
      } catch (error) {
        console.error(error);
        errorToast(getErrorMessage(error, `${entityName} 삭제에 실패했어요.`));
      }
    },
  };
  const handleReport = async () => {
    if (!onReport) return;

    try {
      await onReport();
      warning(`${entityName}이 신고되었습니다.`);
    } catch (error) {
      console.error(error);
      errorToast(getErrorMessage(error, `${entityName} 신고에 실패했어요.`));
    }
  };

  const hasMenuAction =
    (variant === "edit" && Boolean(onEdit || onDelete)) ||
    (variant === "default" && Boolean(onReport));

  if (!hasMenuAction) {
    return null;
  }

  return (
    <>
      <KebabMenu
        variant={variant}
        triggerLabel={`${entityName} 옵션 열기`}
        onEdit={variant === "edit" ? onEdit : undefined}
        onDelete={
          variant === "edit" && onDelete
            ? () => setIsDeleteDialogOpen(true)
            : undefined
        }
        onReport={variant === "default" ? handleReport : undefined}
      />
      <AlertDialogComponent
        alert={deleteAlert}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
