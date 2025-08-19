"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CollectionItem from "@/modules/collection/components/collection-item";
import { Collection } from "@prisma/client";
import Autoplay from "embla-carousel-autoplay";

interface CollectionCardProps {
  collections: Collection[];
}

const CollectionCard = ({ collections }: CollectionCardProps) => {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "center",
        inViewThreshold: 0.6,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselPrevious className="hidden md:block" />
      <CarouselContent>
        {collections.map((col) => (
          <CarouselItem
            key={col.id}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <CollectionItem col={col} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="hidden md:block" />
    </Carousel>
  );
};

export default CollectionCard;
