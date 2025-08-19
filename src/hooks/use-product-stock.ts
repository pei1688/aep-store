import { useMemo } from "react";

import { useCartStore } from "@/store/cart-store";
import { ProductDetailProps } from "@/types/product/product-detail";
import { useProductDetailStore } from "@/store/product-detail-store";

export const useProductStock = (
  product: ProductDetailProps["product"],
  groupedVariants: Record<string, any[]>,
) => {
  const { selectedVariants, selectedSpec2, quantity } = useProductDetailStore();
  const { getCartItemByVariantIds } = useCartStore();

  const isAllVariantsSelected = useMemo(() => {
    const allSpec1Selected = Object.keys(groupedVariants).every(
      (specName) => selectedVariants[specName],
    );

    if (!allSpec1Selected) return false;

    const selectedVariantIds = Object.values(selectedVariants);
    for (const variantId of selectedVariantIds) {
      const variant = product.variants?.find((v) => v.id === variantId);
      if (
        variant &&
        variant.spec2Combinations &&
        variant.spec2Combinations.length > 0
      ) {
        if (!selectedSpec2[variantId]) {
          return false;
        }
      }
    }

    return true;
  }, [selectedVariants, selectedSpec2, groupedVariants, product.variants]);

  const variantInfo = useMemo(() => {
    if (Object.keys(groupedVariants).length === 0) {
      return {
        stock: product.stock || 0,
        variantId: undefined,
        spec2Id: undefined,
        currentVariant: null,
        currentSpec2: null,
      };
    }

    if (!isAllVariantsSelected) {
      return {
        stock: 0,
        variantId: undefined,
        spec2Id: undefined,
        currentVariant: null,
        currentSpec2: null,
      };
    }

    const selectedVariantIds = Object.values(selectedVariants);
    const currentVariant = product.variants?.find((variant) =>
      selectedVariantIds.includes(variant.id),
    );

    if (!currentVariant) {
      return {
        stock: 0,
        variantId: undefined,
        spec2Id: undefined,
        currentVariant: null,
        currentSpec2: null,
      };
    }

    const selectedSpec2Id = selectedSpec2[currentVariant.id];
    let currentSpec2 = null;
    let finalStock = currentVariant.stock || 0;

    if (selectedSpec2Id && currentVariant.spec2Combinations) {
      currentSpec2 = currentVariant.spec2Combinations.find(
        (spec2) => spec2.id === selectedSpec2Id,
      );
      if (currentSpec2) {
        finalStock = currentSpec2.stock || 0;
      }
    }

    return {
      stock: finalStock,
      variantId: currentVariant.id,
      spec2Id: selectedSpec2Id || undefined,
      currentVariant,
      currentSpec2,
    };
  }, [
    selectedVariants,
    selectedSpec2,
    groupedVariants,
    product,
    isAllVariantsSelected,
  ]);

  const stockValidation = useMemo(() => {
    const existingCartItem = getCartItemByVariantIds(
      product.id,
      variantInfo.variantId,
      variantInfo.spec2Id,
    );

    const cartQuantity = existingCartItem ? existingCartItem.quantity : 0; //目前購物車裡的數量
    const totalQuantity = cartQuantity + quantity; //加上這次用戶準備加進購物車的數量
    const isExceeded = totalQuantity > variantInfo.stock; //總數是否超出庫存
    return {
      isExceeded,
      cartQuantity,
      totalQuantity,
      availableQuantity: variantInfo.stock - cartQuantity, //還能加幾個
      currentStock: variantInfo.stock,
    };
  }, [product.id, variantInfo, quantity, getCartItemByVariantIds]);

  const finalPrice = useMemo(() => {
    if (variantInfo.currentSpec2?.price) {
      return variantInfo.currentSpec2.price;
    }
    if (variantInfo.currentVariant?.price) {
      return variantInfo.currentVariant.price;
    }
    return product.price;
  }, [variantInfo, product.price]);

  return {
    variantInfo,
    stockValidation,
    isAllVariantsSelected,
    finalPrice,
  };
};
