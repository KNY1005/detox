"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useHasUnreadNotificationsQuery } from "@/query/notification";
import { useSupabase } from "@/hooks/useSupabase";
import Link from "next/link";

type HeaderVariant = "default" | "back" | "text";

interface Props {
  title?: string;
  variant?: HeaderVariant;
  leftText?: string;
  rightContent?: React.ReactNode;
  onBack?: () => void;
  fallbackPath?: string;
  hasNotification?: boolean;
}

export default function Header({
  title = "",
  variant = "default",
  leftText,
  rightContent,
  onBack,
  fallbackPath,
  hasNotification = false,
}: Props) {
  const router = useRouter();
  const { session } = useSupabase();
  const { data: hasUnreadNotifications } = useHasUnreadNotificationsQuery(
    session?.user?.id ?? ""
  );

  return (
    <header className="w-full">
      <div className="flex items-center justify-between h-14">
        <div className="flex flex-1 justify-start ml-6 items-center">
          {variant === "back" && (
            <button
              type="button"
              aria-label="뒤로 이동"
              onClick={() => {
                if (onBack) {
                  onBack();
                  return;
                }

                if (fallbackPath && window.history.length <= 1) {
                  router.push(fallbackPath);
                  return;
                }

                router.back();
              }}
              className="cursor-pointer flex items-center justify-center w-10 h-10 -ml-2"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="w-7 h-7 text-gray-400"
              />
            </button>
          )}
          {variant === "default" && (
            <button
              type="button"
              aria-label="홈으로 이동"
              className="cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Image
                src="/images/logo.png"
                alt="logo"
                width={80}
                height={40}
                className="object-contain"
              />
            </button>
          )}
          {variant === "text" && (
            <span className="header-md text-gray-400">{leftText}</span>
          )}
        </div>

        <div className="flex flex-1 justify-center items-center">
          <h1 className="title-lg text-gray-400 truncate ">{title}</h1>
        </div>

        <div className="flex flex-1 justify-end mr-6 items-center">
          {!hasNotification && <div className="">{rightContent}</div>}
          {hasNotification && (
            <Link href="/notifications" aria-label="알림 페이지로 이동">
              <button
                type="button"
                aria-label="알림"
                className="relative cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="w-7 h-7 text-gray-300"
                />
                {hasUnreadNotifications && (
                  <span className="absolute top-0 right-[-5px] w-[6px] h-[6px] bg-brand-primary rounded-full" />
                )}
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
