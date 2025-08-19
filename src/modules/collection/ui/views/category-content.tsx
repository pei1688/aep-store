"use client";
import PageBreadcrumb from "@/components/layout/page-breadcrumb";
import { getProductsByCollectionId } from "@/action/product";

import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/spinner";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MobileFilterSidebar from "../../components/mobile-filter-sidebar";
import FilterSidebar from "../../components/filter-sidebar";
import SortSelector from "../../components/sort-selector";
import CategoryProducts from "../../components/category-products";

interface CategoryPageContentProps {
  collectionId: string;
  categorySlug: string;
  brandFilter: string | null;
  sortBy: string;
}

export default function CategoryPageContent({
  collectionId,
  categorySlug,
  brandFilter,
  sortBy,
}: CategoryPageContentProps) {
  const searchParams = useSearchParams();
  const {
    data: allProducts,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["allProducts", collectionId],
    queryFn: () => getProductsByCollectionId(collectionId),
  });

  const decoded = decodeURIComponent(categorySlug);
  const isAll = decoded === "全部";

  // 優先使用 URL 參數中的 categories，如果沒有則使用 categorySlug
  const selectedCategory = searchParams.get("categories");
  const displayName = selectedCategory || (isAll ? "全部" : decoded);

  const safeProducts = (allProducts?.productCollections || []).map((pc) => ({
    ...pc.product,
    category: {
      ...pc.product.category,
    },
  }));

  const filteredProducts = useMemo(() => {
    if (!safeProducts.length) return [];

    let filtered = [...safeProducts];

    // 獲取分類過濾條件
    const selectedCategories = searchParams.get("categories")?.split(",") || [];
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category.name),
      );
    }

    // 獲取品牌過濾條件
    const selectedBrands = searchParams.get("brands")?.split(",") || [];
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (product) => product.brand && selectedBrands.includes(product.brand),
      );
    }

    // 如果不是 "全部" 分類，還需要按照當前分類過濾
    if (!isAll) {
      filtered = filtered.filter(
        (product) => product.category.name === decoded,
      );
    }

    return filtered;
  }, [safeProducts, searchParams, decoded, isAll]);

  // 修復：使用 collection.name 而不是 collection.slug
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
