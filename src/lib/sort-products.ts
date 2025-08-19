
export type SortOption =
  | "price-high"
  | "price-low"
  | "newest"
  | "oldest"
  | "az"
  | "za";

interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: string | Date;
  // 可依你的資料結構補上其他欄位
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]; // 先拷貝，避免修改原始資料

  switch (sort) {
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}
