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

export interface ProductFilterParams {
  collectionId: string;
  categorySlug?: string;
  categories?: string[];
  brands?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface FilteredProductsResult {
  products: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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

export async function getFilteredProductsByCollection({
  collectionId,
  categorySlug,
  categories = [],
  brands = [],
  sortBy = "newest",
  page = 1,
  limit = 4,
}: ProductFilterParams): Promise<FilteredProductsResult> {
  try {
    console.log("🔍 getFilteredProductsByCollection 開始:", {
      collectionId,
      categorySlug,
      categories,
      brands,
      sortBy,
      page,
      limit,
    });

    // 首先獲取集合信息
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { id: true, name: true, slug: true },
    });

    console.log("🔍 找到的集合:", collection);

    if (!collection) {
      console.error("❌ 集合未找到:", collectionId);
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
      console.log("🔍 分類處理:", {
        原始categorySlug: categorySlug,
        解碼後: decodedCategorySlug,
        是否為全部: decodedCategorySlug === "全部",
        將添加分類過濾: decodedCategorySlug !== "全部"
      });
      
      // 只有當解碼後的分類不是 "全部" 時才添加分類過濾
      if (decodedCategorySlug !== "全部") {
        baseWhere.category = {
          name: decodedCategorySlug,
        };
      }
    }

    // 添加多分類過濾（來自 URL 參數）
    // 注意：如果有 categories 參數，它會覆蓋 categorySlug 的過濾
    if (categories.length > 0) {
      console.log("🔍 使用多分類過濾，覆蓋 categorySlug:", categories);
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

    // 構建排序條件
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    
    switch (sortBy) {
      case "price-low":
        orderBy = [{ price: "asc" }];
        break;
      case "price-high":
        orderBy = [{ price: "desc" }];
        break;
      case "name-asc":
        orderBy = [{ name: "asc" }];
        break;
      case "name-desc":
        orderBy = [{ name: "desc" }];
        break;
      case "oldest":
        orderBy = [{ createdAt: "asc" }];
        break;
      case "newest":
      default:
        orderBy = [{ createdAt: "desc" }];
        break;
    }

    // 計算分頁
    const skip = (page - 1) * limit;

    console.log("🔍 查詢條件:", {
      baseWhere: JSON.stringify(baseWhere, null, 2),
      orderBy,
      skip,
      take: limit,
    });

    // 執行查詢
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: baseWhere,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({
        where: baseWhere,
      }),
    ]);

    console.log("🔍 查詢結果:", {
      productsCount: products.length,
      totalCount,
      firstProduct: products[0] ? {
        id: products[0].id,
        name: products[0].name,
        category: products[0].category?.name,
      } : null,
    });

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

    // 計算分頁信息
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
      availableFilters: {
        categories: availableCategories,
        brands: availableBrands,
      },
      collectionInfo: collection,
    };
  } catch (error) {
    console.error("獲取過濾產品錯誤:", error);
    throw error;
  }
}