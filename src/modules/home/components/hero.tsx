"use client";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const Hero = () => {
  return (
    <section className="relative mx-auto h-screen w-full">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          <CarouselItem>
            <div className="relative h-screen w-full">
              <Image
                src="/banner1.jpg"
                alt="商品banner"
                className="rounded-md object-cover shadow-xl"
                fill
                priority
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            {" "}
            <div className="relative h-screen w-full">
              <Image
                src="/banner2.jpg"
                alt="商品banner"
                className="rounded-md object-cover shadow-xl"
                fill
                priority
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            {" "}
            <div className="relative h-screen w-full">
              <Image
                src="/banner3.jpg"
                alt="商品banner"
                className="rounded-md object-cover shadow-xl"
                fill
                priority
              />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden md:block" />
        <CarouselNext className="hidden md:block" />
      </Carousel>
    </section>
  );
};

export default Hero;
