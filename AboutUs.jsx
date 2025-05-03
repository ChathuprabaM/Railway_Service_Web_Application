import React from "react";
import { Link } from "react-router-dom";
import { FiTarget, FiClock, FiSmile } from "react-icons/fi";
import { motion } from "framer-motion";
import a1 from "../images/about/ab.jpg";
import a2 from "../images/about/history.jpg";

const AboutUs = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="py-12 bg-gradient-to-br from-gray-800 to-gray-900 text-center shadow-lg relative">
        <motion.h1
          className="text-5xl font-extrabold tracking-wide text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h1>
        <motion.p
          className="text-lg mt-3 max-w-2xl mx-auto opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Discover a variety of options tailored to meet your travel needs.
        </motion.p>
      </header>

      {/* Highlights Section */}
      <motion.section
        className="relative py-16 bg-gradient-to-r from-blue-50 to-purple-50  px-6 md:px-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: FiTarget,
              title: "Our Mission",
              description:
                "To create meaningful experiences for customers through innovation and integrity.",
            },
            {
              icon: FiClock,
              title: "Our Vision",
              description:
                "To be a global leader, inspiring progress and shaping a better future.",
            },
            {
              icon: FiSmile,
              title: "Our Values",
              description:
                "Integrity, customer focus, and innovation are at the heart of what we do.",
            },
          ].map((highlight, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-full mx-auto mb-4">
                <highlight.icon className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-teal-400">
                {highlight.title}
              </h3>
              <p className="mt-4 text-gray-400">{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Cards Section */}
      <section className="py-16 px-6 md:px-16 bg-gray-900">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
        >
          {[
            { img: a1, title: "Overview", link: "/overview" },
            { img: a2, title: "Our History", link: "/history" },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="relative bg-black group rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-500"
              variants={itemVariants}
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-56 object-cover opacity-90 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900 group-hover:from-teal-700/60 transition duration-500"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">{card.title}</h3>
                <p className="mt-2">
                  {card.title === "Overview"
                    ? "Discover our essence and learn what makes us unique."
                    : "Explore our journey from humble beginnings to impactful milestones."}
                </p>
                <Link
                  to={card.link}
                  className="mt-4 inline-block text-teal-400 hover:text-teal-200 font-bold"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
