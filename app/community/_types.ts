import type { SubscriptableBrandType } from "@/app/utils/brand/type";

export type CommunityServiceFilter = SubscriptableBrandType | "all";
export type CommunityServiceValue = SubscriptableBrandType;
export type CommunityListItemData = {
  id: string;
  service: SubscriptableBrandType;
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  thumbUrl: string;
};
export type CommunityDetailData = CommunityListItemData & {
  userId: string;
  createdAt: string;
};

export type CommunityCommentItemData = {
  id: string;
  postId: string;
  userId: string;
  author: string;
  timeAgo: string;
  content: string;
  thumbUrl: string;
  createdAt: string;
};

export type CommunityListCursor = {
  createdAt: string;
  id: string;
};

export type CommunityListPage = {
  items: CommunityListItemData[];
  nextCursor: CommunityListCursor | null;
};
