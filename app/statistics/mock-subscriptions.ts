export interface SubscriptionItem {
  id: number;
  name: string; // 서비스 이름
  type: "monthly" | "yearly"; // 월간 vs 연간
  billingDate: {
    month?: number; // 연간 결제일 경우 필요 (1~12)
    day: number; // 결제일 (1~31)
  };
  endDate: string; // 구독 종료일 (YYYY-MM-DD)

  isShared: boolean; // 혼자 vs 여럿
  sharedCount?: number; // 공유 인원수 (여럿일 경우)

  paymentType: "paid" | "free"; // 유료 vs 무료

  price: number; // 유료일 경우 월/연 금액 (무료면 0)
  freePeriod?: number; // 무료일 경우 이용 가능 개월 수
  category: string;
}

// 2. 실제 목데이터 리스트
export const MOCK_SUBSCRIPTIONS: SubscriptionItem[] = [
  //  {
  //    id: 1,
  //    name: "넷플릭스",
  //    type: "monthly",
  //    billingDate: { day: 24 }, // 매달 24일 결제
  //    endDate: "2026-12-31",
  //    isShared: true,
  //    sharedCount: 4,
  //    paymentType: "paid",
  //    price: 17000,
  //    category: "OTT",
  //  },
  {
    id: 2,
    name: "유튜브 프리미엄",
    type: "yearly",
    billingDate: { month: 2, day: 24 }, // 매년 2월 24일 결제
    endDate: "2027-02-24",
    isShared: false,
    paymentType: "paid",
    price: 149000, // 연간 금액
    category: "OTT",
  },
  {
    id: 3,
    name: "쿠팡 와우",
    type: "monthly",
    billingDate: { day: 10 },
    endDate: "2026-08-10",
    isShared: false,
    paymentType: "free", // 무료 체험 중
    price: 0,
    freePeriod: 3, // 3개월 무료
    category: "Shopping",
  },
  //  {
  //    id: 4,
  //    name: "스포티파이",
  //    type: "monthly",
  //    billingDate: { day: 15 },
  //    endDate: "2026-11-15",
  //    isShared: true,
  //    sharedCount: 6,
  //    paymentType: "paid",
  //    price: 10900,
  //    category: "Music",
  //  },
];
