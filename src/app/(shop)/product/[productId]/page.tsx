import { getProduct } from "@/action/product";
import ProductContent from "@/modules/product/ui/views/proeduct-content";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;
  const initialData = await getProduct(productId);

  return <ProductContent productId={productId} initialData={initialData} />;
};

export default ProductPage;
