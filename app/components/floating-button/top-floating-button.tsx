"use client";

import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FloatingButton from "./floating-button";

type TopFloatingButtonProps = {
  disabled?: boolean;
  className?: string;
};

export default function TopFloatingButton({
  disabled,
  className,
}: TopFloatingButtonProps) {
  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FloatingButton
      ariaLabel="맨 위로 이동하기"
      onClick={handleTopClick}
      disabled={disabled}
      className={`btn-white ${className ?? ""}`.trim()}
    >
      <FontAwesomeIcon icon={faArrowUp} aria-hidden="true" />
    </FloatingButton>
  );
}
