"use client";

import type { ReactNode } from "react";
import { cn } from "@/app/utils/class";

type FloatingButtonProps = {
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export default function FloatingButton({
  ariaLabel,
  onClick,
  disabled,
  className,
  children,
}: FloatingButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "btn btn-rounded mr-6",
        disabled ? "btn-disabled" : "",
        className ?? ""
      )}
    >
      {children}
    </button>
  );
}
