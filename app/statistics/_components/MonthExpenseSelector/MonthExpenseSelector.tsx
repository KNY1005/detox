"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
  onChangeDate?: (date: Date) => void;
  groupCount: number;
}

export default function MonthExpenseSelector({ onChangeDate, groupCount }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    onChangeDate?.(newDate);
  };

  return (
    <div className="flex flex-col items-start justify-center w-full py-5 bg-white px-5">
      <div className="flex items-center">
        <button 
          onClick={() => changeMonth(-1)}
          className="text-black transition-colors p-1"
        >
          <FontAwesomeIcon icon={faCaretLeft} size="xl" />
        </button>

        <div className="min-w-[160px] text-center px-1">
          <h2 className="text-lg font-bold text-black tracking-tight whitespace-nowrap">
            {currentDate.getMonth() + 1}월에 사용한 총 금액
          </h2>
        </div>

        <button 
          onClick={() => changeMonth(1)}
          className="text-black transition-colors p-1"
        >
          <FontAwesomeIcon icon={faCaretRight} size="xl" />
        </button>
      </div>

      <div className="mt-2 pl-1">
        <span className="text-2xl font-black text-brand-primary">
          {(groupCount ?? 0).toLocaleString()}원
        </span>
      </div>
    </div>
  );
}