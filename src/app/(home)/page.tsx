import Hero from "@/modules/home/components/hero";
import Collections from "@/modules/home/components/collections";
import Brand from "@/modules/home/components/brand";
import { Suspense } from "react";
import ProductList from "@/modules/home/components/product-list";
import { Separator } from "@/components/ui/separator";

const HomePage = () => {
  return (
    <div className="flex w-full flex-col space-y-12">
      <Hero />

      <Suspense fallback={"loading..."}>
        <ProductList />
      </Suspense>

      <Separator className="mx-auto max-w-7xl bg-neutral-500/20" />
    
      <Suspense fallback={"loading..."}>
        <Collections />
      </Suspense>

      <Brand />
    </div>
  );
};

export default HomePage;
