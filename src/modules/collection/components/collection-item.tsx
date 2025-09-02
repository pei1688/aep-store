import Link from "next/link";
import Image from "next/image";
import { Collection } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface CollectionItemProps {
  col: Collection;
}

const CollectionItem = ({ col }: CollectionItemProps) => {
  const defaultSlug = encodeURIComponent("全部");

  return (
    <Link
      href={`/collections/${col.id}/${defaultSlug}`}
      className="relative block h-[410px] w-full shadow-xl duration-500 hover:scale-102 hover:shadow-2xl"
    >
      <Image
        src={col.image || "/default-collection.jpg"}
        alt={col.name}
        fill
        className="rounded-sm object-cover transition-transform"
      />
      <div className="absolute bottom-0 left-0 h-full w-full rounded-sm bg-black/40" />
      <div className="absolute inset-0 flex w-full flex-col items-center justify-center gap-4 px-4 py-3 text-neutral-50">
        <h1 className="ae-home-title">{col.name}</h1>
        <Button variant={"default2"}>查看商品</Button>
      </div>
    </Link>
  );
};

export default CollectionItem;
