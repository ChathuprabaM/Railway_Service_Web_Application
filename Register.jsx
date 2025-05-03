import React from 'react';
import Lottie from 'react-lottie';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import a Lottie animation (make sure to replace with your own)
import animationData from './assets/lottie-signup-animation.json'; // Replace with your own Lottie JSON

// Components for the form inputs
import CustomerInput from '../components/CustomerInput';
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import Container from '../components/Container';

const Signup = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <Meta title={"Sign Up"} />
      <BreadCrumb title="Sign Up" />

      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <motion.div
              className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid lg:grid-cols-2 grid-cols-1">
                {/* Left Card with Lottie Animation */}
                <div className="bg-blue-500 p-8 flex justify-center items-center">
                  <Lottie options={defaultOptions} height={300} width={300} />
                </div>

                {/* Right Card with Sign Up Form */}
                <div className="p-8 flex justify-center items-center">
                  <div className="w-full max-w-md space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Your Account</h3>
                    
                    {/* Sign Up Form */}
                    <form className="space-y-4">
                      <CustomerInput
                        type="text"
                        name="Fname"
                        placeholder="First Name"
                        icon={<FaUser />}
                      />
                      <CustomerInput
                        type="text"
                        name="Lname"
                        placeholder="Last Name"
                        icon={<FaUser />}
                      />
                      <CustomerInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        icon={<FaEnvelope />}
                      />
                      <CustomerInput
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        icon={<FaPhone />}
                      />
                      <CustomerInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        icon={<FaLock />}
                      />

                      {/* Submit Button */}
                      <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                        <button type="submit" className="button border-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                          Create Account
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Signup;
