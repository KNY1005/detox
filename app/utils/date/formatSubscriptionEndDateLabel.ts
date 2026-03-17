import {
  addMonths,
  endOfWeek,
  getDate,
  isSameMonth,
  isSameYear,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";
/**
 * 날짜를 받아서 계산한 뒤, 이번주 N일, 이번달 N일, 다음달 N일 형식으로 변환
 * @param endDate ISO 날짜 문자열 (예: "2025-03-15" 또는 "2025-03-15T00:00:00.000Z")
 * @returns "이번주 15일" | "이번달 15일" | "다음달 15일" | "N월 N일" | ""
 */
export default function formatSubscriptionEndDateLabel(
  endDate: string | null | undefined
) {
  if (!endDate?.trim()) return "";
  const date = parseISO(endDate.split("T")[0]);
  const today = new Date();

  const day = getDate(date);

  // 이번주 (월~일 기준)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  if (isWithinInterval(date, { start: weekStart, end: weekEnd })) {
    return `이번주 ${day}일`;
  }

  // 이번달
  if (isSameYear(date, today) && isSameMonth(date, today)) {
    return `이번달 ${day}일`;
  }

  // 다음달
  const nextMonth = addMonths(today, 1);
  if (isSameYear(date, nextMonth) && isSameMonth(date, nextMonth)) {
    return `다음달 ${day}일`;
  }

  // 그 외: N월 N일
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${day}일`;
}
