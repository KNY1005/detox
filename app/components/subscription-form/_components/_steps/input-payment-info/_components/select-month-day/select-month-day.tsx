"use client";

import SelectBox from "@/app/components/select-box";
import type { MonthDayValue } from "@/app/components/subscription-form/utils";

export type { MonthDayValue };

interface Props {
  value: MonthDayValue | null;
  onValueChange: (value: MonthDayValue | null) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}월`,
}));
const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}일`,
}));

export default function SelectMonthDay({ value, onValueChange }: Props) {
  const month = value?.month ?? null;
  const day = value?.day ?? null;

  const handleMonthChange = (m: number | null) => {
    if (m === null) {
      onValueChange(day !== null ? { month: 1, day } : null);
    } else {
      onValueChange({ month: m, day: day ?? 1 });
    }
  };

  const handleDayChange = (d: number | null) => {
    if (d === null) {
      onValueChange(month !== null ? { month, day: 1 } : null);
    } else {
      onValueChange({ month: month ?? 1, day: d });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-semibold text-gray-400">
        몇 월 며칠에 결제하나요?
      </label>
      <div className="flex gap-2">
        <SelectBox
          value={month?.toString() ?? ""}
          onValueChange={(v) => handleMonthChange(v ? Number(v) : null)}
        >
          <SelectBox.Wrapper>
            <SelectBox.Trigger>
              <SelectBox.Value placeholder="월" />
            </SelectBox.Trigger>
            <SelectBox.Content>
              {MONTHS.map((m) => (
                <SelectBox.Item key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectBox.Item>
              ))}
            </SelectBox.Content>
          </SelectBox.Wrapper>
        </SelectBox>

        <SelectBox
          value={day?.toString() ?? ""}
          onValueChange={(v) => handleDayChange(v ? Number(v) : null)}
        >
          <SelectBox.Wrapper>
            <SelectBox.Trigger>
              <SelectBox.Value placeholder="일" />
            </SelectBox.Trigger>
            <SelectBox.Content>
              {DAYS.map((d) => (
                <SelectBox.Item key={d.value} value={d.value.toString()}>
                  {d.label}
                </SelectBox.Item>
              ))}
            </SelectBox.Content>
          </SelectBox.Wrapper>
        </SelectBox>
      </div>
    </div>
  );
}
