import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

function useProductFilter(
  allProducts: any[],
  categorySlug: string,
  sortBy: string,
) {
  const searchParams = useSearchParams();

  // 將資料轉換邏輯移到 useMemo 外層，減少重複計算
  const safeProducts = useMemo(() => {
    if (!allProducts?.productCollections) return [];

    return allProducts.productCollections.map((pc) => ({
      ...pc.product,
      category: {
        ...pc.product.category,
      },
    }));
  }, [allProducts?.productCollections]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!safeProducts.length) return [];

    const decoded = decodeURIComponent(categorySlug);
    const isAll = decoded === "全部";

    let filtered = [...safeProducts];

    // 分類篩選
    const selectedCategories = searchParams.get("categories")?.split(",") || [];
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category.name),
      );
    } else if (!isAll) {
      // 如果沒有明確的分類參數，使用 categorySlug
      filtered = filtered.filter(
        (product) => product.category.name === decoded,
      );
    }

    // 品牌篩選
    const selectedBrands = searchParams.get("brands")?.split(",") || [];
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (product) => product.brand && selectedBrands.includes(product.brand),
      );
    }

    // 排序 - 使用更高效的排序邏輯
    return filtered.sort((a, b) => {
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
  }, [safeProducts, searchParams, categorySlug, sortBy]);

  return {
    products: filteredAndSortedProducts,
    safeProducts,
  };
}
