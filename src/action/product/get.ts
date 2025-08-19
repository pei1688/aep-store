"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany();

    return products;
  } catch (error) {
    console.log("商品獲取錯誤", error);
  }
}

export async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: {
          include: {
            spec2Combinations: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.log("商品獲取錯誤", error);
  }
}

//獲取相關的分類隨機商品
export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4,
) {
  // 取得同分類商品數量
  const totalProducts = await prisma.product.count({
    where: {
      categoryId,
      NOT: { id: excludeProductId },
    },
  });

  // 計算隨機跳過的數量
  const skip = Math.max(0, Math.floor(Math.random() * (totalProducts - limit)));

  const related = await prisma.product.findMany({
    where: {
      categoryId,
      NOT: { id: excludeProductId },
    },
    skip: skip,
    take: limit,
  });

  return related;
}

export async function getProductsByCollectionId(collectionId: string) {
  return await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      productCollections: {
        include: {
          collection: true,
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
}
