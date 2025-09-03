import {
  getProduct,
  getProductsByCollectionId,
  getRelatedProducts,
  getFilteredProductsByCollection,
  type ProductFilterParams,
  type FilteredProductsResult,
} from "@/action/product";
import { GetProducts, RelatedProductProps } from "@/types/product/product";
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
interface UseFilteredProductsOptions
  extends Omit<ProductFilterParams, "collectionId"> {
  collectionId: string;
  enabled?: boolean;
}

export const useFilteredProductsByCollection = ({
  collectionId,
  categorySlug,
  categories,
  brands,
  sortBy,
  page,
  limit,

  enabled = true,
}: UseFilteredProductsOptions) => {
  const { data, isError, isPending } = useQuery<FilteredProductsResult>({
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

    queryFn: async () => {
      // 優先使用 API 路由以獲得更好的緩存效果
      try {
        const params = new URLSearchParams({
          collectionId,
          ...(categorySlug && { categorySlug }),
          ...(categories?.length && { categories: categories.join(",") }),
          ...(brands?.length && { brands: brands.join(",") }),
          ...(sortBy && { sortBy }),
          ...(page && { page: page.toString() }),
          ...(limit && { limit: limit.toString() }),
        });

        const response = await fetch(`/api/products/filtered?${params}`);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.warn("API 路由失敗，回退到直接調用:", error);
        // 回退到直接調用 server action
        return getFilteredProductsByCollection({
          collectionId,
          categorySlug,
          categories,
          brands,
          sortBy,
          page,
          limit,
        });
      }
    },
    enabled: enabled && !!collectionId,
    staleTime: 1000 * 60 * 5, // 5分鐘緩存
    gcTime: 1000 * 60 * 10, // 10分鐘垃圾回收
    retry: (failureCount, error) => {
      // 對於網絡錯誤重試，但不超過2次
      return failureCount < 2;
    },
  });

  return {
    data,
    isError,
    isPending,
  };
};
