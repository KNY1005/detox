"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import type { FoodResult } from "@/app/utils/subscriptions/random-food";
import HomeSummarySkeleton from "./home-summary-skeleton";

interface Props {
  type: "this-month" | "saved";
  food: FoodResult | null;
  isLoading: boolean;
}

export default function HomeSummaryFoodCard({ type, food, isLoading }: Props) {
  const isSaved = type === "saved";

  if (isLoading || !food) {
    return <HomeSummarySkeleton type={type} />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="title">
          <h2 className="text-2xl overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
                ease: "linear",
              }}
            >
              {isSaved ? "지난달보다" : "이번달 구독료로"}
            </motion.div>
          </h2>
          <h1 className="header-md overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.3,
                ease: "linear",
              }}
            >
              {food.label}{" "}
              <span className="text-brand-primary">
                {food.count}
                {food.unit}
              </span>{" "}
              {isSaved ? "아꼈어요" : ""}
            </motion.div>
          </h1>
        </div>

        <Link
          href="/statistics"
          className="body-lg text-gray-300 inline-flex items-center gap-1 mt-2"
        >
          자세히 알아보기
          <FontAwesomeIcon icon={faAngleRight} size="xs" />
        </Link>
      </div>
      <div>
        <Image src={food.imageSrc} alt={food.label} width={100} height={100} />
      </div>
    </>
  );
}
