"use client";

import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Props {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Switch({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: Props) {
  return (
    <ShadcnSwitch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(className)} 
    />
  );
}
