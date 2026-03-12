"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Button from "../components/button";
import LoadingScreen from "../components/loading-screen";
import SnsLoginButton from "./_components/sns-login-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAnonymousLoginMutation, useCurrentUserQuery } from "@/query/users";
import { useToast } from "../hooks/useToast";

//로그인 후 이동 경로 검증
function getSafeRedirectPath(redirectPath: string | null) {
  if (
    !redirectPath ||
    !redirectPath.startsWith("/") ||
    redirectPath.startsWith("//") ||
    redirectPath.includes("\\")
  ) {
    return "/";
  }

  return redirectPath;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error } = useToast();
  const redirectPath = searchParams.get("redirect");
  const nextPath = getSafeRedirectPath(redirectPath);

  const { mutateAsync: anonymousLogin, isPending: isAnonymousLoginPending } =
    useAnonymousLoginMutation();

  const { data: currentUser, isPending: isCurrentUserPending } =
    useCurrentUserQuery();

  useEffect(() => {
    if (currentUser) {
      router.replace(nextPath);
    }
  }, [currentUser, nextPath, router]);

  const handleAnonymousLogin = async () => {
    try {
      await anonymousLogin();
      router.replace(nextPath);
    } catch (loginError) {
      console.error(loginError);
      error("로그인에 실패했어요.");
    }
  };

  if (isCurrentUserPending || currentUser) {
    return <LoadingScreen message="잠시만 기다려 주세요." />;
  }

  return (
    <main className="relative w-full min-h-screen flex flex-col items-center justify-center gap-20">
      <header className="flex flex-col items-center gap-4">
        <p className="body-md font-bold text-gray-400">
          디지털 구독 다이어트{" "}
          <span className="text-brand-primary">디톡스</span>
        </p>
        <Image src="/images/logo.png" alt="logo" width={200} height={55} />
      </header>

      <div className="w-full px-6 flex flex-col gap-4">
        <SnsLoginButton type="kakao" />
        <SnsLoginButton type="naver" />
        <SnsLoginButton type="google" />
      </div>

      <Tooltip open>
        <TooltipTrigger asChild>
          <div className="w-full px-6 flex flex-col gap-4 absolute bottom-12 left-1/2 -translate-x-1/2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnonymousLogin}
              loading={isAnonymousLoginPending}
            >
              익명 아이디로 로그인하기
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent sideOffset={16}>
          계정 생성 없이 바로 시작할 수 있어요
        </TooltipContent>
      </Tooltip>
    </main>
  );
}
