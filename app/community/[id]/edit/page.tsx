"use client";

import { useParams } from "next/navigation";
import FeedbackState from "@/app/components/feedback-state";
import Header from "@/app/components/header";
import LoadingScreen from "@/app/components/loading-screen";
import { useCurrentUserQuery } from "@/query/users";
import { useCommunityDetailQuery } from "@/query/community";
import CommunityEditFormContent from "./_components/community-edit-form-content";

function CommunityEditPageContent() {
  const { id } = useParams<{ id: string }>();
  const currentUserQuery = useCurrentUserQuery();
  const communityDetailQuery = useCommunityDetailQuery(id);

  if (communityDetailQuery.isPending || currentUserQuery.isPending) {
    return <LoadingScreen message="게시글을 불러오는 중이에요." />;
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
  return <CommunityEditPageContent />;
}
