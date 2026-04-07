import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";
import { supabase } from "@/lib/supabase";
import type {
  CommunityCommentItemData,
  CommunityDetailData,
  CommunityListItemData,
  CommunityListCursor,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import type { Tables } from "@/types/supabase.types";

type UserPreview = Pick<Tables<"users">, "id" | "nickname" | "profile_image">;

type PostWithCounts = Tables<"post"> & {
  active_comments: { count: number }[];
  likes: { count: number }[];
};

const USER_PREVIEW_SELECT = "id, nickname, profile_image";
const REPORT_DEFAULT_REASON = "other";
const DUPLICATE_KEY_ERROR_CODE = "23505";

type SupabaseErrorLike = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
};

const getSafeString = (value: unknown) =>
  typeof value === "string" ? value : "";

function isDuplicateReportError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const typedError = error as SupabaseErrorLike;
  const errorMessage = [
    getSafeString(typedError.message),
    getSafeString(typedError.details),
    getSafeString(typedError.hint),
  ]
    .join(" ")
    .toLowerCase();

  return (
    typedError.code === DUPLICATE_KEY_ERROR_CODE ||
    errorMessage.includes("duplicate key")
  );
}

async function ensurePostCanBeReported(postId: string, reporterUserId: string) {
  const { data, error } = await supabase
    .from("post")
    .select("id, user_id")
    .eq("id", postId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("이미 삭제되었거나 없는 게시글입니다.");
  }

  if (data.user_id === reporterUserId) {
    throw new Error("본인 게시글은 신고할 수 없어요.");
  }
}

async function ensureCommentCanBeReported(
  commentId: string,
  reporterUserId: string
) {
  const { data, error } = await supabase
    .from("comment")
    .select("id, user_id")
    .eq("id", commentId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("이미 삭제되었거나 없는 댓글입니다.");
  }

  if (data.user_id === reporterUserId) {
    throw new Error("본인 댓글은 신고할 수 없어요.");
  }
}

//게시글리스트
export async function getCommunityListPage(params: {
  service?: SubscriptableBrandType;
  cursor?: CommunityListCursor | null;
  pageSize?: number;
}): Promise<CommunityListPage> {
  const pageSize = params.pageSize ?? 10;

  let query = supabase
    .from("post")
    .select(
      `
    *,
    active_comments:comment(count),
    likes(count)
  `
    )
    .is("deleted_at", null)
    .is("hidden_at", null)
    .is("active_comments.hidden_at", null)
    .is("active_comments.deleted_at", null);

  if (params.service) {
    query = query.eq("service", params.service);
  }

  if (params.cursor) {
    query = query.or(
      `created_at.lt.${params.cursor.createdAt},and(created_at.eq.${params.cursor.createdAt},id.lt.${params.cursor.id})`
    );
  }

  const { data, error: postsError } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1);

  if (postsError) {
    throw postsError;
  }

  const posts = (data ?? []) as PostWithCounts[];

  if (posts.length === 0) {
    return {
      items: [],
      nextCursor: null,
    };
  }

  const hasNextPage = posts.length > pageSize;
  const visiblePosts = hasNextPage ? posts.slice(0, pageSize) : posts;
  const userIds = [...new Set(visiblePosts.map((post) => post.user_id))];
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(USER_PREVIEW_SELECT)
    .in("id", userIds)
    .is("deleted_at", null);

  if (usersError) throw usersError;

  const userMap = new Map<string, UserPreview>(
    (users ?? []).map((user) => [user.id, user])
  );

  const items = visiblePosts.map((post) => {
    const user = userMap.get(post.user_id);

    return {
      id: post.id,
      service: post.service as SubscriptableBrandType,
      author: user?.nickname ?? "알 수 없는 사용자",
      timeAgo: formatRelativeTime(post.created_at),
      title: post.title,
      content: post.content,
      likeCount: post.likes?.[0]?.count ?? 0,
      commentCount: post.active_comments?.[0]?.count ?? 0,
      thumbUrl: user?.profile_image ?? "/images/default-user.png",
    };
  });

  const lastPost = visiblePosts[visiblePosts.length - 1];

  return {
    items,
    nextCursor:
      hasNextPage && lastPost
        ? {
            createdAt: lastPost.created_at,
            id: lastPost.id,
          }
        : null,
  };
}

//게시글상세
export async function getCommunityDetail(
  postId: string
): Promise<CommunityDetailData | null> {
  const { data: post, error: postError } = await supabase
    .from("post")
    .select("*")
    .eq("id", postId)
    .is("deleted_at", null)
    .is("hidden_at", null)
    .maybeSingle();

  if (postError) {
    throw postError;
  }

  if (!post) {
    return null;
  }

  const [
    { data: user, error: userError },
    { count: commentCount, error: commentsError },
    { count: likeCount, error: likesError },
  ] = await Promise.all([
    supabase
      .from("users")
      .select(USER_PREVIEW_SELECT)
      .eq("id", post.user_id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("comment")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post.id)
      .is("hidden_at", null)
      .is("deleted_at", null),
    supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post.id),
  ]);

  if (userError) throw userError;
  if (commentsError) throw commentsError;
  if (likesError) throw likesError;

  return {
    id: post.id,
    userId: post.user_id,
    service: post.service as SubscriptableBrandType,
    author: user?.nickname ?? "알 수 없는 사용자",
    timeAgo: formatRelativeTime(post.created_at),
    title: post.title,
    content: post.content,
    likeCount: likeCount ?? 0,
    commentCount: commentCount ?? 0,
    thumbUrl: user?.profile_image ?? "/images/default-user.png",
    createdAt: post.created_at,
  };
}

//추천게시글리스트
export async function getRecommendedCommunityPosts(params: {
  postId: string;
  service: SubscriptableBrandType;
  limit?: number;
}): Promise<CommunityListItemData[]> {
  const limit = params.limit ?? 3;
  const sameServicePage = await getCommunityListPage({
    service: params.service,
    pageSize: Math.max(limit + 1, 4),
  });

  const recommendedPosts = sameServicePage.items.filter(
    (item) => item.id !== params.postId
  );

  if (recommendedPosts.length >= limit) {
    return recommendedPosts.slice(0, limit);
  }

  const fallbackPage = await getCommunityListPage({
    pageSize: Math.max(limit * 3, 10),
  });

  const existingIds = new Set(recommendedPosts.map((item) => item.id));
  const mergedPosts = [
    ...recommendedPosts,
    ...fallbackPage.items.filter((item) => {
      if (item.id === params.postId || existingIds.has(item.id)) {
        return false;
      }

      existingIds.add(item.id);
      return true;
    }),
  ];

  return mergedPosts.slice(0, limit);
}

//게시글작성
export async function createCommunityPost(params: {
  userId: string;
  service: SubscriptableBrandType;
  title: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      user_id: params.userId,
      service: params.service,
      title: params.title,
      content: params.content,
    })
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("게시글 작성에 실패했어요.");

  return data;
}
//게시글수정
export async function updateCommunityPost(params: {
  postId: string;
  userId: string;
  service: SubscriptableBrandType;
  title: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from("post")
    .update({
      service: params.service,
      title: params.title,
      content: params.content,
    })
    .eq("id", params.postId)
    .eq("user_id", params.userId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("수정할 게시글이 없거나 권한이 없습니다.");
  }

  return data;
}

//게시글삭제
export async function deleteCommunityPost(params: {
  postId: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("post")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", params.postId)
    .eq("user_id", params.userId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("삭제할 게시글이 없거나 권한이 없습니다.");
  }

  return data;
}

//게시글신고
export async function reportCommunityPost(params: {
  postId: string;
  reporterUserId: string;
}) {
  await ensurePostCanBeReported(params.postId, params.reporterUserId);

  const { data, error } = await supabase
    .from("report")
    .insert({
      detail: null,
      post_id: params.postId,
      reason: REPORT_DEFAULT_REASON,
      reporter_user_id: params.reporterUserId,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    if (isDuplicateReportError(error)) {
      throw new Error("이미 신고한 게시글입니다.");
    }

    throw error;
  }
  if (!data) {
    throw new Error("게시글 신고에 실패했어요.");
  }

  return data;
}

//댓글리스트
export async function getCommunityComments(
  postId: string
): Promise<CommunityCommentItemData[]> {
  const { data: comments, error: commentsError } = await supabase
    .from("comment")
    .select("*")
    .eq("post_id", postId)
    .is("deleted_at", null)
    .is("hidden_at", null)
    .order("created_at", { ascending: true });

  if (commentsError) {
    throw commentsError;
  }

  if (!comments || comments.length === 0) {
    return [];
  }

  const userIds = [...new Set(comments.map((comment) => comment.user_id))];
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(USER_PREVIEW_SELECT)
    .in("id", userIds)
    .is("deleted_at", null);

  if (usersError) {
    throw usersError;
  }

  const userMap = new Map<string, UserPreview>(
    (users ?? []).map((user) => [user.id, user])
  );

  return comments.map((comment) => {
    const user = userMap.get(comment.user_id);

    return {
      id: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      author: user?.nickname ?? "알 수 없는 사용자",
      timeAgo: formatRelativeTime(comment.created_at),
      content: comment.content,
      thumbUrl: user?.profile_image ?? "/images/default-user.png",
      createdAt: comment.created_at,
    };
  });
}

//댓글작성
export async function createCommunityComment(params: {
  postId: string;
  userId: string;
  content: string;
}) {
  const { error } = await supabase.from("comment").insert({
    post_id: params.postId,
    user_id: params.userId,
    content: params.content,
  });

  if (error) throw error;
}

//댓글삭제
export async function deleteCommunityComment(params: {
  commentId: string;
  postId: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("comment")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", params.commentId)
    .eq("post_id", params.postId)
    .eq("user_id", params.userId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("삭제할 댓글이 없거나 권한이 없습니다.");
  }

  return data;
}
//댓글신고
export async function reportCommunityComment(params: {
  commentId: string;
  postId?: string;
  reporterUserId: string;
}) {
  await ensureCommentCanBeReported(params.commentId, params.reporterUserId);

  const { data, error } = await supabase
    .from("report")
    .insert({
      comment_id: params.commentId,
      detail: null,
      reason: REPORT_DEFAULT_REASON,
      reporter_user_id: params.reporterUserId,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    if (isDuplicateReportError(error)) {
      throw new Error("이미 신고한 댓글입니다.");
    }

    throw error;
  }
  if (!data) {
    throw new Error("댓글 신고에 실패했어요.");
  }

  return data;
}

//좋아요상태
export async function getCommunityPostLikeStatus(params: {
  postId: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", params.postId)
    .eq("user_id", params.userId)
    .limit(1);

  if (error) {
    throw error;
  }

  return (data?.length ?? 0) > 0;
}

//좋아요토글
export async function toggleCommunityPostLike(params: {
  postId: string;
  userId: string;
}) {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    p_post_id: params.postId,
    p_user_id: params.userId,
  });

  if (error) {
    throw error;
  }

  if (typeof data !== "boolean") {
    throw new Error("좋아요 처리에 실패했어요.");
  }

  return { liked: data };
}
