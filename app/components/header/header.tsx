"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type HeaderVariant = "default" | "back" | "text";

interface Props {
  title?: string;
  variant?: HeaderVariant;
  leftText?: string;
  rightContent?: React.ReactNode;
  onBack?: () => void;
}

export default function Header({
  title = "",
  variant = "default",
  leftText,
  rightContent,
  onBack,
}: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-[999] w-full bg-white">
        <div className="flex items-center justify-between h-14">
          <div className="flex flex-1 justify-start ml-6 items-center">
            {variant === "back" && (
              <button 
                type="button" 
                onClick={() => (onBack ? onBack() : router.back())} 
                className="cursor-pointer flex items-center justify-center w-10 h-10 -ml-2"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-7 h-7 text-gray-400" />
              </button>
            )}
            {variant === "default" && (
              <div className="cursor-pointer" onClick={() => router.push("/")}>
                <Image src="/images/logo.png" alt="logo" width={80} height={40} className="object-contain" />
              </div>
            )}
            {variant === "text" && (
              <span className="header-md text-gray-400">
                {leftText}
              </span>
            )}
          </div>

          <div className="flex flex-1 justify-center items-center">
            <h1 className="title-lg text-gray-400 truncate ">
              {title}
            </h1>
          </div>

          <div className="flex flex-1 justify-end mr-6 items-center">
            <div className="header-lg   ">
              {rightContent}
            </div>
          </div>
        </div>
    </header>
  );
}
