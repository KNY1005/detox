"use client";

import { Bar, BarChart, Cell, LabelList } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  userName?: string;
  userAmount?: number;
  compareName?: string;
  compareAmount?: number;
  data?: { month: string; my_spend: number; avg_spend: number }[];
  diffAmount?: number;
  diffMessage?: string;
  isLoading?: boolean;
}

export default function ComparisonChart({
  userName,
  userAmount,
  compareName,
  compareAmount,
  data,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="mx-6 py-6 bg-gray-50 rounded-lg h-56">
          <div className="h-full w-full flex flex-col justify-end gap-4 px-6 pb-2">
            <div className="flex items-end justify-between gap-6">
              <Skeleton className="h-28 w-12 bg-gray-200/70" />
              <Skeleton className="h-20 w-12 bg-gray-200/70" />
              <Skeleton className="h-32 w-12 bg-gray-200/70" />
              <Skeleton className="h-24 w-12 bg-gray-200/70" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16 bg-gray-200/70" />
              <Skeleton className="h-4 w-16 bg-gray-200/70" />
            </div>
          </div>
        </div>
        <Skeleton className="mx-6 h-14 rounded-xl bg-teal-100/60" />
      </div>
    );
  }

  const chartData = data
    ? data.map((item) => ({ name: item.month, amount: item.my_spend }))
    : [
        { name: userName || "나", amount: userAmount || 0 },
        { name: compareName || "평균", amount: compareAmount || 0 },
      ];

  const chartConfig = {
    amount: { label: "소비 금액" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-6">
        <div className="h-56 rounded-lg bg-gray-50 px-6 pt-5">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full aspect-auto!"
          >
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 0, left: 0, bottom: 0 }}
            >
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={30}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0 ? "var(--brand-primary)" : "var(--gray-300)"
                    }
                  />
                ))}

                <LabelList
                  dataKey="amount"
                  position="top"
                  formatter={(val: number) => `${val.toLocaleString()}원`}
                  style={{
                    fill: "var(--gray-400)",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                  offset={10}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div
          className="mt-2 grid px-6"
          style={{
            gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`,
          }}
        >
          {chartData.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="text-center body-md text-gray-400"
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
