import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: "구독 상세",
    description: "구독 상세 정보",
  };
}

export default function SubscriptionDetailLayout({ children }: Props) {
  return <>{children}</>;
}
