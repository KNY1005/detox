"use client";

interface UserBubbleProps {
  content: string;
  time: string;
}

export default function UserBubble({ content, time }: UserBubbleProps) {
  return (
    <div className="flex flex-col items-end mb-6 px-6 animate-in slide-in-from-right-2">
      <div className="bg-brand-primary text-white px-5 py-3 rounded-lg rounded-tr-none max-w-[85%]">
        <p className="text-body-lg leading-relaxed">{content}</p>
      </div>
      <span className="label-lg  text-gray-300 mt-1">{time}</span>
    </div>
  );
}
