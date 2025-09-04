import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCollectionById } from "@/action/collection";
import { NEW_ARRIVALS_COLLECTION_ID } from "@/config/constants";
import { ChevronDown } from "lucide-react";
import ProductItem from "@/modules/product/components/product-item";

const ProductList = async () => {
  const collection = await getCollectionById(NEW_ARRIVALS_COLLECTION_ID);
  if (!collection) return null;

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col space-y-3 px-6">
      <div className="flex items-center justify-between">
        <h3 className="ae-home-title text-center">新品上市</h3>
      </div>
      <span className="ae-home-subTitle">新的代購商品上架囉!</span>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {collection.productCollections.slice(0, 8).map((pc) => (
          <ProductItem product={pc.product} key={pc.id} />
        ))}
      </div>

      <Button
        variant="outline"
        asChild
        className="mt-3 block h-[100px] text-2xl"
      >
        <Link href={`/collections`} className="flex items-center">
          <p>View more</p>
          <ChevronDown className="size-12 text-neutral-500" />
        </Link>
      </Button>
    </section>
  );
};

export default ProductList;
