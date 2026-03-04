import Image from "next/image";
import DefaultUserImage from "@/public/images/default-user.png";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  size?: AvatarSize;
  src?: string;
  alt?: string;
}

const avatarSize = {
  sm: 24,
  md: 30,
  lg: 56,
  xl: 100,
};

export default function Avatar({ size = "md", src, alt }: AvatarProps) {
  return (
    <div
      className={`w-${avatarSize[size]} h-${avatarSize[size]} rounded-full bg-gray-100`}
    >
      <Image
        className="w-full h-full object-cover rounded-full"
        src={src || DefaultUserImage}
        onError={(e) => {
          (e.target as HTMLImageElement).src = DefaultUserImage.src;
        }}
        alt={alt || ""}
        width={avatarSize[size]}
        height={avatarSize[size]}
      />
    </div>
  );
}
