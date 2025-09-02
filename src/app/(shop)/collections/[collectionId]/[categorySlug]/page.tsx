import { getFilteredProductsByCollection } from "@/action/product";
import PageBreadcrumb from "@/components/layout/page-breadcrumb";
import CategoryProductsContent from "@/modules/category-products/ui/view/category-products-content";

interface Props {
  params: Promise<{ collectionId: string; categorySlug: string }>;
}

export default async function CategoryProductsPage({ params }: Props) {
  const resolvedParams = await params;

  const { collectionId, categorySlug } = resolvedParams;
  const initialData = await getFilteredProductsByCollection({
    collectionId,
    categorySlug: decodeURIComponent(categorySlug),
    categories: [],
    brands: [],
    sortBy: "newest",
    page: 1,
    limit: 5,
  });

  if (!initialData.collectionInfo) {
    return (
      <div className="mx-auto mt-16 max-w-7xl px-6 md:mt-32 md:px-0">
        <div className="text-center">
          <div className="text-md text-neutral-500">沒有相關商品資料</div>
        </div>
      </div>
    );
  }

  const { collectionInfo } = initialData;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        {collectionInfo && (
          <PageBreadcrumb
            grandparentPage={{
              name: "商品系列",
              href: `/collections`,
            }}
            parentPage={{
              name: collectionInfo.name,
              href: `/collections/${collectionInfo.id}/全部`,
            }}
          />
        )}
      </div>
      <CategoryProductsContent
        collectionId={collectionId}
        categorySlug={categorySlug}
        initialData={initialData}
      />
    </div>
  );
}
