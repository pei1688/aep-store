import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCollectionById } from "@/action/collection";
import { NEW_ARRIVALS_COLLECTION_ID } from "@/config/constants";
import ProductItemOptimized from "@/modules/product/components/product-item-optimized";

const ProductList = async () => {
  const collection = await getCollectionById(NEW_ARRIVALS_COLLECTION_ID);
  if (!collection) return null;

  return (
    <section className="mx-auto flex max-w-7xl flex-col space-y-3 px-6 md:px-0 w-full">
      <div className="flex items-center justify-between">
        <h3 className="ae-home-title text-center">新品上市</h3>
        <Button variant="link" asChild>
          <Link
            href={`/collections/${NEW_ARRIVALS_COLLECTION_ID}/${"全部"}`}
            className="ae-caption flex items-center"
          >
            看更多
          </Link>
        </Button>
      </div>
      <span className="ae-home-subTitle">新的代購商品上架囉!</span>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {collection.productCollections.slice(0, 4).map((pc) => (
          <ProductItemOptimized product={pc.product} key={pc.id} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
