"use client";

import Link from "next/link";
import Badge from "../badge/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import BrandBox from "../brand-box";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import { BillingCycle } from "../subscription-form/types/type";
import formatBillingCycle from "@/app/utils/subscriptions/formatBillingCycle";

interface Badge {
  label: string;
  variant: "primary" | "danger";
}

interface Props {
  href?: string;
  brandType: SubscriptableBrandType;
  price: number;
  billingCycle: BillingCycle;
  badge?: Badge;
  group?: boolean;
  groupCount?: number;
  isFreeTrial?: boolean;
}
export default function SubscriptionList({
  href,
  brandType,
  price,
  billingCycle,
  badge,
  group = false,
  groupCount,
  isFreeTrial = false,
}: Props) {
  return (
    <Link
      href={href ?? ""}
      className="w-full grid grid-cols-[1fr_auto_auto] items-center gap-4 py-4 bg-white"
    >
      <div className="flex items-start gap-3">
        <BrandBox brandType={brandType} size="sm" />
        <div>
          <div className="text-base text-black font-bold leading-[150%] flex gap-2 items-center">
            {subscriptableBrand[brandType].label}

            {group && (
              <span className="text-brand-primary text-sm flex gap-1 items-center font-bold">
                <FontAwesomeIcon icon={faUserGroup} size="sm" />
                {groupCount}인
              </span>
            )}
          </div>
          <div className="item-subtext">
            <span>
              {isFreeTrial ? "무료체험" : `${price.toLocaleString()}원`}
            </span>
            <span>{formatBillingCycle(billingCycle)}</span>
          </div>
        </div>
      </div>
      {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      <FontAwesomeIcon icon={faAngleRight} className="w-5 h-5 text-gray-300" />
    </Link>
  );
}
