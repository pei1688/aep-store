"use server";

import { prisma } from "@/lib/prisma";

export async function getCollectionById(collectionId: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        productCollections: {
          include: {
            collection: true,
            product: {
              include: {
                category: true,
                variants: {
                  include: {
                    spec2Combinations: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return collection;
  } catch (error) {
    console.log("合集獲取錯誤", error);
  }
}

export async function getCollections() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        productCollections: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imgUrl: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return collections;
  } catch (error) {
    console.log("合集獲取錯誤", error);
    return [];
  }
}

export async function getCollectionsWithCategory() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        productCollections: {
          select: {
            product: {
              select: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return collections;
  } catch (error) {
    console.log("合集獲取錯誤", error);
    return [];
  }
}
