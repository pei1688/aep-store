"use client";
import PageBreadcrumb from "@/components/layout/page-breadcrumb";
import Spinner from "@/components/spinner";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MobileFilterSidebar from "../../components/mobile-filter-sidebar";
import FilterSidebar from "../../components/filter-sidebar";
import SortSelector from "../../components/sort-selector";
import CategoryProducts from "../../components/category-products";
import {
  GetProductsByCollectionIdResult,
  useAllProductsByCollectionId,
} from "@/services/products";
import { createProductFilters } from "@/lib/filter";

interface CategoryPageContentProps {
  collectionId: string;
  categorySlug: string;
  brandFilter: string | null;
  sortBy: string;
  initialData: GetProductsByCollectionIdResult;
}

export default function CategoryPageContent({
  collectionId,
  categorySlug,
  brandFilter,
  sortBy,
  initialData,
}: CategoryPageContentProps) {
  const searchParams = useSearchParams();
  const { allProducts, isError, isPending } = useAllProductsByCollectionId({
    collectionId,
    initialData,
  });
  //過濾
  const filters = createProductFilters(searchParams, categorySlug);
  const selectedCategory = searchParams.get("categories");
  const displayName =
    selectedCategory || (filters.isAll ? "全部" : filters.decoded);

  const safeProducts = (allProducts?.productCollections || []).map((pc) => ({
    ...pc.product,
    category: {
      ...pc.product.category,
    },
  }));

  const filteredProducts = useMemo(() => {
    if (!safeProducts.length) return [];

    return safeProducts.filter(
      (product) =>
        filters.filterByCategory(product) && filters.filterByBrand(product),
    );
  }, [safeProducts, filters]);

  const collectionName =
    allProducts?.productCollections?.[0]?.collection.name ??
    allProducts?.productCollections?.[0]?.collection.slug ??
    "商品系列";

  // 從 URL 參數獲取當前選中的品牌，用於顯示在麵包屑中
  const selectedBrand = searchParams.get("brands");
  const parentPageName = selectedBrand || collectionName;

  if (isPending || !allProducts) {
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
        grandparentPage={{ name: "商品系列", href: "/collections" }}
        parentPage={{
          name: parentPageName,
          href: `/collections/${collectionId}/${encodeURIComponent("全部")}${
            brandFilter ? `?brand=${brandFilter}` : ""
          }`,
        }}
        currentPageName={displayName}
      />

      <h1 className="text-3xl font-bold">{displayName}</h1>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="hidden md:block md:w-[280px]">
          <FilterSidebar allProducts={safeProducts} />
        </div>
        {/* 手機版過濾 */}
        <MobileFilterSidebar allProducts={safeProducts} />
        {/* 商品與排序區塊 */}
        <div className="w-full flex-1">
          <div className="flex justify-end">
            <SortSelector
              currentSort={sortBy}
              collectionId={collectionId}
              categorySlug={categorySlug}
              brandFilter={brandFilter}
            />
          </div>
          <CategoryProducts
            sortBy={sortBy}
            allProducts={filteredProducts}
            category={displayName}
            brandFilter={brandFilter}
          />
        </div>
      </div>
    </div>
  );
}
