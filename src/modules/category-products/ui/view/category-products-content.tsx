"use client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useFilteredProductsByCollection } from "@/services/products";
import PageHeader from "@/modules/category-products/components/page-header";
import Toolbar from "@/modules/category-products/components/toolbar";
import ProductGrid from "@/modules/category-products/components/product-grid";
import LoadingOverlay from "@/modules/category-products/components/loading-overlay";
import ProductPagination from "@/modules/category-products/components/product-pagination";
import dynamic from "next/dynamic";
import {
  buildClearedFilters,
  buildUpdatedFilters,
  buildUpdatedSort,
} from "@/lib/filter";
import DesktopFilters from "../../components/desktop-filters";

const MobileFilters = dynamic(
  () => import("@/modules/category-products/components/mobile-filters"),
  { ssr: false },
);
interface CategoryProductsContentProps {
  collectionId: string;
  categorySlug?: string;
}

const CategoryProductsContent = ({
  collectionId,
  categorySlug,
}: CategoryProductsContentProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 解析 URL 參數
  const filterParams = useMemo(() => {
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);

    return { categorySlug, categories, brands, sortBy, page, limit: 5 };
  }, [searchParams, categorySlug]);

  // 獲取過濾後的產品數據
  const { data, isPending, isError } = useFilteredProductsByCollection({
    collectionId,
    ...filterParams,
  });

  const {
    products = [],
    totalCount = 0,
    totalPages = 1,
    availableFilters = { categories: [], brands: [] },
  } = data || {};

  // 更新過濾器
  const updateFilter = (
    type: "categories" | "brands",
    value: string,
    checked: boolean,
  ) => {
    const query = buildUpdatedFilters(searchParams, type, value, checked);
    router.push(`${pathname}?${query}`);
  };

  // 更新排序
  const updateSort = (sortBy: string) => {
    const query = buildUpdatedSort(searchParams, sortBy);
    router.push(`${pathname}?${query}`);
  };

  // 清除所有過濾器
  const clearFilters = () => {
    const query = buildClearedFilters(filterParams);
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  // 頁面變更處理
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-neutral-500">載入失敗，請重試</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-center">
        {/* 頁面標題 */}
        <PageHeader
          categorySlug={categorySlug}
          totalCount={totalCount}
          isPending={isPending}
          activeFilters={{
            categories: filterParams.categories,
            brands: filterParams.brands,
          }}
        />
        {/* 上方工具欄 */}
        <Toolbar
          sortBy={filterParams.sortBy}
          onSortChange={updateSort}
          onShowMobileFilters={() => setShowMobileFilters(true)}
        />
      </div>

      <div className="flex gap-8">
        {/* 左側過濾欄 - 桌面版 */}
        <DesktopFilters
          filterParams={filterParams}
          availableFilters={availableFilters}
          onClearFilters={clearFilters}
          onFilterChange={updateFilter}
          isPending={isPending}
        />

        {/* 右側商品區域 */}
        <div className="flex-1">
          {/* 商品網格 */}
          <div className="relative">
            {/* 過濾時的遮罩層 */}
            <LoadingOverlay isVisible={isPending} />

            {/* 商品內容 */}
            <ProductGrid products={products} isPending={isPending} />
          </div>

          {/* 分頁組件 */}
          <ProductPagination
            currentPage={filterParams.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* 移動端過濾器彈窗 */}
      <MobileFilters
        showMobileFilters={showMobileFilters}
        filterParams={filterParams}
        availableFilters={availableFilters}
        onClose={() => setShowMobileFilters(false)}
        onClearFilters={clearFilters}
        onFilterChange={updateFilter}
        onSortChange={updateSort}
      />
    </>
  );
};

export default CategoryProductsContent;
