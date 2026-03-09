/**
 * 댓글, 알림 등에서 사용하는 상대 시간 포맷
 * - 방금: 1분 미만
 * - N분전: 1시간 미만
 * - N시간 전: 24시간 미만
 * - N일 전: 7일 미만
 * - 날짜: 7일 이상 (M월 D일 또는 YYYY.MM.DD)
 */
export function formatRelativeTime(
  date: Date | string | number,
  options?: {
    /** 7일 이상일 때 날짜 포맷. 기본: "M월 D일" */
    dateFormat?: "short" | "full";
  }
): string {
  const now = new Date();
  const target = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(target.getTime())) return "";
  const diffMs = Math.max(0, now.getTime() - target.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금";
  if (diffMin < 60) return `${diffMin}분전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  // 7일 이상: 날짜 노출
  const format = options?.dateFormat ?? "short";
  if (format === "full") {
    return target
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace(/\.$/, "");
  }

  const sameYear = now.getFullYear() === target.getFullYear();
  if (sameYear) {
    return `${target.getMonth() + 1}월 ${target.getDate()}일`;
  }
  return `${target.getFullYear()}.${String(target.getMonth() + 1).padStart(2, "0")}.${String(target.getDate()).padStart(2, "0")}`;
}
