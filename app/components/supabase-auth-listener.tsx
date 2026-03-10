"use client";

import { useSupabase } from "@/hooks/useSupabase";

/**
 * Supabase 인증 상태를 초기화하고 변경을 감지합니다.
 * layout에서 사용 - 서버 컴포넌트에서 useSupabase 훅을 직접 호출할 수 없으므로
 * 이 클라이언트 컴포넌트를 통해 감싸서 사용합니다.
 */
export default function SupabaseAuthListener() {
  useSupabase();
  return null;
}
