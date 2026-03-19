import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

/**
 * 구독 생성
 * @param values 구독 생성 데이터
 * @returns 구독 생성 데이터
 */
export async function createSubscription(values: TablesInsert<"subscription">) {
  const { error, data } = await supabase
    .from("subscription")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Tables<"subscription">;
}

/**
 * 구독 목록 조회 (RLS로 현재 사용자 구독만 반환)
 */
export async function getSubscriptionList(userId: string) {
  const { data, error } = await supabase
    .from("subscription")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Tables<"subscription">[];
}

/**
 * 구독 상세 조회
 * @param id 구독 ID
 * @returns 구독 상세 데이터
 * @throws 구독이 없거나 접근 권한이 없을 때
 */
export async function getSubscriptionDetail(id: string) {
  const { data, error } = await supabase
    .from("subscription")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("구독을 찾을 수 없습니다");
  }

  return data as Tables<"subscription">;
}

/**
 * 구독 삭제
 * @param id 구독 ID
 * @returns 구독 삭제
 * @throws 구독이 없거나 접근 권한이 없을 때
 */
export async function deleteSubscription(id: string): Promise<boolean> {
  const { error, data } = await supabase
    .from("subscription")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("구독을 찾을 수 없습니다");
  }

  return true;
}

/**
 * 구독 수정
 * @param id 구독 ID
 * @param values 구독 수정 데이터
 * @returns 구독 수정 데이터
 * @throws 구독이 없거나 접근 권한이 없을 때
 */
export async function updateSubscription(
  id: string,
  values: TablesUpdate<"subscription">
) {
  const { error, data } = await supabase
    .from("subscription")
    .update(values)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("구독을 찾을 수 없습니다");
  }

  return data as Tables<"subscription">;
}
