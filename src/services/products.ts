import { getProduct, getProductsByCollectionId } from "@/action/product";
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export type GetProductsByCollectionIdResult = Prisma.PromiseReturnType<
  typeof getProductsByCollectionId
>;
type UseAllProductsOptions = {
  collectionId: string;
  initialData?: GetProductsByCollectionIdResult;
};
//🔸
export const useAllProductsByCollectionId = ({
  collectionId,
  initialData,
}: UseAllProductsOptions) => {
  const {
    data: allProducts,
    isError,
    isPending,
  } = useQuery<GetProductsByCollectionIdResult>({
    queryKey: ["allProducts", collectionId],
    queryFn: () => getProductsByCollectionId(collectionId),
    initialData,
  });

  return { allProducts, isError, isPending };
};

//🔸
export const useProductById = ({ id }: { id: string }) => {
  const {
    data: product,
    error,
    isPending,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 60,
  });

  return { product, isPending, error };
};
