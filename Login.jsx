import React, { useState, } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import animationData from "../raw/login_lottie.json";
import Lottie from "react-lottie";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqKGq46IoIH9niBllskGCvYzcEFnKN3C8",
  authDomain: "lms-02-7f92a.firebaseapp.com",
  databaseURL: "https://lms-02-7f92a-default-rtdb.firebaseio.com",
  projectId: "lms-02-7f92a",
  storageBucket: "lms-02-7f92a.appspot.com",
  messagingSenderId: "117398270755",
  appId: "1:117398270755:web:d4e2f91b3fca3b02585296",
  measurementId: "G-18XNH5VWW1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const App = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, password, confirmPassword } =
      formData;

    if (isSignup) {
      if (password !== confirmPassword) {
        Swal.fire("Error", "Passwords do not match!", "error");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Save user data to Realtime Database
        await set(ref(database, `users/${user.uid}`), {
          firstName,
          lastName,
          email,
          phone,
        });

        Swal.fire("Success", "Account created successfully!", "success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setIsSignup(false);
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    } else {
      try {
          await signInWithEmailAndPassword(auth, email, password);
      Swal.fire("Success", "Logged in successfully!", "success");
      navigate("/home");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen shadow-lg">
      <motion.div
        className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="bg-gradient-to-b from-blue-300 to-blue-300 p-8 flex justify-center items-center">
            <Lottie options={defaultOptions} height={400} width={430} />
          </div>

          <div className="p-8 flex justify-center bg-gray-100 items-center bg-gray-50">
            <div className="w-full max-w-md space-y-6">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                {isSignup ? "Sign Up" : "Log In"}
              </h2>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  className={`w-1/2 py-2 px-4 ${
                    !isSignup
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded-md hover:bg-blue-600 transition duration-300`}
                  onClick={() => setIsSignup(false)}
                >
                  Login
                </button>
                <button
                  className={`w-1/2 py-2 px-4 ${
                    isSignup
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded-md hover:bg-blue-600 transition duration-300`}
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignup && (
                  <>
                    <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                      <FaUser className="text-gray-500 mr-2" />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full outline-none bg-transparent text-gray-700"
                      />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                      <FaUser className="text-gray-500 mr-2" />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full outline-none bg-transparent text-gray-700"
                      />
                    </div>
                  
                    <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                      <FaPhoneAlt className="text-gray-500 mr-2" />
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full outline-none bg-transparent text-gray-700"
                      />
                    </div>
                  </>
                )}
                <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {isSignup && (
                  <div className="flex items-center border border-gray-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                    <FaLock className="text-gray-500 mr-2" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full outline-none bg-transparent text-gray-700"
                    />
                  </div>
                )}
                <motion.button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {isSignup ? "Sign Up" : "Log In"}
                </motion.button>
              </form>

              {!isSignup && (
                <div className="text-center mt-4">
                  <a href="/home" className="text-blue-500 hover:text-blue-600">
                    Forgot your password?
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
