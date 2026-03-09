"use client";

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const questions = [
    "비슷한 카테고리 두 개 이상 구독하는게 있어?",
    "이 구독 해지하면 1년에 얼마 아낄 수 있을까?",
    "이 구독 더 저렴하게 이용할 수 있는 할인방법 있어?",
    "구독료를 줄이려면 뭐부터 해지하는게 좋을까?",
    "내 소비 습관으로 볼 때 추천할만한 구독 상품이 있어?",
  ];

  return (
    <div className="flex flex-col items-end gap-2 px-6 mb-6">
      {questions.map((q, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => onSelect(q)}
          className="bg-[#999999] text-white text-[14px] px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm active:opacity-80 transition-opacity text-right max-w-[90%]"
        >
          {q}
        </button>
      ))}
    </div>
  );
}