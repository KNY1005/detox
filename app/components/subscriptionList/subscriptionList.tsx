"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "../badge/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

type SubscriptionProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  name: string;

  trialLabel?: string; // 유료무료 유무
  price?: number;
  billingCycle: "월간결제" | "연간결제";
  badgeLabel: string;
  badgeVariant: "primary" | "danger";
};

export default function SubscriptionList({
  href,
  imageSrc = "/images/default.svg",
  imageAlt = "이미지 설명",
  name,
  price,
  billingCycle,
  badgeLabel,
  badgeVariant,
}: SubscriptionProps) {
  const isFreeTrial = price === 0;
  return (
    <div>
      <Link href={href} className="subscription-item">
        <div className="item-info">
          <div className="thumb">
            <Image src={imageSrc} alt={imageAlt} width={40} height={40} />
          </div>
          <div className="item-text">
            <div className="item-name">{name}</div>
            <div className="item-subtext">
              <span>
                {isFreeTrial
                  ? "무료체험"
                  : price !== undefined
                    ? `${price.toLocaleString()}원`
                    : ""}
              </span>
              <span>{billingCycle}</span>
            </div>
          </div>
        </div>
        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        <FontAwesomeIcon icon={faAngleRight} className="item-arrow-right" />
      </Link>
    </div>
  );
}
