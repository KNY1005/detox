"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/app/utils/class";
import Link from "next/link";

type FloatingButtonProps = {
  variant: "create" | "top";
};

const variantMap = {
  create: {
    icon: faPlus,
    className: "btn-primary",
    ariaLabel: "추가하기",
  },
  top: {
    icon: faArrowUp,
    className: "btn-white",
    ariaLabel: "맨 위로 이동하기",
  },
} as const;

export default function FloatingButton({ variant }: FloatingButtonProps) {
  const { icon, className, ariaLabel } = variantMap[variant];
  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (variant === "create") {
    return (
      <Link
        href="/write"
        aria-label={ariaLabel}
        className={cn("btn btn-rounded mr-6", className)}
      >
        <FontAwesomeIcon icon={icon} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleTopClick}
      className={cn("btn btn-rounded mr-6", className)}
    >
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </button>
  );
}
