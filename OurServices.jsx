import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTicketAlt, FaHotel, FaCamera, FaTrain, FaAd } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";


const services = [
  {
    icon: <FaTicketAlt />,
    title: "Ticket Booking",
    description: "Book tickets for your journey with ease....",
    link: "/tickets",
    buttonText: "Book Tickets",
  },
  {
    icon: <FaTicketAlt />,
    title: "Season Ticket Booking",
    description: "Get season tickets for frequent travel at discounted rates.",
    link: "/seasonTickets",
    buttonText: "Book Season Ticket",
  },
  {
    icon: <FaHotel />,
    title: "Accommodation / Hotel Booking",
    description: "Find the best stays and accommodations for your trip.",
    link: "/hotelbooking",
    buttonText: "Book Accommodation",
  },
  {
    icon: <FaCamera />,
    title: "Photographing or Filming at Railway Premises",
    description: "Capture memories or work on your projects at our railway premises.",
    link: "/railwaypremises",
    buttonText: "Book Now",
  },
  {
    icon: <FaTrain />,
    title: "Search Train Schedule",
    description: "Easily find train schedules to plan your journey.",
    link: "/trinshedule",
    buttonText: "Search",
  },

];

const OurServices = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 relative text-white">
      <header className="py-12 bg-gradient-to-br from-gray-800 to-gray-900 text-center shadow-lg relative">
        <h1 className="text-5xl font-extrabold tracking-wide text-white">Our Services</h1>
        <p className="text-lg mt-3 max-w-2xl mx-auto opacity-90">
          Discover a variety of options tailored to meet your travel needs.
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Swiper for Mobile View */}
        <div className="block sm:hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            pagination={{
              clickable: true,
              type: 'bullets',
            }}
            centeredSlides={true}
          >
            {services.map((service, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="relative group bg-gradient-to-t from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center h-16 w-16 bg-gray-700 bg-opacity-50 rounded-full shadow-lg text-white text-4xl mx-auto mb-4 group-hover:bg-gray-600 transition">
                    {service.icon}
                  </div>
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white group-hover:text-gray-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mt-3">{service.description}</p>
                  <Link
                    to={service.link}
                    className="mt-5 inline-block text-sm text-gray-900 bg-gradient-to-r from-blue-300 to-blue-500 py-2 px-4 rounded-md shadow-md hover:bg-teal-600 transition"
                  >
                    {service.buttonText}
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Grid View for Desktop (All cards visible) */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="relative group bg-gradient-to-t from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Icon */}
              <div className="flex items-center justify-center h-16 w-16 bg-gray-700 bg-opacity-50 rounded-full shadow-lg text-white text-4xl mx-auto mb-4 group-hover:bg-gray-600 transition">
                {service.icon}
              </div>
              {/* Content */}
              <h3 className="text-xl font-semibold text-white group-hover:text-gray-300">
                {service.title}
              </h3>
              <p className="text-gray-400 mt-3">{service.description}</p>
              <Link
                to={service.link}
                className="mt-5 inline-block text-sm text-gray-900 bg-gradient-to-r from-blue-300 to-blue-500 py-2 px-4 rounded-md shadow-md hover:bg-teal-600 transition"
              >
                {service.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

     
    </div>
  );
};

export default OurServices;
