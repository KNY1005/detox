"use client";

import { useParams, useRouter } from "next/navigation";
import FeedbackState from "@/app/components/feedback-state";
import Header from "@/app/components/header";
import CommunityForm from "../../_components/community-form";
import BrandTabs from "../../_components/brand-tabs";
import Button from "@/app/components/button";
import { useToast } from "@/app/hooks/useToast";
import type { CommunityDetailData, CommunityServiceValue } from "../../_types";
import { useCurrentUserQuery } from "@/query/users";
import {
  useCommunityDetailQuery,
  useUpdateCommunityPostMutation,
} from "@/query/community";
import { useState } from "react";
import CommunityAuthGuard from "../../_components/community-auth-guard";

type CommunityEditFormContentProps = {
  postId: string;
  currentUserId: string;
  initialPost: CommunityDetailData;
};

function CommunityEditFormContent({
  postId,
  currentUserId,
  initialPost,
}: CommunityEditFormContentProps) {
  const router = useRouter();
  const { error } = useToast();
  const updateCommunityPostMutation = useUpdateCommunityPostMutation();
  const [selectedService, setSelectedService] =
    useState<CommunityServiceValue>(initialPost.service);
  const [title, setTitle] = useState(initialPost.title);
  const [content, setContent] = useState(initialPost.content);

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid || updateCommunityPostMutation.isPending) {
      return;
    }

    try {
      await updateCommunityPostMutation.mutateAsync({
        postId,
        userId: currentUserId,
        service: selectedService,
        title: title.trim(),
        content: content.trim(),
      });

      router.push(`/community/${postId}`);
    } catch (updatePostError) {
      console.error(updatePostError);
      error("게시글 수정에 실패했어요.");
    }
  };

  return (
    <>
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
          disabled={!isFormValid || updateCommunityPostMutation.isPending}
          loading={updateCommunityPostMutation.isPending}
          onClick={handleSubmit}
        >
          수정 하기
        </Button>
      </div>
    </>
  );
}

function CommunityEditPageContent() {
  const { id } = useParams<{ id: string }>();
  const currentUserQuery = useCurrentUserQuery();
  const communityDetailQuery = useCommunityDetailQuery(id);

  if (communityDetailQuery.isPending || currentUserQuery.isPending) {
    return (
      <>
        <Header variant="back" title="게시글 수정하기" />
        <main className="px-6 py-8">
          <p className="body-md text-gray-400">게시글을 불러오는 중입니다.</p>
        </main>
      </>
    );
  }

  if (
    currentUserQuery.isError ||
    !currentUserQuery.data ||
    communityDetailQuery.isError ||
    !communityDetailQuery.data
  ) {
    return (
      <>
        <Header variant="back" title="게시글 수정하기" />
        <main className="px-6 py-8">
          <FeedbackState
            description="게시글을 불러오지 못했어요."
            imageSrc="/images/emoji/no-alarm.png"
            contentClassName="gap-0"
            descriptionClassName="body-md font-normal text-gray-400"
          />
        </main>
      </>
    );
  }

  if (communityDetailQuery.data.userId !== currentUserQuery.data.id) {
    return (
      <>
        <Header variant="back" title="게시글 수정하기" />
        <main className="px-6 py-8">
          <FeedbackState
            description="작성한 게시글만 수정할 수 있어요."
            imageSrc="/images/emoji/no-alarm.png"
            contentClassName="gap-0"
            descriptionClassName="body-md font-normal text-gray-400"
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Header variant="back" title="게시글 수정하기" />
      <CommunityEditFormContent
        key={id}
        postId={id}
        currentUserId={currentUserQuery.data.id}
        initialPost={communityDetailQuery.data}
      />
    </>
  );
}

export default function CommunityEditPage() {
  return (
    <CommunityAuthGuard>
      <CommunityEditPageContent />
    </CommunityAuthGuard>
  );
}
