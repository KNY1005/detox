"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FeedbackPage from "@/app/components/feedback-page";
import Header from "@/app/components/header";
import LoadingScreen from "@/app/components/loading-screen";
import CommunityForm from "../_components/community-form";
import BrandTabs from "../_components/brand-tabs";
import Button from "@/app/components/button";
import { useLoginRedirect } from "@/app/hooks/use-login-redirect";
import { useToast } from "@/app/hooks/useToast";
import type { CommunityServiceValue } from "../_types";
import { useCurrentUserQuery } from "@/query/users";
import { useCreateCommunityPostMutation } from "@/query/community";

function CommunityNewPageContent() {
  const router = useRouter();
  const { error } = useToast();
  const { moveToLogin } = useLoginRedirect("/community/new");

  const [selectedService, setSelectedService] =
    useState<CommunityServiceValue>("netflix");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const {
    data: currentUser,
    isPending: isCurrentUserPending,
    isError: isCurrentUserError,
  } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const { mutateAsync: createCommunityPost, isPending: isCreatePending } =
    useCreateCommunityPostMutation();

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  useEffect(() => {
    if (!isCurrentUserPending && !isCurrentUserError && !currentUserId) {
      moveToLogin();
    }
  }, [currentUserId, isCurrentUserError, isCurrentUserPending, moveToLogin]);

  if (isCurrentUserPending || (!isCurrentUserError && !currentUserId)) {
    return <LoadingScreen message="잠시만 기다려 주세요." />;
  }

  if (isCurrentUserError) {
    return (
      <FeedbackPage
        title="로그인 정보를 확인하지 못했어요."
        description="잠시 후 다시 시도해주세요."
        buttonLabel="커뮤니티로 가기"
        buttonHref="/community"
      />
    );
  }

  const handleSubmit = async () => {
    if (!currentUserId || !isFormValid || isCreatePending) {
      return;
    }

    try {
      const createdPost = await createCommunityPost({
        userId: currentUserId,
        service: selectedService,
        title: title.trim(),
        content: content.trim(),
      });

      router.push(`/community/${createdPost.id}`);
    } catch (createPostError) {
      console.error(createPostError);
      error("게시글 작성에 실패했어요.");
    }
  };

  return (
    <>
      <Header variant="back" title="게시글 작성하기" />

      <BrandTabs
        value={selectedService}
        onChange={setSelectedService}
        includeAll={false}
      />

      <main className="px-6">
        <CommunityForm
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
        />
      </main>

      <div className="btn-wrap px-5 py-6">
        <Button
          variant="primary"
          size="lg"
          disabled={!isFormValid || !currentUserId}
          loading={isCreatePending}
          onClick={handleSubmit}
        >
          작성 하기
        </Button>
      </div>
    </>
  );
}

export default function CommunityNewPage() {
  return <CommunityNewPageContent />;
}
