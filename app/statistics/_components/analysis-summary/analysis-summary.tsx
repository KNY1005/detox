"use client";

import AnalysisCard from "@/app/statistics/_components/analysis-card/analysis-card";

interface AnalysisSummaryProps {
  hasData: boolean;
}

export default function AnalysisSummary({ hasData }: AnalysisSummaryProps) {
  if (!hasData) return null;

  return (
    <div className="w-full px-5 py-6 bg-white animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="title-md text-brand-primary">
          AI디톡이<span className="text-gray-900">의 소비분석 요약</span>
        </h2>
        <p className="body-md text-gray-200 mt-1">
          AI가 분석한 정보로 일부는 실제와 다를 수 있어요.
        </p>
      </div>

      <AnalysisCard 
        title="비슷한 콘텐츠를 구독 중이에요"
        description={
          <>
            이 서비스 모두 <span className="underline">영화</span>와 <span className="underline">드라마</span>를 제공해요<br/>
            <span className="font-bold text-gray-800">넷플릭스</span>를 해지하면 최소 월 4,900원 아낄 수 있어요
          </>
        }
        brandType="netflix" 
      />

      <AnalysisCard 
        title="1년이면 운동화 한 켤레 살 수 있어요"
        description={
          <>
            넷플릭스를 해지하면 연 <span className="text-brand-primary body-lg">167,000원</span> 아낄 수 있어요
          </>
        }
        brandType="netflix" 
      />
    </div>
  );
}
