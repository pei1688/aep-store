import { getCollections } from "@/action/collection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CollectionCard from "./collection-card";
import { ChevronDown } from "lucide-react";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col space-y-3 px-6">
      <div className="flex items-center justify-between">
        <h3 className="ae-home-title text-center">商品系列</h3>
      </div>
      <span className="ae-home-subTitle">選擇一個喜歡的系列來看看吧!</span>
      <div>
        <CollectionCard collections={collections} />
      </div>
      <Button variant="outline" asChild className="mt-3 block h-[100px] text-2xl">
        <Link href={`/collections`} className="flex items-center">
          <p>View more</p>
          <ChevronDown className="size-12 text-neutral-500" />
        </Link>
      </Button>
    </section>
  );
};

export default Collections;
