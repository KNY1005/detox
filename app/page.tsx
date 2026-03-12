"use client";

import Header from "./components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import Link from "next/link";
import Image from "next/image";
import SubscriptionList from "./components/subscription-list";
import Button from "./components/button";
import BottomNav from "./components/bottom-nav";
import { subscriptableBrand } from "./utils/brand/brand";
import type { SubscriptableBrandType } from "./utils/brand/type";

interface SubscriptionItem {
  id: number;
  href: string;
  brandType: SubscriptableBrandType;
  name: string;
  price?: number;
  billingCycle: "월간결제" | "연간결제";
  badgeLabel: string;
  badgeVariant: "primary" | "danger";
  group?: boolean;
  groupCount?: number;
}

export default function Home() {
  // 실제 데이터와 무관하게 홈 상단/빈 상태 UI만 분기하고, 목록은 목업 데이터를 유지합니다.
  const showSubscribedUiState = true;
  const subsList: Omit<SubscriptionItem, "name">[] = [
    //더미 데이터
    {
      id: 1,
      href: "/",
      brandType: "netflix",
      price: 0,
      billingCycle: "월간결제",
      badgeLabel: "내일결제",
      badgeVariant: "danger",
    },
    {
      id: 2,
      href: "/",
      brandType: "wavve",
      price: 7900,
      billingCycle: "연간결제",
      badgeLabel: "내일결제",
      badgeVariant: "danger",
    },
    {
      id: 3,
      href: "/",
      brandType: "youtube-premium",
      price: 6900,
      billingCycle: "월간결제",
      badgeLabel: "D-14",
      badgeVariant: "primary",
    },
    {
      id: 4,
      href: "/",
      brandType: "spotify",
      price: 10900,
      billingCycle: "월간결제",
      badgeLabel: "D-24",
      badgeVariant: "primary",
      group: true,
      groupCount: 4,
    },
  ];

  const subscriptionList: SubscriptionItem[] = subsList.map((item) => ({
    ...item,
    name: subscriptableBrand[item.brandType].label,
  }));
  const subscriptionCount = subscriptionList.length;
  const totalPrice = subscriptionList.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0
  );

  return (
    <>
      <Header rightContent="알람아이콘" />
      <main>
        <section className="px-6 py-5 mb-4 bg-white grid grid-cols-[1fr_100px] items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="title">
              {showSubscribedUiState ? (
                <>
                  <h2 className="text-2xl">이번달 구독료로</h2>
                  <h1 className="header-md">
                    스타벅스{" "}
                    <span className="text-brand-primary">커피 8잔</span>
                  </h1>
                </>
              ) : (
                <>
                  <h2 className="text-2xl">숨겨진 낭비를 줄이면</h2>
                  <h1 className="header-md">
                    연간 최대 <span className="text-brand-primary">???원</span>
                  </h1>
                </>
              )}
            </div>

            <Link
              href="/통계메인"
              className="body-lg text-gray-300 inline-flex items-center gap-1 mt-2"
            >
              자세히 알아보기
              <FontAwesomeIcon icon={faAngleRight} size="xs" />
            </Link>
          </div>
          <div>
            {showSubscribedUiState ? (
              <Image
                src="/images/emoji/main-coffee.png"
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <Image
                src="/images/emoji/main-nodata.png"
                alt=""
                width={100}
                height={100}
              />
            )}
          </div>
        </section>
        <section className="pt-10 bg-white border-t-gray-100 border-t-16">
          <div className="relative flex flex-col justify-center items-start gap-4 ">
            <div className="px-6 w-full flex justify-between items-center">
              <h6 className="title-md text-black">
                나의 구독{" "}
                <span className="text-brand-primary">
                  총 {subscriptionCount}개
                </span>
              </h6>
              <h6 className="header-md">{totalPrice.toLocaleString()}원</h6>
            </div>
            <ul className="px-6 w-full">
              {subscriptionList.map((item) => (
                <li key={item.id}>
                  <SubscriptionList
                    href={item.href}
                    brandType={item.brandType}
                    name={item.name}
                    price={item.price}
                    billingCycle={item.billingCycle}
                    badgeLabel={item.badgeLabel}
                    badgeVariant={item.badgeVariant}
                    group={item.group}
                    groupCount={item.groupCount}
                  />
                </li>
              ))}
            </ul>
            {!showSubscribedUiState && (
              <div className="absolute w-full h-full flex flex-col items-center justify-center gap-4 text-center bg-linear-to-bl from-white/50 to-white backdrop-blur-[1.5px]">
                <h6 className="title-md text-black">
                  구독 서비스를 추가 하세요
                </h6>
                <p className="body-md text-gray-300">
                  내가 사용하는 구독을 추가하고
                  <br />
                  소비를 절약해보세요
                </p>
              </div>
            )}
          </div>
          <div className="mx-6 btn-wrap">
            <Button variant="primary" size="lg">
              구독 추가하기
            </Button>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
