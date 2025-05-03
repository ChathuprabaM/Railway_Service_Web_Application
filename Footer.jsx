import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPaperPlane
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <>
      {/* Newsletter Section */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row justify-between items-center gap-8"
        >
          {/* Title */}
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2"
          >
            <FaEnvelope className="text-yellow-300" /> Subscribe to Our Newsletter
          </motion.h2>

          {/* Input and button */}
          <motion.div
            className="flex w-full lg:w-auto shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <input
              type="email"
              className="flex-grow p-4 rounded-l-full text-gray-700 focus:outline-none"
              placeholder="Enter your email"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-4 rounded-r-full font-semibold transition duration-300 flex items-center gap-2">
               <FaPaperPlane />
            </button>
          </motion.div>
        </motion.div>
   
    </div>
      </footer>

      {/* Main Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Contact Us */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
              <address className="not-italic text-gray-300">
                Sri Lanka Railways Headquarters,
                <br />
                Colombo 10, Sri Lanka
              </address>
              <a
                href="tel:+94114600111"
                className="block text-gray-300 mt-2 hover:text-green-400 transition"
              >
                +94 11 4 600 111
              </a>
              <a
                href="mailto:info@srilanka.railways"
                className="block text-gray-300 mt-2 hover:text-green-400 transition"
              >
                info@srilanka.railways
              </a>
            </div>

            {/* Information Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Information</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="hover:text-green-400 transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-condition"
                    className="hover:text-green-400 transition"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-green-400 transition">
                    Blogs
                  </a>
                </li>
              </ul>
            </div>

            {/* Account Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="hover:text-green-400 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-green-400 transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-green-400 transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/ticket-booking"
                    className="hover:text-green-400 transition"
                  >
                    Ticket Booking
                  </a>
                </li>
                <li>
                  <a
                    href="/season-tickets"
                    className="hover:text-green-400 transition"
                  >
                    Season Tickets
                  </a>
                </li>
                <li>
                  <a
                    href="/accommodation"
                    className="hover:text-green-400 transition"
                  >
                    Accommodation & Hotels
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Social Media & Credits */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col lg:flex-row justify-between items-center gap-6"
          >
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 text-2xl transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-300 text-2xl transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 text-2xl transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 text-2xl transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="mailto:info@srilanka.railways"
                className="text-gray-400 hover:text-green-400 text-2xl transition"
              >
                <FaEnvelope />
              </a>
            </div>
            <p className="text-center text-sm lg:text-base">
              &copy; {new Date().getFullYear()} Powered by RailMate
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
