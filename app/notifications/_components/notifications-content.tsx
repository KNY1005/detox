"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import TextButton from "@/app/components/text-button";
import NotificationItem from "./notification-item";
import {
  useDeleteAllNotificationsMutation,
  usePastNotificationsSuspenseQuery,
  useTodayNotificationsSuspenseQuery,
} from "@/query/notification";
import { useToast } from "@/app/hooks/useToast";
import Empty from "./empty";
import { useAlert } from "@/app/hooks/useAlert";

interface Props {
  userId: string;
}

export default function NotificationsContent({ userId }: Props) {
  const router = useRouter();
  const { error, success } = useToast();
  const alert = useAlert();
  const { data: rawToday } = useTodayNotificationsSuspenseQuery(userId);
  const { data: rawPast } = usePastNotificationsSuspenseQuery(userId);
  const deleteAllMutation = useDeleteAllNotificationsMutation(userId);

  const totalCount = rawToday.length + rawPast.length;

  const goNotificationSettings = () => {
    router.push("/notifications/settings");
  };

  const handleBulkDeleteConfirm = () => {
    if (totalCount === 0) return;

    alert.alert({
      title: "모든 알림을 삭제할까요?",
      description: "모든 알림을 삭제하면 복구할 수 없어요.",
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
      onConfirm: handleBulkDelete,
    });
  };

  const handleBulkDelete = async () => {
    try {
      await deleteAllMutation.mutateAsync();
      success("모든 알림이 삭제되었어요.");
    } catch (err) {
      error("일괄 삭제에 실패했어요.");
    }
  };

  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Header
        variant="back"
        title="알림"
        rightContent={
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center text-gray-400 cursor-pointer"
            onClick={goNotificationSettings}
            aria-label="알림 설정으로 이동"
          >
            <span className="inline-flex items-center justify-center w-[28px] h-[28px] overflow-hidden shrink-0">
              <FontAwesomeIcon icon={faGear} className="text-gray-300" />
            </span>
          </button>
        }
      />

      {totalCount > 0 && (
        <TextButton
          size="md"
          className="font-bold px-6 mt-3 flex ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleBulkDeleteConfirm}
          disabled={deleteAllMutation.isPending || totalCount === 0}
        >
          일괄 삭제
        </TextButton>
      )}

      <div className="w-full mt-5 px-6 flex flex-col gap-10">
        {/* 오늘 알림 */}
        <div className="w-full flex flex-col gap-5 items-start">
          <span className="body-lg font-bold text-gray-300">오늘</span>
          {rawToday.length === 0 ? (
            <Empty message="오늘 알림이 없습니다" />
          ) : (
            <ul className="w-full flex flex-col gap-4">
              {rawToday.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </ul>
          )}
        </div>

        {/* 지난 알림 */}
        <div className="w-full flex flex-col gap-5 items-start">
          <span className="body-lg font-bold text-gray-300">지난 알림</span>
          {rawPast.length === 0 ? (
            <Empty message="지난 알림이 없습니다" />
          ) : (
            <ul className="w-full flex flex-col gap-4">
              {rawPast.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
