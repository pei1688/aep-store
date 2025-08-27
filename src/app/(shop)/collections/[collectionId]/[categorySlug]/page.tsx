import CategoryPageContent from "@/modules/collection/ui/views/category-content";

interface Props {
  params: Promise<{ collectionId: string; categorySlug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;

  const { collectionId, categorySlug } = resolvedParams;

  return (
    <CategoryPageContent
      collectionId={collectionId}
      categorySlug={categorySlug}
    />
  );
}
