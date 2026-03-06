"use client";

export default function DateDivider({ date }: { date?: string }) {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일`;

  return (
    <div className="flex items-center w-full px-5">
      <div className="flex-1 h-[1px] bg-gray-200"></div>
      <span className="mx-4 text-[14px] font-medium text-gray-300 whitespace-nowrap">
        {date || defaultDate}
      </span>
      <div className="flex-1 h-[1px] bg-gray-200"></div>
    </div>
  );
}