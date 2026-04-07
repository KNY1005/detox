import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Benchmark {
  category_key: string;
  label: string;
  average_amount: number;
}

export function useDynamicBenchmark(displayAmount: number) {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("benchmark_stats")
        .select("category_key, label, average_amount")
        .order("average_amount", { ascending: true });

      if (!error && data) {
        const sortedData = [...data].sort((a, b) => {
          if (a.category_key === "all") return -1;
          if (b.category_key === "all") return 1;
          return 0;
        });

        setBenchmarks(sortedData);
      }
      setIsLoading(false);
    };

    fetchBenchmarks();
  }, []);

  const current = benchmarks[currentIndex];

  const averageAmount = current?.average_amount ?? 0;
  const label = current?.label ?? "데이터 로딩 중...";

  const diffAmount = Math.abs(displayAmount - averageAmount);
  const status: "over" | "under" =
    displayAmount > averageAmount ? "over" : "under";

  const handleNext = () => {
    if (benchmarks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % benchmarks.length);
  };

  const handlePrev = () => {
    if (benchmarks.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + benchmarks.length) % benchmarks.length
    );
  };

  return {
    label,
    averageAmount,
    diffAmount,
    status,
    isLoading,
    handleNext,
    handlePrev,
    currentIndex,
    benchmarks,
  };
}
