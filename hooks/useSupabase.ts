"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export const useSupabase = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. 초기 세션 가져오기
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn("[Supabase] 연결 실패:", error.message);
      } else {
        console.log("[Supabase] 연결 성공");
        setSession(session);
      }
      setLoading(false);
    });

    // 2. 인증 상태 변경 감지 (로그인/로그아웃 실시간 반영)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
};
