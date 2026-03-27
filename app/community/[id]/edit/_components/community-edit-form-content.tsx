"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import { useToast } from "@/app/hooks/useToast";
import BrandTabs from "@/app/community/_components/brand-tabs";
import CommunityForm from "@/app/community/_components/community-form";
import type {
  CommunityDetailData,
  CommunityServiceValue,
} from "@/app/community/_types";
import { useUpdateCommunityPostMutation } from "@/query/community";

interface CommunityEditFormContentProps {
  postId: string;
  currentUserId: string;
  initialPost: CommunityDetailData;
}

export default function CommunityEditFormContent({
  postId,
  currentUserId,
  initialPost,
}: CommunityEditFormContentProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const { mutateAsync: updateCommunityPost, isPending: isUpdatePending } =
    useUpdateCommunityPostMutation();

  const [selectedService, setSelectedService] = useState<CommunityServiceValue>(
    initialPost.service
  );
  const [title, setTitle] = useState(initialPost.title);
  const [content, setContent] = useState(initialPost.content);

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async () => {
    try {
      await updateCommunityPost({
        postId,
        userId: currentUserId,
        service: selectedService,
        title: title.trim(),
        content: content.trim(),
      });

      success("게시글을 수정했어요.");
      router.back();
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

      <main className="px-6 mt-10">
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
          disabled={!isFormValid}
          loading={isUpdatePending}
          onClick={handleSubmit}
        >
          수정 하기
        </Button>
      </div>
    </>
  );
}
