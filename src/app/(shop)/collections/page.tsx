import { Suspense } from "react";
import Spinner from "@/components/spinner";
import CollectionContent from "@/modules/collection/ui/views/collection-content";

const CollectionsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-[500px] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
};

export default CollectionsPage;
