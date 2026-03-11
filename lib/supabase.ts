import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL과 Anon Key가 필요합니다. .env 파일에 SUPABASE_URL, SUPABASE_ANON_KEY를 설정해 주세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
