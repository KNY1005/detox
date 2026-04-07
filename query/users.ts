"use client";

import { upsertUserWithNicknameRetry } from "@/app/utils/auth/upsert-user-with-nickname-retry";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { generateNickname } from "@/app/utils/nickname";
import {
  getCurrentUser,
  getUserProfile,
  signInAnonymously,
  signOut,
  updateUserProfile,
  upsertUser,
} from "@/services/users";
import { communityKeys } from "@/query/community-options";

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

      try {
        await upsertUserWithNicknameRetry({
          makeNickname: () => generateNickname(),
          tryUpsert: (nickname) =>
            upsertUser({
              ...userPayload,
              nickname,
            }),
        });

        return user;
      } catch (upsertError) {
        const { error: signOutError } = await signOut();

        if (signOutError) {
          console.error(signOutError);
        }

        throw upsertError;
      }
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
      queryClient.clear();
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

/**
 * 유저 프로필을 조회합니다. (Suspense용)
 */
export function useUserProfileSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: usersKeys.profileById(userId),
    queryFn: async () => {
      const { data, error } = await getUserProfile(userId);

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

interface UpdateUserProfileParams {
  nickname?: string;
  profile_image?: string;
}

/**
 * 유저 프로필(닉네임, 프로필 이미지)을 수정합니다.
 */
export function useUpdateUserProfileMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...usersKeys.profile(), "update", userId],
    mutationFn: async (params: UpdateUserProfileParams) => {
      const { data, error } = await updateUserProfile(userId, params);

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(usersKeys.profileById(userId), data);
      }

      void queryClient.invalidateQueries({
        queryKey: communityKeys.all,
        refetchType: "all",
      });
    },
  });
}
