"use client";
import { Separator } from "@/components/ui/separator";

import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductWithCategory } from "@/types/product/product";
import { useMemo, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Funnel } from "lucide-react";

export interface CategorySidebarProps {
  allProducts: ProductWithCategory[];
}

export const FilterSidebar = ({ allProducts }: CategorySidebarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 獲取當前選中的篩選條件
  const selectedCategories = useMemo(() => {
    const categories = searchParams.get("categories");
    return categories ? categories.split(",") : [];
  }, [searchParams]);

  const selectedBrands = useMemo(() => {
    const brands = searchParams.get("brands");
    return brands ? brands.split(",") : [];
  }, [searchParams]);

  // 計算分類和品牌列表
  const { categories, brands } = useMemo(() => {
    const categories = Array.from(
      new Set(allProducts.map((pc) => pc.category.name)),
    );

    const brands = Array.from(
      new Set(
        allProducts
          .map((pc) => pc.brand)
          .filter((b): b is string => Boolean(b)),
      ),
    );

    return { categories, brands };
  }, [allProducts]);

  // 更新 URL 參數的通用函數
  const updateUrlParams = useCallback(
    (paramName: string, values: string[]) => {
      const currentSearchParams = new URLSearchParams(searchParams.toString());

      if (values.length === 0) {
        // 如果沒有選中任何項目，移除該參數
        currentSearchParams.delete(paramName);
      } else {
        // 設定新的參數值
        currentSearchParams.set(paramName, values.join(","));
      }

      // 構建新的 URL
      const queryString = currentSearchParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl);
    },
    [searchParams, pathname, router],
  );

  // 處理分類選擇
  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      let newSelectedCategories: string[];

      if (checked) {
        // 添加分類
        newSelectedCategories = [...selectedCategories, category];
      } else {
        // 移除分類
        newSelectedCategories = selectedCategories.filter(
          (c) => c !== category,
        );
      }

      updateUrlParams("categories", newSelectedCategories);
    },
    [selectedCategories, updateUrlParams],
  );

  // 處理品牌選擇
  const handleBrandChange = useCallback(
    (brand: string, checked: boolean) => {
      let newSelectedBrands: string[];

      if (checked) {
        // 添加品牌
        newSelectedBrands = [...selectedBrands, brand];
      } else {
        // 移除品牌
        newSelectedBrands = selectedBrands.filter((b) => b !== brand);
      }

      updateUrlParams("brands", newSelectedBrands);
    },
    [selectedBrands, updateUrlParams],
  );

  // 清除所有篩選
  const handleClearAllFilters = useCallback(() => {
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.delete("categories");
    currentSearchParams.delete("brands");

    const queryString = currentSearchParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
  }, [searchParams, pathname, router]);

  return (
    <aside className="space-y-4 md:ml-1">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Funnel className="size-4" />
        條件篩選
      </h2>
      {/* 分類篩選 */}
      <Accordion type="single" defaultValue="category" collapsible>
        <AccordionItem value="category">
          <AccordionTrigger>
            <div className="text-md font-semibold">
              分類{" "}
              {selectedCategories.length > 0 &&
                `(${selectedCategories.length})`}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map((category) => {
                const isChecked = selectedCategories.includes(category);
                const checkboxId = `category-${category}`;

                return (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={checkboxId}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked as boolean)
                      }
                      className="border-neutral-800"
                    />
                    <Label
                      htmlFor={checkboxId}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </Label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="bg-primary/20 my-4" />

      {/* 品牌篩選 */}
      <Accordion type="single" defaultValue="brand" collapsible>
        <AccordionItem value="brand">
          <AccordionTrigger>
            <h2 className="text-md font-semibold">
              品牌 {selectedBrands.length > 0 && `(${selectedBrands.length})`}
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {brands.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                const checkboxId = `brand-${brand}`;

                return (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={checkboxId}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand, checked as boolean)
                      }
                      className="border-neutral-800"
                    />
                    <Label
                      htmlFor={checkboxId}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </Label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* 清除所有篩選按鈕 */}
      {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
        <div className="mb-4">
          <button
            onClick={handleClearAllFilters}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            清除所有篩選 ({selectedCategories.length + selectedBrands.length})
          </button>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
