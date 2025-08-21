import Image from "next/image";
import Link from "next/link";
import ProductDialogItem from "./product-dialog-item";
import { ProductWithCategory } from "@/types/product/product";

interface ProductItemProps {
  product: ProductWithCategory;
}

const ProductItem = ({ product }: ProductItemProps) => {
 
  return (
    <div
      key={product.id}
      className="relative aspect-[3/4] w-full rounded-sm border bg-neutral-100 transition-all duration-300 hover:border-fuchsia-500 hover:shadow-lg"
    >
      <Link href={`/product/${product.id}`} className="flex h-full flex-col">
        <div className="relative h-[80%] w-full">
          <Image
            src={product.imgUrl?.[0] || "/default-product.png"}
            alt={product.name}
            className="rounded-t-sm object-cover duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            fill
          />
        </div>

        <div className="flex flex-col justify-between gap-2 p-2">
          <p className="truncate font-semibold">{product.name}</p>
          <div
            className="flex h-8 w-full items-center justify-between"
            onClick={(e) => e.preventDefault()}
          >
            <p className="font-semibold">NT$ {product.price}</p>
            <ProductDialogItem product={product} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
