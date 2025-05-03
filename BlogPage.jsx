import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import b1 from "../images/blog/blog1.jpg";
import s2 from "../images/blog/b2.jpg";
import s3 from "../images/blog/b5.jpg";
import s4 from "../images/blog/b4.jpg";
import Container from '../components/Container';
import { motion } from 'framer-motion'; 

const BlogPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Update to store the clicked blog's data

  const blogData = [
    {
      img: b1,
      date: "August 10, 2024",
      title: "Why Digital Ticketing is the Future of Sri Lanka Railways",
      desc: "An in-depth look at how digital ticketing benefits both passengers and the railway system by reducing wait times, simplifying renewals, and improving convenience.",
      fullContent: "This blog post will explore in detail how digital ticketing in Sri Lanka is revolutionizing the railway system, bringing greater convenience, faster service, and more efficiency to both passengers and operators."
    },
    {
      img: s2,
      date: "August 10, 2024",
      title: "Enhancing Commuter Experience: Real-Time Train Schedule Updates",
      desc: "Explore how real-time updates and notifications within the Railmate app help commuters stay on track with up-to-date arrival and departure times.",
      fullContent: "In this article, we’ll take a closer look at the importance of real-time train schedule updates and how they’re changing the way commuters plan their journeys in Sri Lanka."
    },
    {
      img: s3,
      date: "August 10, 2024",
      title: "How Railmate’s Accommodation Finder Makes Travel Planning Easier",
      desc: "An overview of how the Railmate app's accommodation finder helps travelers locate hotels and stays near railway stations, making travel more convenient.",
      fullContent: "Railmate’s accommodation finder is transforming the travel experience by helping users find the best places to stay near train stations, offering them the convenience they need."
    },
    {
      img: s4,
      date: "August 10, 2024",
      title: "The Ultimate Guide to Using the Railmate Website for Seamless Travel",
      desc: "Step-by-step guide on how to use the Railmate website for booking tickets, checking schedules, and accessing special features for a smooth travel experience.",
      fullContent: "The Railmate website is a comprehensive tool for travelers, and this guide will show you how to fully utilize all its features for an easy and seamless travel experience."
    },
  ];

  const openModal = (blog) => {
    setModalContent(blog); // Set the clicked blog data as modal content
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null); // Reset modal content when closing
  };

  return (
    <>
      <Container class1="blog-wrapper home-wrapper-2 py-10 px-5 sm:px-10 lg:px-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="col-span-1 md:col-span-6 ml-10">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {blogData.map((blog, index) => (
                <div key={index} className="mb-6">
                  <motion.div
                    className="relative group cursor-pointer"
                    onClick={() => openModal(blog)} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-4 rounded-xl shadow-lg transform transition-all">
                      <img
                        src={blog.img}
                        alt={blog.title}
                        className="w-full h-56 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-white text-lg font-bold">{blog.title.length > 10 ? blog.desc.substring(0, 20) + "..." : blog.title}</h3>
                      <p className="text-white text-sm">{blog.desc.length > 100 ? blog.desc.substring(0, 50) + "..." : blog.desc}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gray-300">{blog.date}</span>
                        <FaArrowRight className="text-white text-xl" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-30  opacity-0 transition-all duration-300"></div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {/* Blog Modal */}
      {showModal && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 lg:w-1/2 p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-2">{modalContent.title}</h2>
              <p>{modalContent.fullContent}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogPage;
