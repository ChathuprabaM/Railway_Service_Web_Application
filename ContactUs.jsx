import React, { useState } from "react";
import { FaPhoneAlt,FaInfo, FaMap } from "react-icons/fa";
import Lottie from "react-lottie";
import { motion } from "framer-motion";
import animationData from "../raw/contactanimation.json"; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, 
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.message) errors.message = "Message is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <Lottie options={{ animationData, loop: true, autoplay: true }} height="100%" width="100%" />
      </div>

      <motion.div
        className="text-center mt-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-extrabold text-gray-700 drop-shadow-lg transform transition duration-500 ease-in-out hover:scale-110">
          Let's Connect
        </h1>
        <p className="text-lg text-gray-600 mt-2 opacity-80">We'd love to hear from you. Drop us a message!</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row w-full max-w-screen-xl gap-10">

        <motion.div
          className="w-full lg:w-1/3 bg-white p-8 rounded-xl shadow-xl hover:scale-105 transform transition duration-500"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-5">Contact Details</h2>
          <div className="flex items-center mb-4 hover:text-blue-500 transition duration-300">
            <FaPhoneAlt className="text-4xl text-blue-600 mr-4" />
            <span className="text-lg text-gray-700"> +94 11 4 600 111</span>
          </div>
          <div className="flex items-center mb-4 hover:text-blue-500 transition duration-300">
            <FaInfo className="text-4xl text-blue-600 mr-4" />
            <span className="text-lg text-gray-700">Monday-Friday  10 AM -8 PM</span>
          </div>
          <div className="flex items-center mb-4 hover:text-blue-500 transition duration-300">
            <FaMap className="text-4xl text-blue-600 mr-4" />
            <span className="text-lg text-gray-700"> Sri Lanka Railways Sri Lanka Railways Headquarters, Colombo 10 ,Sri Lanka</span>
          </div>

          <div className="flex items-center mb-4 hover:text-blue-500 transition duration-300">

            <Lottie options={{ animationData, loop: true, autoplay: true }} height="120%" width="100%" />
            
          </div>

        </motion.div>

        <motion.div
          className="w-full lg:w-2/3 bg-white p-8 rounded-xl shadow-xl hover:scale-105 transform transition duration-500"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-5">Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="p-4 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {formErrors.name && <span className="absolute text-red-500 text-sm">{formErrors.name}</span>}
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="p-4 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && <span className="absolute text-red-500 text-sm">{formErrors.email}</span>}
              </div>
              <div className="relative">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message"
                  className="p-4 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  value={formData.message}
                  onChange={handleInputChange}
                />
                {formErrors.message && <span className="absolute text-red-500 text-sm">{formErrors.message}</span>}
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transform transition-all hover:bg-blue-700 hover:scale-105"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <div className="w-full mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-600 mb-5">Our Location</h2>
        <div className="w-full h-96 bg-gray-300 rounded-xl shadow-xl overflow-hidden">
        <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6564279524914!2d79.85764507448283!3d6.931604918287424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591a5e7013f5%3A0x78dae6d63e1f980f!2sSri%20Lanka%20Railway%20Head%20Quarters!5e0!3m2!1sen!2slk!4v1730613052060!5m2!1sen!2slk"
  width="100%"
  height="100%"
  frameBorder="0"
  style={{ border: 0 }}
  allowFullScreen=""
  aria-hidden="false"
  tabIndex="0"
  title="Google Maps - Sri Lanka Railway Head Quarters"
/>

        </div>
      </div>

     
    </div>
  );
};

export default ContactUs;
