"use client";
import { Suspense, lazy, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Spinner from "@/components/spinner";
import PageBreadcrumb from "@/components/layout/page-breadcrumb";
import { useFilteredProductsByCollection } from "@/services/products";
import { ProductWithCategory } from "@/types/product/product";

// 動態載入組件 - 只有在需要時才載入
const CategoryProducts = lazy(
  () => import("../../components/category-products"),
);
const FilterSidebarOptimized = lazy(
  () => import("../../components/filter-sidebar-optimized"),
);
const MobileFilterSidebarOptimized = lazy(
  () => import("../../components/mobile-filter-sidebar-optimized"),
);
const SortSelector = lazy(() => import("../../components/sort-selector"));
const PaginationControls = lazy(
  () => import("@/components/pagination-controls"),
);

const FilterSidebarSkeleton = () => (
  <div className="w-64 space-y-4">
    <div className="h-6 animate-pulse rounded bg-gray-200"></div>
    <div className="space-y-2">
      <div className="h-4 animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="aspect-square animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
      </div>
    ))}
  </div>
);

const SortSelectorSkeleton = () => (
  <div className="h-10 w-40 animate-pulse rounded bg-gray-200"></div>
);

const PaginationSkeleton = () => (
  <div className="mt-8 flex justify-center space-x-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="h-10 w-10 animate-pulse rounded bg-gray-200"
      ></div>
    ))}
  </div>
);

interface CategoryPageContentLazyProps {
  collectionId: string;
  categorySlug?: string;
}

export default function CategoryPageContent({
  collectionId,
  categorySlug,
}: CategoryPageContentLazyProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 避免重複解析 URL 參數
  const filterParams = useMemo(() => {
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);

    return {
      categories,
      brands,
      sortBy,
      page,
      limit: 4,
    };
  }, [searchParams]);

  // 使用後端過濾的 hook
  const {
    products,
    totalCount,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    availableFilters,
    collectionInfo,
    isError,
    isPending,
    error,
  } = useFilteredProductsByCollection({
    collectionId,
    categorySlug,
    ...filterParams,
    enabled: !!collectionId,
  });

  const productsWithCategory = products.map((product) => ({
    ...product,
    category: product.category,
  })) as ProductWithCategory[];

  const collectionName = collectionInfo?.name || "商品系列";
  const categoryName = categorySlug ? decodeURIComponent(categorySlug) : "全部";
  const collectionHref = `/collections/${collectionId}/全部`;

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl);
    },
    [searchParams, pathname, router],
  );

  const getPageNumbers = useCallback(() => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="mx-auto mt-16 max-w-7xl md:mt-32">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-destructive text-lg font-semibold">載入失敗</h2>
          <p className="text-destructive">
            無法載入商品資料，請重新整理頁面或稍後再試。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 min-h-screen max-w-7xl space-y-6 px-6 md:mt-32 md:px-0">
      {/* Breadcrumb */}
      <PageBreadcrumb
        currentPageName={categoryName}
        parentPage={{
          name: collectionName,
          href: collectionHref,
        }}
        grandparentPage={{
          name: "商品系列",
          href: "/collections",
        }}
      />

      <h1 className="text-3xl font-bold">{categoryName}</h1>

      {/* Mobile Filter */}
      <div className="md:hidden">
        <Suspense
          fallback={
            <div className="h-12 animate-pulse rounded bg-gray-200"></div>
          }
        >
          <MobileFilterSidebarOptimized availableFilters={availableFilters} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:w-64 md:flex-shrink-0">
          <Suspense fallback={<FilterSidebarSkeleton />}>
            <FilterSidebarOptimized availableFilters={availableFilters} />
          </Suspense>
        </div>

        {/* Products Content */}
        <div className="w-full flex-1">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              顯示 {(currentPage - 1) * filterParams.limit + 1}-
              {Math.min(currentPage * filterParams.limit, totalCount)} 項， 共{" "}
              {totalCount} 項商品
            </div>
            <Suspense fallback={<SortSelectorSkeleton />}>
              <SortSelector currentSort={filterParams.sortBy} />
            </Suspense>
          </div>

          {/* Products */}
          {productsWithCategory.length > 0 ? (
            <Suspense fallback={<ProductGridSkeleton />}>
              <CategoryProducts allProducts={productsWithCategory} />
            </Suspense>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-2 text-lg text-gray-500">
                沒有找到符合條件的商品
              </div>
              <div className="text-sm text-gray-400">
                請嘗試調整篩選條件或瀏覽其他分類
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Suspense fallback={<PaginationSkeleton />}>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                getPageNumbers={getPageNumbers}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
