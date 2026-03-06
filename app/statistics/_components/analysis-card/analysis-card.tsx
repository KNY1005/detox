"use client";

import React from "react";
import BrandBox from "@/app/components/brand-box";
import { SubscriptableBrandType } from "@/app/utils/brand/type";

interface AnalysisCardProps {
  title: string;
  description: React.ReactNode;

  brandType: SubscriptableBrandType; 
}

export default function AnalysisCard({ title, description, brandType }: AnalysisCardProps) {
  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-black">{title}</h3>
        <div className="text-[16px] text-gray-300 leading-snug">
          {description}
        </div>
      </div>
      

      <div className="w-full bg-gray-50 rounded-xl py-8 flex flex-col items-center justify-center gap-4">

        <BrandBox 
          brandType={brandType} 
          size="lg"
        />
        
        <button className="bg-gray-200 text-white text-[14px] px-3 py-1.5 rounded-md font-medium">
          해지 추천
        </button>
      </div>
    </div>
  );
}