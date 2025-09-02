// 商品網格骨架屏組件
interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton = ({ count = 12 }: ProductGridSkeletonProps) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="aspect-square animate-pulse rounded bg-neutral-200"></div>
        <div className="h-4 animate-pulse rounded bg-neutral-200"></div>
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200"></div>
      </div>
    ))}
  </div>
);

export default ProductGridSkeleton;
