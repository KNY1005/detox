"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { cn } from "@/app/utils/class";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6 inline-block", className ?? "")}
      locale={ko}
      classNames={{
        root: "rounded-3xl bg-white shadow-xl border border-gray-50", // 더 깊은 그림자와 부드러운 외곽선
        months: "flex flex-col gap-2",
        month: "flex flex-col gap-1",
        month_caption:
          "flex justify-between items-center px-2 relative h-10 mb-2",
        caption_label: "text-[17px] font-bold text-gray-800 tracking-tight", // 가독성 향상
        nav: "flex items-center gap-1",
        button_previous:
          "inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-90",
        button_next:
          "inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-90",
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-2",
        weekday:
          "w-12 py-2 text-center text-[13px] font-semibold text-gray-400", // 요일 폰트 명확하게
        week: "flex w-full mt-1 gap-1",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button:
          "h-11 w-11 rounded-xl font-medium text-gray-700 transition-all hover:bg-brand-primary/10 hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
        range_start:
          "rounded-l-xl bg-brand-primary [&_button]:!text-white [&_button]:!font-bold",
        range_end:
          "rounded-r-xl bg-brand-primary [&_button]:!text-white [&_button]:!font-bold",
        selected: "rounded-xl !bg-brand-primary [&_button]:!text-white", // 선택된 날짜에 그림자 추가
        today:
          "text-brand-primary font-bold bg-brand-primary/5 rounded-xl underline underline-offset-4", // 오늘 날짜는 브랜드 컬러로 포인트
        outside: "text-gray-300 opacity-40 aria-selected:opacity-100",
        disabled: "text-gray-100 cursor-not-allowed",
        range_middle: "bg-brand-primary/5 text-brand-primary rounded-none", // 범위 선택 시 부드러운 배경색
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <FontAwesomeIcon
            icon={orientation === "left" ? faChevronLeft : faChevronRight}
            className="h-3.5 w-3.5"
          />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
