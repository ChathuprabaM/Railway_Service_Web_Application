import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import mainbanner1 from "../images/homebanner/main_banner_01.jpg";
import mainbanner2 from "../images/homebanner/main_banner_05.jpg";
import mainbanner3 from "../images/homebanner/main_banner_03.jpg";
import mainbanner4 from "../images/homebanner/mian_banner_04.jpg";

const HeroSlider = () => {
  const slides = [
    {
    
      title: (
        <>
        Book Your Sri Lanka Railway  <br />
        <span className="text-blue-600">Journey Online!</span>
      </>
      ),
      description:
        "Travel through the heart of Sri Lanka with ease. Reserve your seat in just a few clicks!",
      buttonText: "Book Now",
      imageUrl: mainbanner1,
    },
    {
     
      title: (
        <>
          Save More with Season <br />
          <span className="text-blue-600">Tickets</span>
        </>
      ), 
      description:
        "Get unlimited travel on your favorite routes. Enjoy the convenience and cost savings with a season ticket.",
      buttonText: "Book Now",
      imageUrl: mainbanner2,
    },
    {
      title: (
        <>
          Discover the Beauty of <br />
          <span className="text-blue-600">Sri Lanka</span>
        </>
      ),      description:
        "Explore serene landscapes and vibrant cities with ease. Your journey starts here.",
      buttonText: "Book Now",
      imageUrl: mainbanner3,
    },
    {
      title: <>
      Unlock Exclusive Railway <br />
      <span className="text-blue-600">  Deals </span>
      </>,
      description:
        "Get access to special promotions and discounted fares. Travel more for less.",
      buttonText: "Book Now",
      imageUrl: mainbanner4,
    },
  ];

  const textAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const buttonAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative">
      <Swiper
        modules={[EffectFade, Pagination, Autoplay]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="relative z-10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="h-screen  md:h-[80vh] lg:h-[70vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-12 bg-gradient-to-r from-blue-50 to-purple-50 relative">
              {/* Text Section */}
              <motion.div
                className="space-y-4 md:space-y-6 text-center md:text-left w-full md:w-1/2 z-10"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
                }}
              >
                <motion.h2
                  className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
                  variants={textAnimation}
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  className="text-sm md:text-lg lg:text-xl text-gray-700 p-2 rounded-lg"
                  variants={textAnimation}
                >
                  {slide.description}
                </motion.p>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                  variants={buttonAnimation}
                >
                  {slide.buttonText}
                </motion.button>
              </motion.div>

              {/* Image Section */}
              <div className="w-full md:w-1/2 relative z-10 mt-6 md:mt-0">
                <motion.img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="rounded-lg shadow-xl w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
