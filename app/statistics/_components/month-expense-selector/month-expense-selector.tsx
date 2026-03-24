"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  groupCount: number;
}

export default function MonthExpenseSelector({
  selectedDate,
  onChangeDate,
  groupCount,
}: Props) {
  const changeMonth = (offset: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + offset,
      1
    );
    onChangeDate(newDate);
  };

  const shortYear = selectedDate.getFullYear().toString().slice(-2);

  return (
    <div className="flex flex-col items-start justify-center w-full pt-5 bg-white px-5">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="이전 달 보기"
          onClick={() => changeMonth(-1)}
          className="w-11 h-11 flex items-center justify-center text-gray-600"
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>

        <div className="min-w-40 text-center px-1">
          <h2 className="body-lg font-bold text-black whitespace-nowrap">
            {shortYear}년 {selectedDate.getMonth() + 1}월에 사용한 총 금액
          </h2>
        </div>

        <button
          type="button"
          aria-label="다음 달 보기"
          onClick={() => changeMonth(1)}
          className="w-11 h-11 flex items-center justify-center text-gray-600"
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>

      <div className="mt-2 pl-1">
        <span className="header-md text-brand-primary">
          {(groupCount ?? 0).toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
