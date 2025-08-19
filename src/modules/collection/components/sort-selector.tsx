"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface SortOptionsProps {
  currentSort: string;
  collectionId: string;
  categorySlug: string;
  brandFilter: string | null;
}

const sortOptions = [
  { value: "newest", label: "最新上架" },
  { value: "oldest", label: "最早上架" },
  { value: "price-low", label: "價格：由低到高" },
  { value: "price-high", label: "價格：由高到低" },
  { value: "name-asc", label: "名稱：A到Z" },
  { value: "name-desc", label: "名稱：Z到A" },
];

export default function SortSelector({
  currentSort,
  collectionId,
  categorySlug,
  brandFilter,
}: SortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (sortValue === "newest") {
      params.delete("sortBy"); // 預設值不需要在URL中
    } else {
      params.set("sortBy", sortValue);
    }

    if (brandFilter) {
      params.set("brand", brandFilter);
    }
    const queryString = params.toString();
    const url = `/collections/${collectionId}/${categorySlug}${queryString ? `?${queryString}` : ""}`;
    router.push(url);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Select
        value={currentSort}
        onValueChange={(value) => handleSortChange(value)}
      >
        <SelectTrigger className="bg-transparent w-full p-0 shadow-transparent focus-visible:ring-transparent">
          <SelectValue placeholder="排序方式" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
