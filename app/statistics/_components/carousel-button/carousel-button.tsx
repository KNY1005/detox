"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

interface CarouselButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}

export default function CarouselButton({
  direction,
  onClick,
  label,
}: CarouselButtonProps) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute ${isLeft ? "left-8" : "right-8"} top-28 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm`}
    >
      <FontAwesomeIcon icon={isLeft ? faCaretLeft : faCaretRight} size="lg" />
    </button>
  );
}
