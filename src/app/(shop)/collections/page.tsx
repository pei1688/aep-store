import { Suspense } from "react";
import CollectionContent from "@/modules/collection/ui/views/collection-content";
import PageBreadcrumb from "@/components/layout/page-breadcrumb";
import CollectionSkeleton from "@/modules/collection/ui/collection-skeleton";
export const revalidate = 1800;
const CollectionsPage = () => {
  return (
    <div className="px-4 ">
      <div className="flex flex-col items-start gap-4">
        <PageBreadcrumb currentPageName="商品系列" />
        <div className="text-2xl font-semibold">商品系列</div>
      </div>
      <Suspense fallback={<CollectionSkeleton />}>
        <CollectionContent />
      </Suspense>
    </div>
  );
};

export default CollectionsPage;
