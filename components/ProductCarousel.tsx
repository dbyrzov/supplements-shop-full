"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; 
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

type ProductCarouselProps = {
  products: Product[];
};

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  return (
    <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }}
        style={{ padding: "32px 48px" } as React.CSSProperties}
        >
        {products.map((p) => (
            <SwiperSlide key={p.id}>
            <ProductCard {...p} />
            </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default ProductCarousel;
