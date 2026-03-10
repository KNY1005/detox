"use client";

import { Bar, BarChart, XAxis, Cell, LabelList } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface Props {
  userName: string;
  userAmount: number;
  compareName: string;
  compareAmount: number;
}

export default function ComparisonChart({
  userName,
  userAmount,
  compareName,
  compareAmount,
}: Props) {
  const chartData = [
    { name: userName, amount: userAmount },
    { name: compareName, amount: compareAmount },
  ];

  const chartConfig = {
    amount: { label: "소비 금액" },
  } satisfies ChartConfig;

  return (
    <div className="mx-6 py-6 bg-gray-50 rounded-3xl h-46">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 20, left: 20, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "black", fontSize: 14, fontWeight: 500 }}
            dy={10}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={30}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? "var(--brand-primary)" : "var(--gray-300)"}
              />
            ))}
            <LabelList
              dataKey="amount"
              position="top"
              formatter={(val: number) => `${val.toLocaleString()}원`}
              style={{ fill: "var(--gray-700)", fontSize: 14, fontWeight: 600 }}
              offset={10}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
