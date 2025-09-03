"use server";

import { prisma } from "@/lib/prisma";

// 共用的 include 設定
const productInclude = {
  category: true,
  variants: {
    include: {
      spec2Combinations: true,
    },
  },
};

// -----------------------

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: productInclude, // 套用共用 include
    });
    return products;
  } catch (error) {
    console.log("商品獲取錯誤", error);
  }
}

// 獲取相關的分類隨機商品
export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4,
) {
  const totalProducts = await prisma.product.count({
    where: {
      categoryId,
      NOT: { id: excludeProductId },
    },
  });

  const skip = Math.max(0, Math.floor(Math.random() * (totalProducts - limit)));

  const related = await prisma.product.findMany({
    where: {
      categoryId,
      NOT: { id: excludeProductId },
    },
    skip,
    take: limit,
    include: productInclude, // 共用
  });

  return related;
}

export async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: productInclude, // 共用
    });
    return product;
  } catch (error) {
    console.log("商品獲取錯誤", error);
  }
}

export async function getProductsByCollectionId(collectionId: string) {
  return await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      productCollections: {
        include: {
          collection: true,
          product: { include: productInclude }, // 共用
        },
      },
    },
  });
}

//獲取全部商品Id
export async function getProductIds() {
  return prisma.product.findMany({
    select: { id: true },
  });
}
