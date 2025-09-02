import CategoryProductsContent from "@/modules/category-products/ui/view/category-products-content";

interface Props {
  params: Promise<{ collectionId: string; categorySlug: string }>;
}

export default async function CategoryProductsPage({ params }: Props) {
  const resolvedParams = await params;

  const { collectionId, categorySlug } = resolvedParams;

  return (
    <CategoryProductsContent
      collectionId={collectionId}
      categorySlug={categorySlug}
    />
  );
}
