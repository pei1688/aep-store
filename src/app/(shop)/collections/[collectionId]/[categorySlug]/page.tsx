import { getFilteredProductsByCollection } from "@/action/product";
import PageBreadcrumb from "@/components/layout/page-breadcrumb";
import { prisma } from "@/lib/prisma";
import ProductSkeleton from "@/modules/category-products/ui/product-skeleton";
import CategoryProductsContent from "@/modules/category-products/ui/view/category-products-content";
import { Suspense } from "react";
// ISR：每 5 分鐘重新生成一次
export const revalidate = 300;

export async function generateStaticParams() {
  // 1. 取前幾個熱門 collection
  const collections = await prisma.collection.findMany({
    select: { id: true },
    take: 10, // 只取前 10 個避免爆炸
  });

  // 2. 每個 collection 的熱門 category
  const categories = await prisma.category.findMany({
    select: { name: true },
    take: 5,
  });

  // 3. 組合靜態參數
  const params = [];
  for (const c of collections) {
    // 預設 "全部"
    params.push({
      collectionId: c.id,
      categorySlug: "全部",
    });

    for (const cat of categories) {
      params.push({
        collectionId: c.id,
        categorySlug: cat.name,
      });
    }
  }

  return params;
}

interface Props {
  params: Promise<{ collectionId: string; categorySlug: string }>;
}

export default async function CategoryProductsPage({ params }: Props) {
  const { collectionId, categorySlug } = await params;

  const initialData = await getFilteredProductsByCollection({
    collectionId,
    categorySlug: decodeURIComponent(categorySlug),
  });

  if (!initialData.collectionInfo) {
    return (
      <div className="mx-auto mt-16 max-w-7xl px-6 md:my-32 md:px-0">
        <div className="text-center">
          <div className="text-md text-neutral-500">沒有相關商品資料</div>
        </div>
      </div>
    );
  }

  const { collectionInfo } = initialData;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 min-h-screen">
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
      <Suspense fallback={<ProductSkeleton />}>
        <CategoryProductsContent
          collectionId={collectionId}
          categorySlug={categorySlug}
        />
      </Suspense>
    </div>
  );
}
