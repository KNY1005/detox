"use client";

import Button from "@/app/components/button";
import FeedbackState from "@/app/components/feedback-state";

type FeedbackPageProps = {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
  buttonLoading?: boolean;
  buttonSize?: "md" | "lg";
  imageSrc?: string;
  imageAlt?: string;
};

export default function FeedbackPage({
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonLoading = false,
  buttonSize = "md",
  imageSrc = "/images/emoji/error.png",
  imageAlt = "",
}: FeedbackPageProps) {
  return (
    <main className="mx-auto flex min-h-screen flex-col items-center justify-center px-6">
      <FeedbackState
        title={title}
        description={description}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        bottomCTA
      >
        <Button
          variant="primary"
          size={buttonSize}
          className="w-full"
          loading={buttonLoading}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      </FeedbackState>
    </main>
  );
}
