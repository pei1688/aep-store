"use client";

import CollectionItem from "@/modules/collection/components/collection-item";
import { Collection } from "@prisma/client";

interface CollectionCardProps {
  collections: Collection[];
}

const CollectionCard = ({ collections }: CollectionCardProps) => {
  const featuredCollections = collections.filter((col) =>
    ["AEp選品系列", "新品上市", "日系彩妝", "特價商品"].includes(col.name),
  );
  return (
    <div className="grid grid-cols-3 gap-4 ">
      {/* 左邊大圖 */}
      {featuredCollections[0] && (
        <div className="col-span-1 row-span-2 min-h-[200px]">
          <CollectionItem col={featuredCollections[0]} />
        </div>
      )}

      {/* 右邊整塊也交給 grid 控制 */}
      <div className="col-span-2 row-span-2 grid grid-rows-2 gap-4">
        {/* 上方大圖 */}
        {featuredCollections[1] && (
          <div className="h-[200px] ">
            <CollectionItem col={featuredCollections[1]} />
          </div>
        )}

        {/* 下方三小圖 */}
        <div className="grid grid-cols-2  gap-4">
          {featuredCollections.slice(2, 5).map((col) => (
            <div key={col.id} className="min-h-[150px]">
              <CollectionItem col={col} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
