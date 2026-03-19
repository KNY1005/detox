"use client";

import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase.types";

type UpsertUserParams = TablesInsert<"users">;
export type UserProfile = Tables<"users">;

//소셜
export async function signInWithOAuth(
  provider: "google" | "kakao",
  redirectTo: string
) {
  return supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
}

//익명
export async function signInAnonymously() {
  return supabase.auth.signInAnonymously();
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const result = await supabase.auth.getUser();

  if (isAuthSessionMissingError(result.error)) {
    return {
      ...result,
      data: {
        ...result.data,
        user: null,
      },
      error: null,
    };
  }

  return result;
}

export async function getUserProfile(userId: string) {
  return supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .is("deleted_at", null)
    .maybeSingle();
}

export async function upsertUser(params: UpsertUserParams) {
  return supabase.from("users").upsert(params);
}

type UpdateUserParams = Pick<
  TablesUpdate<"users">,
  "nickname" | "profile_image"
>;

export async function updateUserProfile(
  userId: string,
  params: UpdateUserParams
) {
  return supabase
    .from("users")
    .update(params)
    .eq("id", userId)
    .select()
    .single();
}
