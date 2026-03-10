"use client";

import Button from "@/app/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmptySubscriptionOverlay() {
  const router = useRouter();

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
      <div className="text-center px-6 mb-12">
        <h2 className="title-md text-black mb-2">구독 서비스를 추가하세요</h2>
        <p className="body-lg text-gray-500 leading-relaxed">
          추가된 구독 서비스가 없어
          <br />
          <span className="font-bold text-gray-300">
            지금은 통계를 낼 수 없어요
          </span>
        </p>
      </div>

      <div className="w-full px-6">
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/statistics/ai")}
        >
          구독 추가하기
        </Button>
      </div>
    </div>
  );
}
