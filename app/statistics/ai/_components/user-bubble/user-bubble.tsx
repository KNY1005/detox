"use client";

interface UserBubbleProps {
  content: string;
  time: string;
}

export default function UserBubble({ content, time }: UserBubbleProps) {
  return (
    <div className="flex flex-col items-end mb-6 px-4 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-[#008080] text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
        <p className="text-[15px] leading-relaxed">{content}</p>
      </div>
      <span className="text-[11px] text-gray-400 mt-1">{time}</span>
    </div>
  );
}