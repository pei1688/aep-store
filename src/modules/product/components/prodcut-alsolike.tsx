import { getRelatedProducts } from "@/action/product";
import { useQuery } from "@tanstack/react-query";
import ProductItem from "./product-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
interface ProductAlsoLikeProps {
  categoryId: string;
  productId: string;
}

const ProductAlsoLike = ({ categoryId, productId }: ProductAlsoLikeProps) => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["relatedProducts", categoryId, productId],
    queryFn: () => getRelatedProducts(categoryId, productId),
  });

  if (isLoading) {
    return <div>載入推薦商品中...</div>;
  }

  if (error) {
    return <div className="text-gray-500">推薦商品載入失敗</div>;
  }

  if (!products || products.length === 0) {
    return <div className="text-gray-500">敬請期待</div>;
  }

  return (
    <Carousel className="relative w-full">
      <CarouselPrevious className="absolute top-1/2 -left-12 hidden -translate-y-1/2 md:block" />
      <CarouselContent>
        {products.map((pd) => (
          <CarouselItem
            key={pd.id}
            className="max-w-xs basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <ProductItem pc={pd} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="absolute top-1/2 -right-12 hidden -translate-y-1/2 md:block" />
    </Carousel>
  );
};

export default ProductAlsoLike;
