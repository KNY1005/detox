import { NotificationType } from "./type";

export default function getNotificationTitle(
  type: NotificationType
): React.ReactNode {
  switch (type) {
    case "payment-pending":
      return (
        <span className="body-md font-bold text-state-danger">결제 예정</span>
      );
    case "trial-ending-soon":
      return (
        <span className="body-md font-bold text-brand-primary">
          체험 종료 임박
        </span>
      );
    case "community":
      return <span className="body-md font-bold text-gray-400">커뮤니티</span>;
  }
}
