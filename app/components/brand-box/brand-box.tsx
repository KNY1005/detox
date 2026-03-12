import { subscriptableBrand } from "@/app/utils/brand/brand";
import { SubscriptableBrandType } from "@/app/utils/brand/type";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Size = "sm" | "lg";

interface Props {
  brandType: SubscriptableBrandType;
  size: Size;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: "w-12 h-12 rounded-xl",
  lg: "w-20 h-20 rounded-[20px]",
};

const imageSizeMap = {
  sm: 40,
  lg: 66,
};

export default function BrandBox({
  brandType,
  size,
  className,
  onClick,
  isActive,
}: Props) {
  const content = (
    <Image
      src={subscriptableBrand[brandType].image}
      alt={subscriptableBrand[brandType].label}
      width={imageSizeMap[size]}
      height={imageSizeMap[size]}
      className="mix-blend-multiply"
    />
  );

  const baseClasses = cn(
    "flex items-center justify-center border border-gray-100 bg-white",
    onClick && "cursor-pointer",
    isActive && "bg-blue-50 border-blue-300",
    sizeMap[size],
    className
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(
          baseClasses,
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        )}
        onClick={onClick}
        aria-pressed={isActive}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
