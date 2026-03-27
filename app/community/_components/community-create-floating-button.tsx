"use client";

import { useRouter } from "next/navigation";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FloatingButton from "@/app/components/floating-button";

export default function CommunityCreateFloatingButton() {
  const router = useRouter();
  const createPath = "/community/new";

  const handleCreateClick = () => {
    router.push(createPath);
  };

  return (
    <FloatingButton
      ariaLabel="게시글 작성하기"
      onClick={handleCreateClick}
      className="btn-primary"
    >
      <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
    </FloatingButton>
  );
}
