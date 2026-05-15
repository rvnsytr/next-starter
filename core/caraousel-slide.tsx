"use client";

import {
  Carousel,
  CarouselApi,
  CarouselProps,
} from "@/core/components/ui/carousel";
import { cn } from "@/core/utils";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

export function CarouselSlide({
  plugins = [],
  children,
  ...props
}: React.ComponentProps<"div"> & Omit<CarouselProps, "setApi">) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[Autoplay({ delay: 10000 }), ...plugins]}
      {...props}
    >
      {children}
      <div className="flex justify-center gap-2 py-3">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 cursor-pointer rounded-full transition-all duration-500 ease-in-out",
              index === current
                ? "bg-primary w-4 opacity-100"
                : "bg-muted-foreground w-2 opacity-30 hover:opacity-50",
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}
