"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

interface Props {
  type: "empty" | "same";
}

export default function HomeSummaryStaticCard({ type }: Props) {
  const isEmpty = type === "empty";

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="title">
          {isEmpty ? (
            <>
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
                  숨겨진 구독 추가하고
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
                  연간 최대 <span className="text-brand-primary">???원</span>
                </motion.div>
              </h1>
            </>
          ) : (
            <>
              <h2 className="text-2xl">한눈에 보는</h2>
              <h1 className="header-md">
                이번달 <span className="text-brand-primary">구독통계</span>
              </h1>
            </>
          )}
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
        <Image
          src={
            isEmpty
              ? "/images/emoji/main-nodata.png"
              : "/images/emoji/main-money.png"
          }
          alt=""
          width={100}
          height={100}
        />
      </div>
    </>
  );
}
