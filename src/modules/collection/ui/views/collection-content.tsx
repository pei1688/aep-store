import { getCollections } from "@/action/collection";
import PageBreadcrumb from "@/components/layout/page-breadcrumb";
import CollectionItem from "../../components/collection-item";

const CollectionContent = async () => {
  const collections = await getCollections();

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col items-start gap-4">
        <PageBreadcrumb currentPageName="商品系列" />
        <div className="text-2xl font-semibold">商品系列</div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections &&
          collections?.length > 0 &&
          collections.map((col) => <CollectionItem col={col} key={col.id} />)}
      </div>
    </div>
  );
};

export default CollectionContent;
