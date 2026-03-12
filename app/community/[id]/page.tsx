import CommunityDetailContent from "../_components/community-detail-content";
import CommunityAuthGuard from "../_components/community-auth-guard";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  const { id } = await params;

  return (
    <CommunityAuthGuard>
      <CommunityDetailContent postId={id} />
    </CommunityAuthGuard>
  );
}
