"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useVariantStock,
  useStockValidation,
  useProductPrice,
} from "@/hooks/product/use-product-stock";
import { useProductVariants } from "@/hooks/product/use-product-variants";
import { useCartStore } from "@/store/cart-store";
import { useProductDetailStore } from "@/store/product-detail-store";
import { ShoppingCart } from "lucide-react";
import { QuantitySelector } from "../product-detail/quantity-selector";
import { VariantSelector } from "../product-detail/variant-selector";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/spinner";
import { ProductDetailProps } from "@/types/product/product-detail";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useProductById } from "@/services/products";
import { ProductDialogImage } from "./product-dialog-image";
import { ProductDialogHeader } from "./product-dialog-header";
import { ProductDialogActions } from "./product-dialog-actions";

const ProductDialogItem = ({ productId }: { productId: string }) => {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        <ShoppingCart className="size-6 text-neutral-800 hover:text-neutral-600" />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-3xl">
        <VisuallyHidden>
          <DialogTitle>商品詳情</DialogTitle>
        </VisuallyHidden>
        <ProductDialogContentFetcher productId={productId} />
      </DialogContent>
    </Dialog>
  );
};

const ProductDialogContentFetcher = ({ productId }: { productId: string }) => {
  const { product, error, isPending } = useProductById({ id: productId });

  if (isPending) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return <div>無法載入商品，請稍後再試。</div>;
  }

  return <ProductDialogDetail product={product} />;
};

const ProductDialogDetail = ({ product }: ProductDetailProps) => {
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

  // 使用分離的 hooks 來獲得更清晰的功能分離
  const { variantInfo, isAllVariantsSelected } = useVariantStock(
    product,
    groupedVariants,
  );
  const stockValidation = useStockValidation(product.id, variantInfo);
  const priceInfo = useProductPrice(product, variantInfo);

  useEffect(() => {
    if (product.imgUrl?.[0]) {
      resetState(product.imgUrl[0]);
    }
    return () => resetState(product.imgUrl?.[0] || "");
  }, [product, resetState]);

  const handleVariantSelect = (specName: string, variant: any) => {
    const isCurrentlySelected = selectedVariants[specName] === variant.id;
    const newVariants = { ...selectedVariants };
    if (isCurrentlySelected) {
      delete newVariants[specName];
    } else {
      newVariants[specName] = variant.id;
    }
    setSelectedVariants(newVariants);
    if (variant.spec1Image) {
      setCurrentImage(variant.spec1Image);
    }
  };

  const handleSpec2Select = (variantId: string, spec2: any) => {
    const isCurrentlySelected = selectedSpec2[variantId] === spec2.id;
    const newSpec2 = { ...selectedSpec2 };
    if (isCurrentlySelected) {
      delete newSpec2[variantId];
    } else {
      newSpec2[variantId] = spec2.id;
    }
    setSelectedSpec2(newSpec2);
  };

  const generateVariantText = () => {
    if (!product.variants) return "";
    return Object.entries(selectedVariants)
      .map(([specName, variantId]) => {
        const variant = product.variants?.find((v) => v.id === variantId);
        if (!variant) return "";
        let text = `${specName}: ${variant.spec1Value}`;
        const spec2Id = selectedSpec2[variantId];
        const spec2 = variant.spec2Combinations?.find((s) => s.id === spec2Id);
        if (spec2) {
          text += `, ${spec2.spec2Name}: ${spec2.spec2Value}`;
        }
        return text;
      })
      .join(" | ");
  };

  const validateSelection = () => {
    if (Object.keys(groupedVariants).length > 0 && !isAllVariantsSelected) {
      toast.error("請選擇所有商品選項");
      return false;
    }
    if (stockValidation.isExceeded) {
      toast.error(
        `庫存不足，最多只能再加入 ${stockValidation.availableQuantity} 件商品`,
      );
      return false;
    }
    return true;
  };

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
    addItem(createCartItem());
    toast.success("已加入購物車");
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    addItem(createCartItem());
    router.push("/cart");
  };

  const isDisabled =
    variantInfo.stock === 0 ||
    (Object.keys(groupedVariants).length > 0 && !isAllVariantsSelected);

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ProductDialogImage
          imageUrl={currentImage || "/default-product.png"}
          altText={product.name}
        />
        <div className="flex flex-col">
          <ProductDialogHeader
            name={product.name}
            price={priceInfo.finalPrice}
            isOnSale={product.isOnSale}
            discountPercentage={product.discountPercentage}
          />
          <Separator className="my-4" />
          <div className="flex-grow">
            <VariantSelector
              groupedVariants={groupedVariants}
              product={product}
              onVariantSelect={handleVariantSelect}
              onSpec2Select={handleSpec2Select}
            />
          </div>
          <QuantitySelector
            stock={variantInfo.stock}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </div>
      </div>
      <ProductDialogActions
        onBuyNow={handleBuyNow}
        onAddToCart={handleAddToCart}
        disabled={isDisabled}
      />
    </div>
  );
};

export default ProductDialogItem;
