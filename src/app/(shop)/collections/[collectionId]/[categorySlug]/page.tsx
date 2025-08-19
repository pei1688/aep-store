import CategoryPageContent from "@/modules/collection/ui/views/category-content";


interface Props {
  params: Promise<{ collectionId: string; categorySlug: string }>;
  searchParams: Promise<{ brand?: string; sortBy?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  // 等待 params 和 searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { collectionId, categorySlug } = resolvedParams;
  const brandFilter = resolvedSearchParams.brand ?? null;
  const sortBy = resolvedSearchParams.sortBy ?? "newest";

  return (
    <CategoryPageContent
      collectionId={collectionId}
      categorySlug={categorySlug}
      brandFilter={brandFilter}
      sortBy={sortBy}
    />
  );
}
