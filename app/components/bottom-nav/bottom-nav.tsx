"use client";

import { cn } from "@/lib/utils";
import {
  faChartSimple,
  faCircleUser,
  faHouse,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: faHouse },
  { href: "/statistics", label: "통계", icon: faChartSimple },
  { href: "/community", label: "커뮤니티", icon: faUsers },
  { href: "/mypage", label: "내정보", icon: faCircleUser },
];

const BOTTOM_NAV_HEIGHT_CLASS = "h-[calc(60px+env(safe-area-inset-bottom))]";
const BOTTOM_NAV_SAFE_AREA_CLASS = "pb-[env(safe-area-inset-bottom)]";

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div aria-hidden="true" className={BOTTOM_NAV_HEIGHT_CLASS} />
      <nav
        className={cn(
          "fixed bottom-0 left-1/2 -translate-x-1/2 z-10 flex w-full items-center justify-around rounded-t-lg bg-white shadow-xl",
          "max-w-(--max-width) mx-auto",
          BOTTOM_NAV_HEIGHT_CLASS,
          BOTTOM_NAV_SAFE_AREA_CLASS
        )}
        aria-label="하단 네비게이션"
      >
        {NAV_ITEMS.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-around gap-1",
              isActive(href) ? "text-blue-400" : "text-gray-300"
            )}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <FontAwesomeIcon size="lg" icon={icon} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
