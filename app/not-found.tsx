"use client";
import Image from "next/image";
import Button from "./components/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <main className="max-w-xl mx-auto min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center gap-5">
        <Image
          src="/images/not-found/sad-face.png"
          alt="404"
          width={80}
          height={80}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="header-md">페이지를 불러올 수 없어요</h1>
          <p className="title-md font-medium text-gray-300">
            죄송하지만 나중에 다시 시도해주세요.
          </p>
        </div>
      </div>

      <div className="w-full fixed bottom-10 left-0 right-0 px-6">
        <Button variant="primary" size="lg" className="w-full" onClick={goHome}>
          홈으로 이동
        </Button>
      </div>
    </main>
  );
}
