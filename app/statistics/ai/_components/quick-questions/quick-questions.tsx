"use client";

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const questions = [
    "내 소비 습관에 맞는 통신사 결합 할인 혜택을 분석해줘",
    "내가 중복으로 내는 구독료가 얼마인지 알려줘",
    "최근 3개월간 나의 구독 소비 추이를 분석해줘",
  ];

  return (
    <div className="flex flex-col items-end gap-2.5 px-6 mb-6">
      {questions.map((q, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => onSelect(q)}
          className="body-lg bg-gray-200 text-white px-3 py-3 rounded-lg rounded-tr-none transition-opacity text-right break-keep max-w-[90%]"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
