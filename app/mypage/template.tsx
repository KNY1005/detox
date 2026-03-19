"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export default function MypageTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
