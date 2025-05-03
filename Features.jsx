import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaGift, FaHeadset, FaPercent, FaCreditCard } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const FeatureCard = ({ Icon, title, description }) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-6 m-4 transition-transform transform hover:scale-105"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-4xl text-gray-700 mb-4">
        <Icon />
      </div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      Icon: FaCalendarAlt,
      title: "Easy Booking",
      description: "Book your train tickets online effortlessly, anytime, anywhere!",
    },
    {
      Icon: FaGift,
      title: "Special Offers",
      description: "Exclusive discounts on select travel dates!",
    },
    {
      Icon: FaHeadset,
      title: "Support 24/7",
      description: "Our support team is here for you round-the-clock!",
    },
    {
      Icon: FaPercent,
      title: "Affordable Fares",
      description: "Competitive pricing, no hidden fees!",
    },
    {
      Icon: FaCreditCard,
      title: "Secure Payments",
      description: "Book with confidence. 100% secure payments.",
    },
  ];

  return (
    <section className="py-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="px-4"
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index}>
            <FeatureCard
              Icon={feature.Icon}
              title={feature.title}
              description={feature.description}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Features;
