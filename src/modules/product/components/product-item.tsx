"use client";
import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/types/product/product";
import dynamic from "next/dynamic";
import { memo } from "react";
import { calculateDiscountedPrice } from "@/lib/price";

interface ProductItemProps {
  product: ProductListItem;
  priority?: boolean;
}

const ProductDialogItem = dynamic(
  () => import("./product-dialog/product-dialog-item"),
  {
    ssr: false,
    loading: () => (
      <div className="size-6 animate-pulse rounded bg-neutral-200" />
    ),
  },
);

const ProductItem = memo(({ product, priority = false }: ProductItemProps) => {
  const discountInfo = calculateDiscountedPrice(
    product.price,
    product.isOnSale,
    product.discountPercentage,
  );
  return (
    <div
      className="relative aspect-[3/4] w-full rounded-sm border bg-neutral-100 transition-all duration-300 hover:border-fuchsia-500 hover:shadow-lg"
    >
      {/* Sale badge */}
      {discountInfo.hasDiscount && (
        <div className="ae-small absolute top-2 left-2 z-10 rounded bg-fuchsia-600 px-2 py-1 text-white">
          -{product.discountPercentage}%
        </div>
      )}

      <Link href={`/product/${product.id}`} className="flex h-full flex-col">
        <div className="relative h-[80%] w-full">
          <Image
            src={product.imgUrl?.[0] || "/default-product.png"}
            alt={product.name}
            className="rounded-t-sm object-cover duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            fill
            quality={60}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckli"
          />
        </div>

        <div className="ae-body flex flex-col justify-between gap-2 p-2">
          <p className="truncate font-semibold">{product.name}</p>
          <div
            className="flex h-8 w-full items-center justify-between"
            onClick={(e) => e.preventDefault()}
          >
            <div className="flex flex-col">
              {discountInfo.hasDiscount ? (
                <>
                  <p className="text-xs text-neutral-500 line-through">
                    NT$ {product.price}
                  </p>
                  <p className="font-semibold text-fuchsia-600">
                    NT$ {discountInfo.discountedPrice}
                  </p>
                </>
              ) : (
                <p className="font-semibold">NT$ {product.price}</p>
              )}
            </div>
            <ProductDialogItem productId={product.id} />
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductItem.displayName = "ProductItem";

export default ProductItem;
