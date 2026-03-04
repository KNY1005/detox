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
  return (
    <div
      className={cn(
        `flex items-center justify-center border border-gray-100 bg-white`,
        onClick && `cursor-pointer`,
        onClick && isActive && `bg-blue-50 border-blue-300`,
        sizeMap[size],
        className
      )}
      onClick={onClick}
    >
      <Image
        src={subscriptableBrand[brandType].image}
        alt={subscriptableBrand[brandType].label}
        width={imageSizeMap[size]}
        height={imageSizeMap[size]}
      />
    </div>
  );
}
