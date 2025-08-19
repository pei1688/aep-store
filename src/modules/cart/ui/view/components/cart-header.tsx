import { Separator } from "@/components/ui/separator";
interface CartHeaderProps {
  totalPrice: number;
}

const CartHeader = ({ totalPrice }: CartHeaderProps) => {
  return (
    <>
      <div className="flex gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="md:ae-home-title text-lg font-semibold">購物車</h1>
        <h1 className="md:ae-home-title text-lg font-semibold">
          合計: NT${totalPrice.toLocaleString()}
        </h1>
      </div>
      <Separator className="bg-primary/20 mx-auto my-8 max-w-7xl" />
    </>
  );
};

export default CartHeader;
