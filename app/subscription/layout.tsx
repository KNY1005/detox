import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "구독",
  description: "구독 관리",
};

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
