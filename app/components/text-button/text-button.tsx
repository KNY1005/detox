import { cn } from "@/lib/utils";

type TextButtonSize = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: TextButtonSize;
  children: React.ReactNode;
  underline?: boolean;
};

export default function TextButton({
  size = "md",
  children,
  underline = false,
  className,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        `text-button-${size}`,
        underline ? "underline" : "",
        className ?? ""
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
