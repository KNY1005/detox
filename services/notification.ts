import getTodayStartEndISO from "@/app/utils/notifications/getTodayStartEndISO";
import { supabase } from "@/lib/supabase";

const NOTIFICATION_SELECT = `
  *,
  subscription:subscription_id(service)
`;

/**
 * 유저의 모든 알림을 조회합니다.
 */
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notification")
    .select(NOTIFICATION_SELECT)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 오늘 생성된 알림만 조회합니다.
 */
export async function getTodayNotifications(userId: string) {
  const { start, end } = getTodayStartEndISO();

  const { data, error } = await supabase
    .from("notification")
    .select(NOTIFICATION_SELECT)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 오늘 이전 날짜의 알림만 조회합니다.
 */
export async function getPastNotifications(userId: string) {
  const { start } = getTodayStartEndISO();

  const { data, error } = await supabase
    .from("notification")
    .select(NOTIFICATION_SELECT)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .lt("created_at", start)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export type NotificationRow = Awaited<
  ReturnType<typeof getNotifications>
>[number];

/**
 * 알림을 소프트 삭제합니다.
 */
export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from("notification")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", notificationId);

  if (error) throw error;
}

/**
 * 유저의 모든 알림을 일괄 소프트 삭제합니다.
 */
export async function deleteAllNotifications(userId: string) {
  const { error } = await supabase
    .from("notification")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("deleted_at", null);

  if (error) throw error;
}

/**
 * 알림을 읽음 처리합니다.
 * @param notificationId 알림 ID
 */
export async function readNotification(notificationId: string) {
  const { error } = await supabase
    .from("notification")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", notificationId);

  if (error) throw error;
}

/**
 * 유저가 읽지 않은 알람이 있는지 조회합니다.
 * @param userId 유저 ID
 */
export async function hasUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notification")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .is("is_read", false);

  if (error) throw error;
  return data?.length > 0;
}
