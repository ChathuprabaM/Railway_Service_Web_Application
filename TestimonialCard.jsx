import React, { useState, useEffect, useCallback, memo } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { MdTrain } from "react-icons/md";

const TestimonialCard = memo(({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 text-blue-50 transform rotate-12">
        <MdTrain size={100} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
            }}
          />
          <div className="ml-4">
            <h3 className="font-semibold text-lg text-gray-800">{testimonial.name}</h3>
            <p className="text-blue-600 text-sm">{testimonial.route}</p>
          </div>
        </div>
        <FaQuoteLeft className="text-blue-200 mb-2" size={24} />
        <p className="text-gray-600 mb-4">{testimonial.text}</p>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`${index < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const testimonials = [
    {
      name: "Thilini Perera",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaaGImkf9xWZUWl48DD8IsggmV_9Y5Q-JI7Q&s", 
      route: "Colombo to Kandy",
      text: "The online booking system was very user-friendly. I had no issues booking my tickets, and the train ride was comfortable.",
      rating: 5
    },
    {
      name: "Nuwan Silva",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQChrt9cqNsOeQVohSIErCuyk9vjpIat8tE6Q&s",
      route: "Galle to Ella",
      text: "The scenic route was amazing, and the booking process was smooth. Highly recommend it!",
      rating: 4
    },
    {
      name: "Chaminda Fernando",
      image: "https://s3.amazonaws.com/bizenglish/wp-content/uploads/2023/08/29121357/Chaminda-Rajapakshe-e1693291467291.jpg", 
      route: "Anuradhapura to Jaffna",
      text: "Great service and comfortable journey. The online booking system made it very convenient.",
      rating: 5
    },
    {
      name: "Shashika Weerasinghe",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCS0K8ex60wVKZ4HvMeflBTXFv7rUS43y4BQ&s", 
      route: "Matara to Badulla",
      text: "The train was clean, and the booking process was straightforward. Will use it again.",
      rating: 4
    }
  ];
  

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    let interval;
    if (isAutoplay) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, nextSlide]);

  const getVisibleTestimonials = () => {
    const screenWidth = window.innerWidth;
    let visibleCount = 1;

    if (screenWidth >= 1024) visibleCount = 3;
    else if (screenWidth >= 768) visibleCount = 2;

    let testimonialsList = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % testimonials.length;
      testimonialsList.push(testimonials[index]);
    }
    return testimonialsList;
  };

  return (
    <div
      className="bg-gradient-to-b from-blue-50 to-white py-16 px-4"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Passengers Say</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-blue-50 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="text-blue-500" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={index}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-blue-50 focus:outline-none"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="text-blue-500" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-blue-500 w-6" : "bg-blue-200"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;