"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import CommunityForm from "../_components/community-form";
import BrandTabs from "../_components/brand-tabs";
import Button from "@/app/components/button";
import { useToast } from "@/app/hooks/useToast";
import type { CommunityServiceValue } from "../_types";
import { useCurrentUserQuery } from "@/query/users";
import { useCreateCommunityPostMutation } from "@/query/community";
import CommunityAuthGuard from "../_components/community-auth-guard";

function CommunityNewPageContent() {
  const router = useRouter();
  const { error } = useToast();

  const [selectedService, setSelectedService] =
    useState<CommunityServiceValue>("netflix");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const currentUserQuery = useCurrentUserQuery();
  const createCommunityPostMutation = useCreateCommunityPostMutation();

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async () => {
    if (
      !currentUserQuery.data?.id ||
      !isFormValid ||
      createCommunityPostMutation.isPending
    ) {
      return;
    }

    try {
      const createdPost = await createCommunityPostMutation.mutateAsync({
        userId: currentUserQuery.data.id,
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
          disabled={
            !isFormValid ||
            !currentUserQuery.data?.id ||
            createCommunityPostMutation.isPending
          }
          loading={createCommunityPostMutation.isPending}
          onClick={handleSubmit}
        >
          작성 하기
        </Button>
      </div>
    </>
  );
}

export default function CommunityNewPage() {
  return (
    <CommunityAuthGuard>
      <CommunityNewPageContent />
    </CommunityAuthGuard>
  );
}
