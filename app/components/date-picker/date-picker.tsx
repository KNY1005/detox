"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/app/utils/class";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export default function DatePicker({
  label,
  placeholder = "날짜를 선택하세요",
  value,
  onChange,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("w-full flex flex-col gap-2", className ?? "")}>
      {label && (
        <label className="text-base font-semibold text-gray-400">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full flex justify-between items-center gap-2 rounded-lg bg-gray-50 px-6 py-3",
              "text-base text-gray-400 placeholder:text-gray-300",
              "outline-none hover:bg-gray-100/80 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "min-h-[46px]",
              !value ? "text-gray-300" : ""
            )}
          >
            <span className="flex-1 text-left">
              {value ? format(value, "PPP", { locale: ko }) : placeholder}
            </span>
            <FontAwesomeIcon
              icon={faCalendar}
              className="h-5 w-5 shrink-0 text-gray-300"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            defaultMonth={value}
            locale={ko}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
