"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 共用的 include 設定
const productInclude = {
  category: true,
  variants: {
    include: {
      spec2Combinations: true,
    },
  },
};

export interface InfiniteProductFilterParams {
  collectionId: string;
  categorySlug?: string;
  categories?: string[];
  brands?: string[];
  sortBy?: string;
  cursor?: string; // 使用 cursor 而不是 page
  limit?: number;
}

export interface InfiniteFilteredProductsResult {
  products: any[];
  nextCursor: string | null;
  hasNextPage: boolean;
  totalCount: number;
  availableFilters: {
    categories: string[];
    brands: string[];
  };
  collectionInfo: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export async function getInfiniteFilteredProductsByCollection({
  collectionId,
  categorySlug,
  categories = [],
  brands = [],
  sortBy = "newest",
  cursor,
  limit = 12,
}: InfiniteProductFilterParams): Promise<InfiniteFilteredProductsResult> {
  try {
    // 首先獲取集合信息
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { id: true, name: true, slug: true },
    });
    
    if (!collection) {
      throw new Error("Collection not found");
    }

    // 構建基礎查詢條件
    const baseWhere: Prisma.ProductWhereInput = {
      productCollections: {
        some: {
          collectionId: collectionId,
        },
      },
    };

    // 添加分類過濾
    if (categorySlug) {
      const decodedCategorySlug = decodeURIComponent(categorySlug);
      if (decodedCategorySlug !== "全部") {
        baseWhere.category = {
          name: decodedCategorySlug,
        };
      }
    }

    // 添加多分類過濾（來自 URL 參數）
    if (categories.length > 0) {
      baseWhere.category = {
        name: {
          in: categories,
        },
      };
    }

    // 添加品牌過濾
    if (brands.length > 0) {
      baseWhere.brand = {
        in: brands,
      };
    }

    // 構建排序條件（先定義排序，再根據排序設置 cursor）
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    
    switch (sortBy) {
      case "price-low":
        orderBy = [{ price: "asc" }, { id: "asc" }];
        break;
      case "price-high":
        orderBy = [{ price: "desc" }, { id: "desc" }];
        break;
      case "name-asc":
        orderBy = [{ name: "asc" }, { id: "asc" }];
        break;
      case "name-desc":
        orderBy = [{ name: "desc" }, { id: "desc" }];
        break;
      case "oldest":
        orderBy = [{ createdAt: "asc" }, { id: "asc" }];
        break;
      case "newest":
      default:
        orderBy = [{ createdAt: "desc" }, { id: "desc" }];
        break;
    }

    // 添加 cursor 條件（統一使用 ID 降序的邏輯）
    if (cursor) {
      // 為了簡化邏輯，統一使用 ID 作為 cursor，並且總是降序
      baseWhere.id = {
        lt: cursor,
      };
      // 確保 ID 排序是降序的，以便 cursor 邏輯正確
      orderBy = orderBy.map(order => {
        if ('id' in order) {
          return { id: "desc" };
        }
        return order;
      });
      // 如果沒有 ID 排序，添加一個
      if (!orderBy.some(order => 'id' in order)) {
        orderBy.push({ id: "desc" });
      }
    }

    // 執行查詢，多取一個來判斷是否還有下一頁
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: baseWhere,
        include: productInclude,
        orderBy,
        take: limit + 1, // 多取一個來判斷是否有下一頁
      }),
      prisma.product.count({
        where: baseWhere,
      }),
    ]);

    // 判斷是否有下一頁
    const hasNextPage = products.length > limit;
    const resultProducts = hasNextPage ? products.slice(0, -1) : products;
    
    // 設定下一個 cursor
    const nextCursor = hasNextPage && resultProducts.length > 0 
      ? resultProducts[resultProducts.length - 1].id 
      : null;

    // 獲取可用的過濾選項（基於當前集合的所有產品）
    const allProductsInCollection = await prisma.product.findMany({
      where: {
        productCollections: {
          some: {
            collectionId: collectionId,
          },
        },
      },
      select: {
        category: {
          select: { name: true },
        },
        brand: true,
      },
    });

    const availableCategories = Array.from(
      new Set(allProductsInCollection.map((p) => p.category.name))
    );

    const availableBrands = Array.from(
      new Set(
        allProductsInCollection
          .map((p) => p.brand)
          .filter((brand): brand is string => Boolean(brand))
      )
    );

    return {
      products: resultProducts,
      nextCursor,
      hasNextPage,
      totalCount,
      availableFilters: {
        categories: availableCategories,
        brands: availableBrands,
      },
      collectionInfo: collection,
    };
  } catch (error) {
    console.error("獲取無限滾動產品錯誤:", error);
    throw error;
  }
}