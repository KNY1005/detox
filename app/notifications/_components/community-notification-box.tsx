import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  type: "like" | "comment";
}

const typeMap = {
  like: {
    image: "/images/community-noti/like.png",
    label: "좋아요",
  },
  comment: {
    image: "/images/community-noti/comment.png",
    label: "댓글",
  },
};

export default function CommunityNotificationBox({ type }: Props) {
  return (
    <div
      className={cn(
        `w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 bg-white`
      )}
    >
      <Image
        src={typeMap[type].image}
        alt={typeMap[type].label}
        width={40}
        height={40}
      />
    </div>
  );
}
