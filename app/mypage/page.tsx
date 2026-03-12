"use client";

import Image from "next/image";
import { useEffect } from "react";
import Avatar from "../components/avatar";
import Header from "../components/header";
import Input from "../components/input";
import Button from "../components/button";
import BottomNav from "../components/bottom-nav";
import LoadingScreen from "../components/loading-screen";
import TextButton from "../components/text-button";
import { useRouter } from "next/navigation";
import {
  useCurrentUserQuery,
  useLogoutMutation,
  useUserProfileQuery,
} from "@/query/users";
import { useToast } from "../hooks/useToast";

export default function Page() {
  const router = useRouter();
  const { error } = useToast();
  const logoutMutation = useLogoutMutation();
  const currentUserQuery = useCurrentUserQuery();
  const userProfileQuery = useUserProfileQuery(currentUserQuery.data?.id);

  useEffect(() => {
    if (!currentUserQuery.isPending && !currentUserQuery.data) {
      router.replace("/login");
    }
  }, [currentUserQuery.data, currentUserQuery.isPending, router]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/login");
    } catch (logoutError) {
      console.error(logoutError);
      error("로그아웃에 실패했어요.");
    }
  };

  if (
    currentUserQuery.isPending ||
    !currentUserQuery.data ||
    userProfileQuery.isPending
  ) {
    return <LoadingScreen message="내 정보를 불러오는 중이에요." />;
  }

  const nickname = userProfileQuery.data?.nickname ?? "사용자";
  const email =
    userProfileQuery.data?.email ??
    currentUserQuery.data.email ??
    "이메일 정보가 없어요.";

  return (
    <main className="w-full min-h-screen flex flex-col items-center relative">
      <Header
        variant="text"
        leftText="내 정보"
        rightContent={
          <TextButton
            size="md"
            className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={logoutMutation.isPending}
            onClick={handleLogout}
          >
            로그아웃
          </TextButton>
        }
      />

      <div className="w-full flex flex-col px-6 mt-18 gap-18">
        <div className="flex flex-col gap-4 items-center">
          <div className="relative w-fit">
            <Avatar size="xl" src="" alt="my-profile-image" />
            <button className="absolute bottom-0 right-[-10px]">
              <Image
                src="/images/my-page/upload-image.png"
                alt="edit-profile"
                width={44}
                height={44}
              />
            </button>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="body-lg font-bold">{nickname}</span>
            <span className="body-md font-normal text-gray-300">{email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Input
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            defaultValue={userProfileQuery.data?.nickname ?? ""}
          />
          <Button variant="primary" size="lg">
            저장하기
          </Button>
        </div>
      </div>

      {!currentUserQuery.data?.is_anonymous ? (
        <TextButton
          size="md"
          underline
          className="absolute left-1/2 -translate-x-1/2 bottom-[108px] w-auto flex items-center justify-center gap-2"
        >
          탈퇴하기
        </TextButton>
      ) : null}

      <BottomNav />
    </main>
  );
}
