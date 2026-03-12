"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateNickname } from "@/app/utils/nickname";
import {
  getCurrentUser,
  getUserProfile,
  signInAnonymously,
  signOut,
  upsertUser,
} from "@/services/users";

const NICKNAME_MAX_RETRY_COUNT = 5;
function isNicknameConflictError(error: {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}) {
  // Supabase/Postgres가 내려주는 에러 문자열 안에서 unique 제약과 nickname 컬럼명을 함께 확인합니다.
  const errorMessage = [
    error.message ?? "",
    error.details ?? "",
    error.hint ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const isUniqueViolation =
    error.code === "23505" || errorMessage.includes("duplicate key");

  return isUniqueViolation && errorMessage.includes("nickname");
}

export const usersKeys = {
  all: ["users"],
  auth: () => [...usersKeys.all, "auth"],
  profile: () => [...usersKeys.all, "profile"],
  profileById: (userId: string) => [...usersKeys.profile(), userId],
} as const;

export function useAnonymousLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...usersKeys.auth(), "anonymous-login"],
    mutationFn: async () => {
      const { data, error } = await signInAnonymously();

      if (error || !data.user) {
        throw error ?? new Error("로그인에 실패했어요.");
      }

      const user = data.user;
      const userPayload = {
        id: user.id,
        provider: "anonymous",
        provider_id: user.id,
        email: user.email,
        profile_image: null,
        is_anonymous: true,
      };

      let upsertError: Awaited<ReturnType<typeof upsertUser>>["error"] = null;

      for (
        let retryCount = 0;
        retryCount < NICKNAME_MAX_RETRY_COUNT;
        retryCount++
      ) {
        const { error } = await upsertUser({
          ...userPayload,
          nickname: generateNickname(),
        });

        if (!error) {
          return user;
        }

        upsertError = error;

        // 닉네임 UNIQUE 충돌일 때만 새 후보를 뽑아 다시 시도합니다.
        if (!isNicknameConflictError(error)) {
          break;
        }
      }

      if (upsertError) {
        const { error: signOutError } = await signOut();

        if (signOutError) {
          console.error(signOutError);
        }

        throw upsertError;
      }

      throw new Error("사용자 정보 저장에 실패했어요.");
    },
    onSuccess: (user) => {
      queryClient.setQueryData([...usersKeys.auth(), "current-user"], user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...usersKeys.auth(), "logout"],
    mutationFn: async () => {
      const { error } = await signOut();

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData([...usersKeys.auth(), "current-user"], null);
      queryClient.removeQueries({
        queryKey: [...usersKeys.auth(), "current-user"],
      });
      queryClient.removeQueries({
        queryKey: usersKeys.profile(),
      });
    },
  });
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: [...usersKeys.auth(), "current-user"],
    queryFn: async () => {
      const { data, error } = await getCurrentUser();

      if (error) {
        throw error;
      }

      return data.user;
    },
  });
}

export function useUserProfileQuery(userId?: string) {
  return useQuery({
    queryKey: usersKeys.profileById(userId ?? ""),
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      const { data, error } = await getUserProfile(userId);

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: Boolean(userId),
  });
}
