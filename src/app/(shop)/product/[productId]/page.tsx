import ProductContent from "@/modules/product/ui/views/proeduct-content";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;

  return <ProductContent slug={productId} />;
};

export default ProductPage;
