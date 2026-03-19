"use client";

import { useRouter } from "next/navigation";
import FloatingButton from "@/app/components/floating-button";

export default function CommunityCreateFloatingButton() {
  const router = useRouter();
  const createPath = "/community/new";

  const handleCreateClick = () => {
    router.push(createPath);
  };

  return <FloatingButton variant="create" onClick={handleCreateClick} />;
}
