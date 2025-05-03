import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaArrowRight, FaTicketAlt, FaCalendarAlt, FaUsers, FaIdCard, FaPhoneAlt, FaUserFriends } from 'react-icons/fa'; // Import icons

const PaymentPage = () => {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 flex justify-center items-center p-6">
            <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
                {/* Header */}
                <motion.h1
                    className="text-4xl font-bold text-center text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <span className="text-green-600">Payment</span> Information
                </motion.h1>

                {/* Display Form Data */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><FaIdCard className="inline-block mr-2 text-green-600" /><strong>NIC/Passport Number:</strong> {NIC}</div>
                        <div><FaPhoneAlt className="inline-block mr-2 text-green-600" /><strong>Mobile Number:</strong> {mobileNumber}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><FaArrowRight className="inline-block mr-2 text-green-600" /><strong>From:</strong> {from}</div>
                        <div><FaArrowRight className="inline-block mr-2 text-green-600" /><strong>To:</strong> {to}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><FaCalendarAlt className="inline-block mr-2 text-green-600" /><strong>Date:</strong> {date}</div>
                        <div><FaTicketAlt className="inline-block mr-2 text-green-600" /><strong>Journey Time:</strong> {journeyTime}</div>
                    </div>
                    {returnTrip && <div><strong>Return Trip Date:</strong> {returnDate}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><FaUsers className="inline-block mr-2 text-green-600" /><strong>Passengers:</strong> {passengers}</div>
                        <div><strong><FaUserFriends className="inline-block mr-2 text-green-600" />Class:</strong> {classType}</div>
                    </div>
                    <div className='text-red-600' ><strong>Price:</strong>Rs. {price}</div>
                </motion.div>

                <motion.div
                    className="bg-green-50 p-6 rounded-lg shadow-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-800">Complete Your Payment</h2>
                    <p className="text-sm text-gray-600 mb-4">Please confirm your details and proceed with payment.</p>

                    <PayPalScriptProvider options={{ "client-id": "AZqCeLC0JuPUtKfttEa0NZ4ATadKpBC6xZWsccvjGa5bNX_yaeKIwpYSfT6vwNa5jdSgF23ZipTHyP1H" }}>
                        <PayPalButtons
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: price, // Use dynamic price
                                        },
                                    }],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                    alert("Transaction completed by " + details.payer.name.given_name);
                                });
                            }}
                            onError={(err) => {
                                console.log("PayPal Error", err);
                            }}
                        />
                    </PayPalScriptProvider>
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <p className="text-sm text-gray-500">Your transaction is secured. Thank you for choosing us!</p>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentPage;
