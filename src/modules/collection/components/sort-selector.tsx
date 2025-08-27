"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOptionsProps {
  currentSort: string;
}

const sortOptions = [
  { value: "newest", label: "最新上架" },
  { value: "oldest", label: "最早上架" },
  { value: "price-low", label: "價格：由低到高" },
  { value: "price-high", label: "價格：由高到低" },
  { value: "name-asc", label: "名稱：A到Z" },
  { value: "name-desc", label: "名稱：Z到A" },
];

export default function SortSelector({ currentSort }: SortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (sortValue === "newest") {
      params.delete("sortBy"); // 預設值不需要在URL中
    } else {
      params.set("sortBy", sortValue);
    }

    // Reset to first page when sorting changes
    params.delete("page");

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-sm text-gray-600">排序：</span>
      <Select
        value={currentSort}
        onValueChange={(value) => handleSortChange(value)}
      >
        <SelectTrigger className="w-[180px]">
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
