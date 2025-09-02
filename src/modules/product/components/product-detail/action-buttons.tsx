import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bookmark, ShoppingCart } from "lucide-react";

interface ActionButtonsProps {
  isDisabled: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isMobile?: boolean;
}

export const ActionButtons = ({
  isDisabled,
  onAddToCart,
  onBuyNow,
  isMobile = false,
}: ActionButtonsProps) => {
  if (isMobile) {
    return (
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-neutral-200 md:hidden">
        <div className="flex">
          <Button
            variant="outline"
            className="h-16 flex-1 rounded-none text-lg"
            size={"lg"}
            onClick={onAddToCart}
            disabled={isDisabled}
          >
            <ShoppingCart className="mr-2 size-6" />
            加入購物車
          </Button>
          <Button
            variant="default"
            className="h-16 flex-1 rounded-none text-lg"
            size={"lg"}
            onClick={onBuyNow}
            disabled={isDisabled}
          >
            立即購買
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden flex-col gap-4 sm:flex">
      <Separator className="bg-primary/20 my-8" />

      <Button
        variant="default"
        className="w-full"
        onClick={onBuyNow}
        disabled={isDisabled}
      >
        立即購買
      </Button>
      <Button
        variant="default2"
        className="w-full bg-fuchsia-200/50 text-fuchsia-800"
        onClick={onAddToCart}
        disabled={isDisabled}
      >
        加入購物車
      </Button>
    </div>
  );
};
