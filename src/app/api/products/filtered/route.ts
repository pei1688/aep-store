import { NextRequest, NextResponse } from "next/server";
import { getFilteredProductsByCollection } from "@/action/product/get-filtered";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析查詢參數
    const collectionId = searchParams.get("collectionId");
    const categorySlug = searchParams.get("categorySlug");
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    // 驗證必要參數
    if (!collectionId) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 }
      );
    }

    // 調用後端過濾函數
    const result = await getFilteredProductsByCollection({
      collectionId,
      categorySlug: categorySlug || undefined,
      categories,
      brands,
      sortBy,
      page,
      limit,
    });

    // 設置緩存標頭
    const response = NextResponse.json(result);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("API 過濾產品錯誤:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}