// start of frontend/components/ui/Carousel.tsx
'use client';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import IconCaretDown from '@/components/icon/icon-caret-down';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface CarouselItem {
  image: string;
  title?: string;
  description?: string;
  overlay?: boolean;
}

interface CarouselProps {
  items: CarouselItem[];
  id?: string;
  className?: string;
  // Layout options
  showNavigation?: boolean;
  showPagination?: boolean;
  paginationType?: 'bullets' | 'fraction' | 'progressbar';
  direction?: 'horizontal' | 'vertical';
  // Behavior options
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  // Slide options
  slidesPerView?: number;
  spaceBetween?: number;
  // Style options
  imageClassName?: string;
  navigationClassName?: string;
  overlayClassName?: string;
  // Responsive breakpoints
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
      spaceBetween?: number;
    };
  };
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  id = 'default-carousel',
  className = '',
  // Layout
  showNavigation = true,
  showPagination = true,
  paginationType = 'bullets',
  direction = 'horizontal',
  // Behavior
  autoplay = false,
  autoplayDelay = 3000,
  loop = false,
  // Slide options
  slidesPerView = 1,
  spaceBetween = 30,
  // Style
  imageClassName = 'w-full h-full object-cover',
  navigationClassName = '',
  overlayClassName = '',
  // Responsive
  breakpoints
}) => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const swiperRef = useRef<any>(null);

  // Navigation button classes
  const baseNavButtonClasses = `
    absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center 
    rounded-full border border-primary p-1 text-primary transition 
    hover:border-primary hover:bg-primary hover:text-white
    ${navigationClassName}
  `;

  const prevButtonClasses = `${baseNavButtonClasses} ltr:left-2 rtl:right-2 swiper-button-prev-${id}`;
  const nextButtonClasses = `${baseNavButtonClasses} ltr:right-2 rtl:left-2 swiper-button-next-${id}`;

  return (
    <div className={`relative ${className}`}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]}
        direction={direction}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        pagination={
          showPagination
            ? {
                clickable: true,
                type: paginationType,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: `.swiper-button-next-${id}`,
                prevEl: `.swiper-button-prev-${id}`,
              }
            : false
        }
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
              }
            : false
        }
        loop={loop}
        breakpoints={breakpoints}
        dir={themeConfig.rtlClass}
        className="w-full"
      >
        <div className="swiper-wrapper">
          {items.map((item, index) => (
            <SwiperSlide key={index} className="relative">
              <img 
                src={item.image} 
                alt={item.title || `slide-${index + 1}`} 
                className={imageClassName}
              />
              
              {(item.title || item.description) && (
                <div className={`
                  absolute inset-0 z-[999] flex flex-col items-center 
                  justify-center text-white
                  ${item.overlay ? 'bg-black/40' : ''}
                  ${overlayClassName}
                `}>
                  {item.title && (
                    <h3 className="mb-2 text-xl font-bold sm:text-3xl">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="px-4 text-center text-sm sm:text-base">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </div>

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <button type="button" className={prevButtonClasses}>
              <IconCaretDown className="h-5 w-5 rotate-90 rtl:-rotate-90" />
            </button>
            <button type="button" className={nextButtonClasses}>
              <IconCaretDown className="h-5 w-5 -rotate-90 rtl:rotate-90" />
            </button>
          </>
        )}
      </Swiper>
    </div>
  );
};

export default Carousel;
// end of frontend/components/ui/Carousel.tsx