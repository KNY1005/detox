"use client";
import BrandBox from "@/app/components/brand-box";
import getNotificationTitle from "@/app/utils/notifications/getNotificationTitle";
import { NotificationItemProps } from "@/app/utils/notifications/type";
import { cn } from "@/lib/utils";
import CommunityNotificationBox from "./community-notification-box";
import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";

type Props = NotificationItemProps & {
  description: string;
  isRead?: boolean;
  createdAt: string;
  onClick?: () => void;
};

export default function NotificationItem({
  type,
  payload,
  description,
  isRead,
  createdAt,
  onClick,
}: Props) {
  return (
    <li
      className={cn(
        "w-full flex justify-between items-center gap-2 cursor-pointer",
        isRead && "opacity-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {type === "community" ? (
          <CommunityNotificationBox type={payload.communityType} />
        ) : (
          <BrandBox brandType={payload.brand} size="sm" />
        )}
        <div className="flex flex-col items-start gap-1 w-[calc(100%-48px-12px)]">
          {getNotificationTitle(type)}
          <span className="body-lg  font-normal text-gray-400 wrap-break-word">
            {description}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end gap-2 whitespace-nowrap w-1/4">
        <span className="body-md text-gray-200">
          {formatRelativeTime(createdAt)}
        </span>
        <button className="body-md font-normal text-gray-300">삭제</button>
      </div>
    </li>
  );
}
