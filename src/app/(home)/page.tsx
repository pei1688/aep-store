import Hero from "@/modules/home/components/hero";
import Collections from "@/modules/home/components/collections";
import Brand from "@/modules/home/components/brand";
import { Suspense } from "react";
import ProductList from "@/modules/home/components/product-list";
import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/fadein";

const HomePage = async () => {
  return (
    <div className="flex w-full flex-col space-y-12">
      <FadeIn>
        <Hero />
      </FadeIn>

      <FadeIn delay={0.3}>
        <Suspense fallback={"loading..."}>
          <ProductList />
        </Suspense>
      </FadeIn>

      <Separator className="mx-auto max-w-7xl bg-neutral-500/20" />

      <FadeIn delay={0.4}>
        <Suspense fallback={"loading..."}>
          <Collections />
        </Suspense>
      </FadeIn>

      <FadeIn delay={0.5}>
        <Brand />
      </FadeIn>
    </div>
  );
};

export default HomePage;
