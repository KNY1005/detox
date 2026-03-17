"use client";

import Image from "next/image";
import Button from "@/app/components/button";
import BottomCTA from "@/app/components/bottom-cta";
import { useRouter } from "next/navigation";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorScreen({ error, reset }: Props) {
  const router = useRouter();

  return (
    <div className="mx-auto min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center gap-5">
        <Image
          src="/images/not-found/sad-face.png"
          alt="오류"
          width={80}
          height={80}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="header-md">문제가 발생했어요</h1>
          <p className="title-md font-medium text-gray-300 text-center">
            {error.message || "잠시 후 다시 시도해주세요."}
          </p>
        </div>
      </div>

      <BottomCTA>
        <div className="flex flex-col gap-2 w-full">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={reset}
          >
            다시 시도
          </Button>
          <Button
            variant="neutral"
            size="lg"
            className="w-full"
            onClick={() => router.push("/main")}
          >
            홈으로 이동
          </Button>
        </div>
      </BottomCTA>
    </div>
  );
}
