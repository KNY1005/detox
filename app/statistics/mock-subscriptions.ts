export interface SubscriptionItem {
  id: string; // id
  user_id: string; // uuid
  service: string; // 서비스 이름 (name -> service)
  billing_cycle: "MONTHLY" | "YEARLY"; // type -> billing_cycle
  payment_day: number; // 결제일 (1~31)
  next_payment_date: string; // 다음 결제일 (YYYY-MM-DD)
  end_date: string | null; // 구독 종료일 (없으면 null)
  subscription_mode: "BASIC" | "STANDARD" | "PREMIUM" | "FAMILY"; // 구독 요금제 등급
  payment_type: "PAID" | "FREE"; // 유료 vs 무료

  trial_months: number; // 무료 체험 개월 수 (freePeriod -> trial_months)
  member_count: number; // 공유 인원수 (isShared, sharedCount -> member_count)
  total_amount: number; // 총 금액 (price -> total_amount)

  status: "ACTIVE" | "PAUSED" | "CANCELED"; // 현재 상태
  created_at: string; // DB 생성일
  updated_at: string; // DB 수정일

  // 💡 프론트엔드 AI 분석을 위해 카테고리는 유지합니다.
  category: string;
}

// 2. 주석 풀고 DB 구조에 맞춘 실제 목데이터 리스트
export const MOCK_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: "uuid-001",
    user_id: "user-nayoung",
    service: "넷플릭스",
    billing_cycle: "MONTHLY",
    payment_day: 24,
    next_payment_date: "2026-03-24",
    end_date: "2026-12-31",
    subscription_mode: "PREMIUM",
    payment_type: "PAID",
    trial_months: 0,
    member_count: 4, // 4명 공유
    total_amount: 17000,
    status: "ACTIVE",
    created_at: "2025-12-24T10:00:00Z",
    updated_at: "2026-02-24T10:00:00Z",
    category: "OTT",
  },
  {
    id: "uuid-002",
    user_id: "user-nayoung",
    service: "유튜브 프리미엄",
    billing_cycle: "YEARLY",
    payment_day: 24,
    next_payment_date: "2027-02-24", // 연간 결제 반영
    end_date: "2027-02-24",
    subscription_mode: "BASIC",
    payment_type: "PAID",
    trial_months: 0,
    member_count: 1, // 혼자 사용
    total_amount: 149000, // 연간 금액
    status: "ACTIVE",
    created_at: "2026-02-24T10:00:00Z",
    updated_at: "2026-02-24T10:00:00Z",
    category: "OTT",
  },
  {
    id: "uuid-003",
    user_id: "user-nayoung",
    service: "쿠팡 와우",
    billing_cycle: "MONTHLY",
    payment_day: 10,
    next_payment_date: "2026-04-10",
    end_date: "2026-08-10",
    subscription_mode: "BASIC",
    payment_type: "FREE",
    trial_months: 3, // 3개월 무료
    member_count: 1,
    total_amount: 0, // 무료니까 0원
    status: "ACTIVE",
    created_at: "2026-03-10T10:00:00Z",
    updated_at: "2026-03-10T10:00:00Z",
    category: "Shopping",
  },
  {
    id: "uuid-004",
    user_id: "user-nayoung",
    service: "스포티파이",
    billing_cycle: "MONTHLY",
    payment_day: 15,
    next_payment_date: "2026-03-15",
    end_date: "2026-11-15",
    subscription_mode: "FAMILY",
    payment_type: "PAID",
    trial_months: 0,
    member_count: 6, // 6명 공유
    total_amount: 10900,
    status: "ACTIVE",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-02-15T10:00:00Z",
    category: "Music",
  },
];
