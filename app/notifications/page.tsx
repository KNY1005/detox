"use client";

import { useRouter } from "next/navigation";
import Header from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import NotificationItem from "./_components/notification-item";
import {
  NotificationDataItem,
  NotificationItemProps,
} from "@/app/utils/notifications/type";

const mockData: NotificationDataItem[] = [
  {
    id: 1,
    type: "payment-pending",
    payload: { brand: "youtube-premium" },
    description: "유튜브 프리미엄 멤버십이 내일 결제될 예정입니다.",
    createdAt: "2026-03-05T10:00:00.000Z",
    isRead: true,
  },
  {
    id: 2,
    type: "trial-ending-soon",
    payload: { brand: "netflix" },
    description:
      "넷플릭스 무료체험이 3일 후 종료 됩니다. 결제 전 확인해보세요.",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: 3,
    type: "trial-ending-soon",
    payload: { brand: "tving" },
    description: "티빙 무료체험이 3일 후 종료 됩니다. 결제 전 확인해보세요.",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: 4,
    type: "community",
    payload: { communityType: "like" },
    description: "내가 작성한 게시글에 좋아요가 달렸어요.",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: 5,
    type: "community",
    payload: { communityType: "comment" },
    description: "내가 작성한 게시글에 댓글이 달렸어요",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: 6,
    type: "trial-ending-soon",
    payload: { brand: "tving" },
    description: "티빙 무료체험이 3일 후 종료 됩니다. 결제 전 확인해보세요.",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: 7,
    type: "community",
    payload: { communityType: "like" },
    description: "내가 작성한 게시글에 좋아요가 달렸어요.",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: 8,
    type: "community",
    payload: { communityType: "comment" },
    description: "내가 작성한 게시글에 댓글이 달렸어요",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
];

export default function Page() {
  const router = useRouter();

  const goNotificationSettings = () => {
    router.push("/notifications/settings");
  };

  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Header
        variant="back"
        onBack={() => router.back()}
        title="알림"
        rightContent={
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center text-gray-400 cursor-pointer"
            onClick={goNotificationSettings}
          >
            <span className="inline-flex items-center justify-center w-[28px] h-[28px] overflow-hidden shrink-0">
              <FontAwesomeIcon
                icon={faGear}
                className="text-gray-400"
                style={{
                  transform: "scale(0.8)",
                  transformOrigin: "center",
                }}
              />
            </span>
          </button>
        }
      />

      <button className="body-md text-gray-300 cursor-pointer px-6 mt-3 flex ml-auto">
        일괄 삭제
      </button>

      <div className="w-full mt-5 px-6 flex flex-col gap-10">
        <div className="flex flex-col gap-5 items-start">
          <span className="body-lg font-bold text-gray-300">오늘</span>
          <ul className="w-full flex flex-col gap-4">
            {mockData.map((item) => {
              const { id, ...props } = item;
              return (
                <NotificationItem
                  key={id}
                  {...(props as NotificationItemProps & {
                    description: string;
                    createdAt: string;
                  })}
                />
              );
            })}
          </ul>
        </div>
        <div className="flex flex-col gap-5 items-start">
          <span className="body-lg font-bold text-gray-300">오늘</span>
          <ul className="w-full flex flex-col gap-4">
            {mockData.map((item) => {
              const { id, ...props } = item;
              return (
                <NotificationItem
                  key={id}
                  {...(props as NotificationItemProps & {
                    description: string;
                    createdAt: string;
                  })}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
