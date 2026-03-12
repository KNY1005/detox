import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "danger";

const variantClass: Record<BadgeVariant, string> = {
  primary: "bg-blue-50 text-blue-400",
  danger: "bg-red-50 text-red-400",
};

export default function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[25px] items-center justify-center rounded-lg px-2 py-1 text-xs leading-none font-bold",
        variantClass[variant]
      )}
    >
      {children}
    </span>
  );
}
