"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProductStock } from "@/hooks/use-product-stock";
import { useProductVariants } from "@/hooks/use-product-variants";
import { useCartStore } from "@/store/cart-store";
import { useProductDetailStore } from "@/store/product-detail-store";
import { ProductDetailProps } from "@/types/product/product-detail";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { QuantitySelector } from "./product-detail/quantity-selector";
import { VariantSelector } from "./product-detail/variant-selector";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ProductDialogContent = ({ product }: ProductDetailProps) => {
  const { addItem } = useCartStore();
  const {
    currentImage,
    selectedVariants,
    selectedSpec2,
    quantity,
    setCurrentImage,
    setSelectedVariants,
    setSelectedSpec2,
    setQuantity,
    resetState,
  } = useProductDetailStore();
  const router = useRouter();
  const { groupedVariants } = useProductVariants(product);
  const { variantInfo, stockValidation, isAllVariantsSelected, finalPrice } =
    useProductStock(product, groupedVariants);
  // 初始化狀態
  useEffect(() => {
    if (product.imgUrl[0]) {
      setCurrentImage(product.imgUrl[0]);
    }
    return () => resetState(product.imgUrl[0] || "");
  }, [product.imgUrl, setCurrentImage, resetState]);

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
    price: finalPrice,
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

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    const cartItem = createCartItem();
    addItem(cartItem);
    router.push("/cart");
  };

  const isDisabled =
    variantInfo.stock === 0 ||
    (Object.keys(groupedVariants).length > 0 && !isAllVariantsSelected);
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <ShoppingCart className="size-6 text-neutral-800 hover:text-neutral-600" />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-grow">
          <div className="relative h-64 w-full">
            <Image
              src={product.imgUrl[0]}
              alt={product.name}
              className="object-cover"
              fill
            />
          </div>
          <DialogHeader>
            <DialogTitle>{product?.name}</DialogTitle>
          </DialogHeader>
        </div>
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

        <div className="flex flex-col gap-4">
          <Separator className="bg-primary/20 my-8" />
          <Button
            variant="default"
            className="w-full"
            onClick={handleBuyNow}
            disabled={isDisabled}
          >
            立即購買
          </Button>
          <Button
            variant="default2"
            className="w-full bg-fuchsia-200/50 text-fuchsia-800"
            onClick={handleAddToCart}
            disabled={isDisabled}
          >
            加入購物車
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialogContent;
