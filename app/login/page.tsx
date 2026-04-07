"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
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
import { getSafeRedirectPath } from "@/app/utils/auth/get-safe-redirect-path";
import { signInWithOAuth } from "@/services/users";

function LoginContent() {
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

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(nextPath)}`;

      const { error: oauthError } = await signInWithOAuth(provider, redirectTo);

      if (oauthError) {
        throw oauthError;
      }
    } catch (loginError) {
      console.error(loginError);
      error("로그인에 실패했어요.");
    }
  };

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
    <div className="overflow-hidden">
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full min-h-screen flex flex-col items-center justify-center gap-20"
      >
        <header className="flex flex-col items-center gap-4">
          <p tabIndex={0} className="body-md font-bold text-gray-400">
            디지털 구독 다이어트{" "}
            <span className="text-brand-primary">디톡스</span>
          </p>
          <Link href="/" aria-label="홈으로 이동">
            <Image src="/images/logo.png" alt="" width={200} height={55} />
          </Link>
        </header>

        <div className="w-full px-6 flex flex-col gap-4">
          <SnsLoginButton
            type="kakao"
            onClick={() => handleSocialLogin("kakao")}
          />
          <SnsLoginButton
            type="google"
            onClick={() => handleSocialLogin("google")}
          />

          {/* <SnsLoginButton type="naver" /> */}
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
      </motion.main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen message="잠시만 기다려 주세요." />}>
      <LoginContent />
    </Suspense>
  );
}
