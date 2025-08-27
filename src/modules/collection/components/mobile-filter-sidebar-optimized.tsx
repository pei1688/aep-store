"use client";
import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, X } from "lucide-react";

interface MobileFilterSidebarOptimizedProps {
  availableFilters: {
    categories: string[];
    brands: string[];
  };
}

export default function MobileFilterSidebarOptimized({
  availableFilters,
}: MobileFilterSidebarOptimizedProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  // 計算總選中數量
  const totalSelectedFilters = selectedCategories.length + selectedBrands.length;

  // 更新 URL 參數的通用函數
  const updateUrlParams = useCallback(
    (paramName: string, values: string[]) => {
      const currentSearchParams = new URLSearchParams(searchParams.toString());

      if (values.length === 0) {
        currentSearchParams.delete(paramName);
      } else {
        currentSearchParams.set(paramName, values.join(","));
      }

      // 重置頁碼到第一頁
      currentSearchParams.delete("page");

      const queryString = currentSearchParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl);
      setIsOpen(false); // 關閉篩選面板
    },
    [searchParams, pathname, router],
  );

  // 處理分類選擇
  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      let newSelectedCategories: string[];

      if (checked) {
        newSelectedCategories = [...selectedCategories, category];
      } else {
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
        newSelectedBrands = [...selectedBrands, brand];
      } else {
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
    currentSearchParams.delete("page");

    const queryString = currentSearchParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
    setIsOpen(false);
  }, [searchParams, pathname, router]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Filter className="mr-2 h-4 w-4" />
          篩選條件
          {totalSelectedFilters > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
              {totalSelectedFilters}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>篩選條件</span>
            <SheetClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetTitle>
          <SheetDescription>
            選擇您想要的篩選條件來縮小搜尋範圍
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* 分類篩選 */}
          {availableFilters.categories.length > 0 && (
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
                    {availableFilters.categories.map((category) => {
                      const isChecked = selectedCategories.includes(category);
                      const checkboxId = `mobile-category-${category}`;

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
          )}

          <Separator className="bg-primary/20 my-4" />

          {/* 品牌篩選 */}
          {availableFilters.brands.length > 0 && (
            <Accordion type="single" defaultValue="brand" collapsible>
              <AccordionItem value="brand">
                <AccordionTrigger>
                  <h2 className="text-md font-semibold">
                    品牌{" "}
                    {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                  </h2>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {availableFilters.brands.map((brand) => {
                      const isChecked = selectedBrands.includes(brand);
                      const checkboxId = `mobile-brand-${brand}`;

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
          )}

          {/* 清除所有篩選按鈕 */}
          {totalSelectedFilters > 0 && (
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleClearAllFilters}
                className="w-full"
              >
                清除所有篩選 ({totalSelectedFilters})
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}