import { ProductWithCategory } from "@/types/product/product";

export function createProductFilters(
  searchParams: URLSearchParams,
  categorySlug: string,
) {
  const decoded = decodeURIComponent(categorySlug);
  const isAll = decoded === "全部";

  // 從 URL 參數解析過濾條件
  const selectedCategories =
    searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const selectedBrands =
    searchParams.get("brands")?.split(",").filter(Boolean) || [];

  return {
    isAll,
    decoded,
    selectedCategories,
    selectedBrands,
    // 過濾函數
    filterByCategory: (product: ProductWithCategory) => {
      // 如果有 URL 中的 categories 參數，優先使用
      if (selectedCategories.length > 0) {
        return selectedCategories.includes(product.category.name);
      }
      // 否則使用 categorySlug
      return isAll || product.category.name === decoded;
    },
    filterByBrand: (product: ProductWithCategory) => {
      return (
        selectedBrands.length === 0 ||
        (product.brand && selectedBrands.includes(product.brand))
      );
    },
  };
}

// 排序工具函數
export function sortProducts(products: ProductWithCategory[], sortBy: string) {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "", "zh-TW");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "", "zh-TW");
      case "oldest":
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      case "newest":
      default:
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
    }
  });
}
