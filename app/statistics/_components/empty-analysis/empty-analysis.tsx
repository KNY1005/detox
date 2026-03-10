"use client";

export default function EmptyAnalysis() {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center w-full px-6 text-center bg-white">
      <h3 className="title-lg text-black mb-2">통계를 낼 수가 없네요</h3>
      <p className="text-gray-400 font-medium leading-relaxed">
        이 기간엔 이용했던 구독이 없어요
      </p>
    </div>
  );
}
