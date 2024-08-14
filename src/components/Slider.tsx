"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Up to",
    img: "https://images.pexels.com/photos/884979/pexels-photo-884979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/list",
    bg: "bg-gradient-to-r from-yellow-50 to-pink-100",
    season: "Summer",
    months: [5, 6], // May-June
  },
  {
    id: 2,
    title: "Monsoon Sale Collections",
    description: "Sale! Up to",
    img: "https://images.pexels.com/photos/891458/pexels-photo-891458.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "/list",
    bg: "bg-gradient-to-r from-gray-100 to-red-50",
    season: "Monsoon",
    months: [7, 8], // July-August
  },
  {
    id: 3,
    title: "Autumn Sale Collections",
    description: "Sale! Up to",
    img: "https://images.pexels.com/photos/3742684/pexels-photo-3742684.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "/list",
    bg: "bg-gradient-to-r from-pink-100 to-blue-50",
    season: "Autumn",
    months: [9, 10], // September-October
  },
  {
    id: 4,
    title: "Winter Sale Collections",
    description: "Sale! Up to",
    img: "https://images.pexels.com/photos/10786119/pexels-photo-10786119.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "/list",
    bg: "bg-gradient-to-r from-blue-100 to-green-50",
    season: "Winter",
    months: [11, 12, 1, 2], // November-February
  },
  {
    id: 5,
    title: "Spring Sale Collections",
    description: "Sale! Up to",
    img: "https://images.pexels.com/photos/4418744/pexels-photo-4418744.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "/list",
    bg: "bg-gradient-to-r from-purple-100 to-yellow-50",
    season: "Spring",
    months: [3, 4], // March-April
  },
];

const getCurrentMonthDiscount = (seasonMonths: Number[]) => {
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1
  return seasonMonths.includes(currentMonth) ? 70 : 30;
};

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => {
          const discount = getCurrentMonthDiscount(slide.months);
          return (
            <div
              className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
              key={slide.id}
            >
              {/* TEXT CONTAINER */}
              <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
                <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                  {slide.description} {discount}% off!
                </h2>
                <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
                  {slide.title}
                </h1>
                <Link href={slide.url}>
                  <button className="rounded-md bg-black text-white py-3 px-4">
                    SHOP NOW
                  </button>
                </Link>
              </div>
              {/* IMAGE CONTAINER */}
              <div className="h-1/2 xl:w-1/2 xl:h-full relative">
                <Image
                  src={slide.img}
                  alt=""
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
        {slides.map((slide, index) => (
          <div
            className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
              current === index ? "scale-150" : ""
            }`}
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
