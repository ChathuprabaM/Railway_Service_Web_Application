import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaUsers,
  FaIdCard,
  FaPhoneAlt,
  FaUserFriends,
  FaArrowRight,
} from "react-icons/fa";

const GenerateQR = () => {
  const { state } = useLocation();

  if (!state) {
    return <div className="text-center text-lg text-gray-600">No data found!</div>;
  }

  const {
    NIC,
    mobileNumber,
    from,
    to,
    date,
    journeyTime,
    returnTrip,
    returnDate,
    passengers,
    class: classType,
    price,
  } = state.generalFormData;

  
  const qrData = JSON.stringify({
    NIC,
    mobileNumber,
    from,
    to,
    date,
    journeyTime,
    returnTrip,
    returnDate,
    passengers,
    classType,
    price,

  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center justify-center p-6">
      {/* Title Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-700 drop-shadow-lg">
          Your Booking Details
        </h1>
        <p className="text-lg text-gray-600 mt-2 opacity-80">
          Scan the QR code or review your journey details below.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-5xl space-y-8 md:space-y-0 md:space-x-8">
        {/* Left Side: Passenger Details */}
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/2 flex flex-col relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Passenger Details</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center">
                <FaIdCard className="text-blue-500 mr-2" />
                <span className="font-medium">NIC:</span> {NIC}
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-green-500 mr-2" />
                <span className="font-medium">Mobile:</span> {mobileNumber}
              </div>
              <div className="flex items-center">
                <FaTicketAlt className="text-purple-500 mr-2" />
                <span className="font-medium">From:</span> {from} <FaArrowRight className="mx-2" /> {to}
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-orange-500 mr-2" />
                <span className="font-medium">Date:</span> {date} ({journeyTime})
              </div>
              {returnTrip && (
                <div className="flex items-center">
                  <FaCalendarAlt className="text-red-500 mr-2" />
                  <span className="font-medium">Return Date:</span> {returnDate}
                </div>
              )}
              <div className="flex items-center">
                <FaUsers className="text-yellow-500 mr-2" />
                <span className="font-medium">Passengers:</span> {passengers}
              </div>
              <div className="flex items-center">
                <FaUserFriends className="text-cyan-500 mr-2" />
                <span className="font-medium">Class:</span> {classType}
              </div>
              <div className="flex items-center">
                <FaTicketAlt className="text-indigo-500 mr-2" />
                <span className="font-medium">Price:</span> Rs.{price}
              </div>
            </div>
          </div>
          {/* Decorative Image */}
          <div className="absolute bottom-2 right-1">
            <img
              src="https://i.ibb.co/xLnjwrs/booked.png"
              width={350}
              alt="Passenger Avatar"
              className="rounded-full"
            />
          </div>
        </motion.div>

        {/* Right Side: QR Code Section */}
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/2 flex flex-col items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your QR Code</h3>
          <div className="bg-gray-100 shadow-md p-4 rounded-lg">
            <QRCodeCanvas value={qrData} size={256} />
          </div>
          <button
            onClick={() => {
              const canvas = document.querySelector("canvas");
              const url = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = url;
              link.download = "qr-code.png";
              link.click();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Download QR Code
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default GenerateQR;
