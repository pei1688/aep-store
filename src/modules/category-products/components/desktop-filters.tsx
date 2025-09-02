import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FilterSection from "./filter-section";
import FilterSkeleton from "../ui/filter-skeleton";

interface DesktopFiltersProps {
  filterParams: {
    categories: string[];
    brands: string[];
  };
  lastAvailableFilters: {
    categories: string[];
    brands: string[];
  };
  onClearFilters: () => void;
  onFilterChange: (
    type: "categories" | "brands",
    value: string,
    checked: boolean,
  ) => void;
  isPending: boolean;
}

const DesktopFilters = ({
  filterParams,
  lastAvailableFilters,
  onClearFilters,
  onFilterChange,
  isPending,
}: DesktopFiltersProps) => (
  <div className="hidden w-64 shrink-0 lg:block">
    <div className="sticky top-4 space-y-6">
      {/* 清除過濾器按鈕 */}
      {(filterParams.categories.length > 0 ||
        filterParams.brands.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="mr-2 size-4 ae-body" />
          清除過濾器
        </Button>
      )}

      {/* 分類過濾 */}
      {isPending ? (
        <FilterSkeleton />
      ) : lastAvailableFilters.categories.length > 0 ? (
        <FilterSection
          title="分類"
          items={lastAvailableFilters.categories}
          type="categories"
          selectedItems={filterParams.categories}
          onFilterChange={onFilterChange}
        />
      ) : null}

      {/* 品牌過濾 */}
      {isPending ? (
        <FilterSkeleton />
      ) : lastAvailableFilters.brands.length > 0 ? (
        <FilterSection
          title="品牌"
          items={lastAvailableFilters.brands}
          type="brands"
          selectedItems={filterParams.brands}
          onFilterChange={onFilterChange}
        />
      ) : null}
    </div>
  </div>
);

export default DesktopFilters;
