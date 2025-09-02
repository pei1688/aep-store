"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { calculateDiscountedPrice } from "@/lib/price";

interface ProductDialogHeaderProps {
  name: string;
  price: number;
  isOnSale?: boolean;
  discountPercentage?: number | null;
}

export const ProductDialogHeader = ({
  name,
  price,
  isOnSale = false,
  discountPercentage,
}: ProductDialogHeaderProps) => {
  const discountInfo = calculateDiscountedPrice(
    price,
    isOnSale,
    discountPercentage,
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle className="ae-home-title">{name}</DialogTitle>
      </DialogHeader>
      <div className="ae-caption mt-2 flex items-center gap-2">
        {discountInfo.hasDiscount ? (
          <>
            <p className="font-bold text-fuchsia-600">
              NT$ {discountInfo.discountedPrice}
            </p>
            <p className="text-sm text-neutral-500 line-through">NT$ {price}</p>
            <p className="rounded px-2 py-1 font-bold text-fuchsia-600">
              -{discountPercentage}%
            </p>
          </>
        ) : (
          <p className="font-bold">NT$ {price}</p>
        )}
      </div>
    </>
  );
};
