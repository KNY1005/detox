import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import { createCommunityListInfiniteQueryOptions } from "@/query/community-options";
import { getServerCommunityListPage } from "@/services/community.server";
import type { CommunityServiceFilter } from "./_types";
import CommunityListPageClient from "./_components/community-list-page-client";

type CommunityListPageProps = {
  searchParams: Promise<{ service?: string }>;
};

export default async function CommunityListPage({
  searchParams,
}: CommunityListPageProps) {
  const { service } = await searchParams;

  const selectedService: CommunityServiceFilter =
    service && Object.prototype.hasOwnProperty.call(subscriptableBrand, service)
      ? (service as CommunityServiceFilter)
      : "all";

  const queryService = selectedService === "all" ? undefined : selectedService;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery(
    createCommunityListInfiniteQueryOptions({
      service: queryService,
      fetchPage: getServerCommunityListPage,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityListPageClient
        key={selectedService}
        initialService={selectedService}
      />
    </HydrationBoundary>
  );
}
