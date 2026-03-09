import { SubscriptableBrandType } from "../brand/type";

// 결제 예정, 체험 종료 임박, 커뮤니티
export type NotificationType =
  | "payment-pending"
  | "trial-ending-soon"
  | "community";

// 결제예정 payload
export interface PaymentPendingPayload {
  brand: SubscriptableBrandType;
}

// 체험 종료 임박 payload
export interface TrialEndingSoonPayload {
  brand: SubscriptableBrandType;
}

// 커뮤니티 payload
export interface CommunityPayload {
  communityType: "like" | "comment";
}

// type에 따른 payload discriminated union
export type NotificationItemProps =
  | {
      type: "payment-pending";
      payload: PaymentPendingPayload;
    }
  | {
      type: "trial-ending-soon";
      payload: TrialEndingSoonPayload;
    }
  | {
      type: "community";
      payload: CommunityPayload;
    };

// 알림 목록 아이템 (id 포함)
export type NotificationDataItem = NotificationItemProps & {
  id: number;
  description: string;
  createdAt: string;
  isRead?: boolean;
};
