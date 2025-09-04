"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { ProductDetailProps } from "@/types/product/product-detail";
import { useProductDetailStore } from "@/store/product-detail-store";
import { useProductVariants } from "@/hooks/product/use-product-variants";
import {
  useVariantStock,
  useStockValidation,
  useProductPrice,
} from "@/hooks/product/use-product-stock";
import ProductImage from "../product-image";
import { ProductInfo } from "./product-lnfo";
import { VariantSelector } from "./variant-selector";
import { QuantitySelector } from "./quantity-selector";
import { ActionButtons } from "./action-buttons";

const ProductDetail = ({ product }: ProductDetailProps) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const {
    currentImage,
    selectedVariants,
    selectedSpec2,
    quantity,
    currentProductId, // 獲取當前商品ID狀態
    setCurrentImage,
    setSelectedVariants,
    setSelectedSpec2,
    setQuantity,
    setCurrentProductId, // 獲取設置商品ID的方法
    resetState,
  } = useProductDetailStore();

  //變體、庫存的處裡
  const { groupedVariants } = useProductVariants(product);
  const { variantInfo, isAllVariantsSelected } = useVariantStock(
    product,
    groupedVariants,
  );
  const stockValidation = useStockValidation(product.id, variantInfo);
  const priceInfo = useProductPrice(product, variantInfo);

  // 檢查並重置狀態 - 當商品ID變化時
  useEffect(() => {
    if (currentProductId !== product.id) {
      // 商品變化，重置所有狀態
      resetState(product.imgUrl[0] || "");
      setCurrentProductId(product.id);
    } else if (!currentImage && product.imgUrl[0]) {
      // 同一商品但沒有圖片，設置默認圖片
      setCurrentImage(product.imgUrl[0]);
    }
  }, [
    product.id,
    product.imgUrl,
    currentProductId,
    currentImage,
    resetState,
    setCurrentImage,
    setCurrentProductId,
  ]);

  // 處理變體選擇
  const handleVariantSelect = (specName: string, variant: any) => {
    const isCurrentlySelected = selectedVariants[specName] === variant.id;

    if (isCurrentlySelected) {
      const newVariants = { ...selectedVariants };
      delete newVariants[specName];
      setSelectedVariants(newVariants);

      const newSpec2 = { ...selectedSpec2 };
      delete newSpec2[variant.id];
      setSelectedSpec2(newSpec2);

      setCurrentImage(product.imgUrl[0]);
      setQuantity(1);
    } else {
      setSelectedVariants({
        ...selectedVariants,
        [specName]: variant.id,
      });

      const newSpec2: Record<string, string> = {};
      if (selectedSpec2[variant.id]) {
        newSpec2[variant.id] = selectedSpec2[variant.id];
      }
      setSelectedSpec2(newSpec2);

      if (variant.spec1Image) {
        setCurrentImage(variant.spec1Image);
      }
    }
  };

  // 處理規格2選擇
  const handleSpec2Select = (variantId: string, spec2: any) => {
    const isCurrentlySelected = selectedSpec2[variantId] === spec2.id;

    if (isCurrentlySelected) {
      const newSpec2 = { ...selectedSpec2 };
      delete newSpec2[variantId];
      setSelectedSpec2(newSpec2);
    } else {
      setSelectedSpec2({
        ...selectedSpec2,
        [variantId]: spec2.id,
      });
    }
  };

  // 生成變體文字
  const generateVariantText = () => {
    if (!product.variants) return "";

    const variantTexts = Object.entries(selectedVariants).flatMap(
      ([specName, variantId]) => {
        const variant = product.variants?.find((v) => v.id === variantId);
        if (!variant) return [];

        const texts = [`${specName}: ${variant.spec1Value}`];

        const spec2Id = selectedSpec2[variantId];
        const spec2 = variant.spec2Combinations?.find((s) => s.id === spec2Id);

        if (spec2) {
          texts.push(`${spec2.spec2Name}: ${spec2.spec2Value}`);
        }

        return texts;
      },
    );

    return variantTexts.join(", ");
  };

  // 驗證選擇
  const validateSelection = () => {
    if (Object.keys(groupedVariants).length > 0 && !isAllVariantsSelected) {
      toast.error("請選擇所有商品選項");
      return false;
    }

    if (stockValidation.isExceeded) {
      if (stockValidation.cartQuantity >= stockValidation.currentStock) {
        toast.error("該商品已達到庫存上限，無法再加入購物車");
      } else {
        toast.error(
          `最多只能再加入 ${stockValidation.availableQuantity} 件商品`,
        );
      }
      return false;
    }

    return true;
  };

  // 創建購物車項目
  const createCartItem = () => ({
    productId: product.id,
    name: product.name,
    price: priceInfo.finalPrice,
    image: currentImage,
    quantity,
    selectedVariants,
    variantText: generateVariantText(),
    stock: stockValidation.currentStock,
    variantId: variantInfo.variantId,
    spec2Id: variantInfo.spec2Id,
  });

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    const cartItem = createCartItem();
    addItem(cartItem);
  };

  const handleBuyNow = (): void => {
    if (!validateSelection()) return;

    const cartItem = createCartItem();
    addItem(cartItem);
    router.push("/cart");
  };

  const isDisabled =
    variantInfo.stock === 0 ||
    (Object.keys(groupedVariants).length > 0 && !isAllVariantsSelected);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 px-6 pb-20 md:pb-0 lg:grid-cols-3 lg:px-0">
        <ProductImage
          image={currentImage}
          images={product.imgUrl || [""]}
          name={product.name}
          onImageChange={setCurrentImage}
        />

        <div className="col-span-1 flex w-full flex-col">
          <ProductInfo product={product} priceInfo={priceInfo} />

          <VariantSelector
            groupedVariants={groupedVariants}
            product={product}
            onVariantSelect={handleVariantSelect}
            onSpec2Select={handleSpec2Select}
          />

          <QuantitySelector
            stock={variantInfo.stock}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

          <ActionButtons
            isDisabled={isDisabled}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />

          <Separator className="bg-primary/20 my-8" />
          <div className="ae-caption">
            *請注意，尺寸可能會有幾公分的輕微偏差。
            <br />
            *我們已盡一切努力確保產品照片盡可能接近實際顏色，但根據您的顯示器設定和房間照明，顏色可能與實際產品有所不同。
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
