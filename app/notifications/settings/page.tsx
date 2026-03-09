"use client";
import Header from "@/app/components/header";
import Switch from "@/app/components/switch";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Header variant="back" onBack={() => router.back()} title="알림설정" />

      <div className="w-full py-4 px-6 bg-blue-50 flex items-center justify-center">
        <span className="body-md font-normal text-brand-primary">
          알림을 끄더라도 중요한 공지 등은 계속 전송될 수 있습니다.
        </span>
      </div>

      <div className="w-full px-6 flex flex-col">
        {/* 커뮤니티 알람 */}
        <div className="w-full flex items-center justify-between py-4">
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="title-md font-bold text-gray-400">
              커뮤니티 알람
            </span>
            <span className="body-lg font-normal text-gray-300">
              새로운 댓글이나 게시글 알림을 받습니다
            </span>
          </div>

          <Switch checked={true} onCheckedChange={() => {}} />
        </div>

        {/* 구독일 알람 */}
        <div className="w-full flex items-center justify-between py-4">
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="title-md font-bold text-gray-400">
              구독일 알람
            </span>
            <span className="body-lg font-normal text-gray-300">
              결제일 관련 알림을 받습니다
            </span>
          </div>

          <Switch checked={true} onCheckedChange={() => {}} />
        </div>
      </div>
    </main>
  );
}
