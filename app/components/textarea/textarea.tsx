"use client";

import * as React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

export default function TextArea({ 
  className, 
  maxLength = 2000, 
  value, 
  onChange, 
  ...props 
}: Props) {
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div className="relative w-full">
      <ShadcnTextarea
        className={cn(
          "min-h-[200px] w-full resize-none rounded-2xl bg-gray-100 p-4 pb-10 border-none text-[16px] placeholder:text-gray-300 focus-visible:ring-0",
          className
        )}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        {...props}
      />
      
      <div className="absolute bottom-4 right-4 text-[12px] text-gray-300">
        <span className={currentLength > 0 ? "text-gray-300" : ""}>{currentLength}</span>
        <span>/{maxLength}</span>
      </div>
    </div>
  );
}
