import Hero from "@/modules/home/components/hero";
import Collections from "@/modules/home/components/collections";
import Brand from "@/modules/home/components/brand";
import { Suspense } from "react";
import ProductList from "@/modules/home/components/product-list";
import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/fadein";

const HomePage = async () => {
  return (
    <div className="w-full">
      <FadeIn>
        <Hero />
      </FadeIn>

      <FadeIn delay={0.2}>
        <Suspense fallback={"loading..."}>
          <ProductList />
        </Suspense>
      </FadeIn>

      <Separator className="bg-primary/20 mx-auto mt-8 max-w-7xl " />

      <FadeIn delay={0.2}>
        <Suspense fallback={"loading..."}>
          <Collections />
        </Suspense>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Brand />
      </FadeIn>
    </div>
  );
};

export default HomePage;
