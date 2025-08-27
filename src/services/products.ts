import {
  getProduct,
  getProductsByCollectionId,
  getRelatedProducts,
  getFilteredProductsByCollection,
  type ProductFilterParams,
  type FilteredProductsResult,
} from "@/action/product";
import { GetProducts } from "@/modules/product/ui/views/proeduct-content";
import { RelatedProductProps } from "@/types/product/product";
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
    staleTime: 1000 * 60 * 60,
  });
  return { allProducts, isError, isPending };
};

//🔸

interface ProductByIdProps {
  id: string;
  initialData?: GetProducts;
}

export const useProductById = ({ id, initialData }: ProductByIdProps) => {
  const {
    data: product,
    error,
    isPending,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
    initialData,
  });
  return { product, isPending, error };
};

//🔸
export const useRelatedProducts = ({
  categoryId,
  productId,
}: RelatedProductProps) => {
  const {
    data: products,
    error,
    isPending,
  } = useQuery({
    queryKey: ["relatedProducts", categoryId, productId],
    queryFn: () => getRelatedProducts(categoryId, productId),
  });

  return { products, isPending, error };
};

//🔸 使用後端過濾的產品查詢
interface UseFilteredProductsOptions extends Omit<ProductFilterParams, 'collectionId'> {
  collectionId: string;
  enabled?: boolean;
}

export const useFilteredProductsByCollection = ({
  collectionId,
  categorySlug,
  categories,
  brands,
  sortBy = "newest",
  page = 1,
  limit = 4,
  enabled = true,
}: UseFilteredProductsOptions) => {
  const {
    data,
    isError,
    isPending,
    error,
  } = useQuery<FilteredProductsResult>({
    queryKey: [
      "filteredProducts",
      collectionId,
      categorySlug,
      categories,
      brands,
      sortBy,
      page,
      limit,
    ],
    queryFn: () =>
      getFilteredProductsByCollection({
        collectionId,
        categorySlug,
        categories,
        brands,
        sortBy,
        page,
        limit,
      }),
    enabled: enabled && !!collectionId,
    staleTime: 1000 * 60 * 5, // 5分鐘緩存
  });

  return {
    data,
    products: data?.products || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    availableFilters: data?.availableFilters || { categories: [], brands: [] },
    collectionInfo: data?.collectionInfo || null,
    isError,
    isPending,
    error,
  };
};
