import Image from "next/image";
import BottomCTA from "@/app/components/bottom-cta";
import { cn } from "@/lib/utils";

type FeedbackStateProps = {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  bottomCTA?: boolean;
  ctaClassName?: string;
  hasBottomNav?: boolean;
};

export default function FeedbackState({
  title,
  description,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
  children,
  imageSrc,
  imageAlt = "",
  imageWidth = 80,
  imageHeight = 80,
  bottomCTA = false,
  ctaClassName,
  hasBottomNav = false,
}: FeedbackStateProps) {
  return (
    <>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-5 text-center",
          className
        )}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
          />
        ) : null}

        {title || description ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-2",
              contentClassName
            )}
          >
            {title ? (
              <h1 className={cn("header-md", titleClassName)}>{title}</h1>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "title-md font-medium text-gray-300",
                  descriptionClassName
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        {!bottomCTA ? children : null}
      </div>

      {bottomCTA && children ? (
        <BottomCTA className={ctaClassName} hasBottomNav={hasBottomNav}>
          {children}
        </BottomCTA>
      ) : null}
    </>
  );
}
