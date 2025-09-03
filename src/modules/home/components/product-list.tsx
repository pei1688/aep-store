import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCollectionById } from "@/action/collection";
import { NEW_ARRIVALS_COLLECTION_ID } from "@/config/constants";
import ProductItemOptimized from "@/modules/product/components/product-item-optimized";
import { ChevronDown } from "lucide-react";

const ProductList = async () => {
  const collection = await getCollectionById(NEW_ARRIVALS_COLLECTION_ID);
  if (!collection) return null;

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col space-y-3 px-6">
      <div className="flex items-center justify-between">
        <h3 className="ae-home-title text-center">新品上市</h3>
        <Button variant="link" asChild className="hidden md:block">
          <Link
            href={`/collections/${NEW_ARRIVALS_COLLECTION_ID}/${"全部"}`}
            className="ae-caption flex items-center"
          >
            看更多
          </Link>
        </Button>
      </div>
      <span className="ae-home-subTitle">新的代購商品上架囉!</span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collection.productCollections.slice(0, 4).map((pc) => (
          <ProductItemOptimized product={pc.product} key={pc.id} />
        ))}
      </div>

      <Button
        variant="link"
        asChild
        className="mt-4 block h-[100px] text-2xl md:hidden"
      >
        <Link
          href={`/collections/${NEW_ARRIVALS_COLLECTION_ID}/全部`}
          className="flex flex-col items-center"
        >
          <span>看更多</span>
          <ChevronDown className="size-12 text-neutral-500" />
        </Link>
      </Button>
    </section>
  );
};

export default ProductList;
