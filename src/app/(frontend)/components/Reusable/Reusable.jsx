'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ReusableSwiper = ({
    data,
    Component,
    slidesPerView = 5,
    spaceBetween = 20,
    navigation = true,
    className = "",
    breakpoints = {
        320: { slidesPerView: 1, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 15 },
        768: { slidesPerView: 3, spaceBetween: 15 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
    }
}) => {
    if (!data?.length) return null;

    return (
        <div className="relative">
            {navigation && (
                <>
                    <button className="prev-button absolute left-[-45px] top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className="next-button absolute right-[-45px] top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </>
            )}

            <Swiper
                modules={[Navigation]}
                navigation={{
                    prevEl: '.prev-button',
                    nextEl: '.next-button',
                }}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                breakpoints={breakpoints}
                
                className={`mySwiper ${className}`}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={item._id || index}>
                        <Component item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ReusableSwiper;