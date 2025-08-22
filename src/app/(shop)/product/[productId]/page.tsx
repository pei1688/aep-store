import { getProduct, getProducts } from "@/action/product";
import ProductContent from "@/modules/product/ui/views/proeduct-content";

export async function generateStaticParams() {
  const products = await getProducts();

  if (!products) {
    return [];
  }

  return products.map((product) => ({
    productId: product.id,
  }));
}

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } =await params;
  const initialData = await getProduct(productId);

  return <ProductContent productId={productId} initialData={initialData} />;
};

export default ProductPage;
