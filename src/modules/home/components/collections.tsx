import { getCollections } from "@/action/collection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CollectionCard from "./collection-card";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-0">
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h3 className="ae-home-title text-center">商品系列</h3>
        <Button variant="link" className="text-md cursor-pointer" asChild>
          <Link href="/collections" className="flex items-center">
            看更多
          </Link>
        </Button>
      </div>
      <span className="ae-home-subTitle">選擇一個喜歡的系列來看看吧!</span>
      <div className="mt-8">
        <CollectionCard collections={collections} />
      </div>
    </section>
  );
};

export default Collections;
