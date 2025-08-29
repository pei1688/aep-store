import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCollectionById } from "@/action/collection";
import { NEW_ARRIVALS_COLLECTION_ID } from "@/config/constants";
import ProductItemOptimized from "@/modules/product/components/product-item-optimized";

const ProductList = async () => {
  const collection = await getCollectionById(NEW_ARRIVALS_COLLECTION_ID);
  if (!collection) return null;

  return (
    <section className="mx-auto my-16 max-w-7xl px-6 md:px-0">
      <div className="mt-8 flex items-center justify-between">
        <h3 className="ae-home-title my-8">新品上市</h3>
        <Button variant={"link"} className="text-md cursor-pointer" asChild>
          <Link href={`/collections/${NEW_ARRIVALS_COLLECTION_ID}/${"全部"}`}>
            看更多
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {collection.productCollections.map((pc) => (
          <ProductItemOptimized product={pc.product} key={pc.id} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
