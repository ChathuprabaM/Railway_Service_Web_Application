import React, { useState } from "react";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaBuilding,
  FaEnvelope,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref as dbRef,
  push,
  set,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getStorage as getFirebaseStorage,
} from "firebase/storage";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getFirebaseStorage(app);

const RailwayFilmingRequest = () => {
  const [file, setFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire("Error", "Please upload a file.", "error");
      return;
    }

    try {
      const fileRef = storageRef(storage, `filmingRequests/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);

      const downloadURL = await getDownloadURL(fileRef);
      const newRequestRef = push(dbRef(database, "filmingRequests"));

      await set(newRequestRef, {
        companyName,
        companyEmail,
        fileURL: downloadURL,
        timestamp: new Date().toISOString(),
        status :"pending"
      });

      Swal.fire("Success", "Form submitted successfully!", "success");
      setCompanyName("");
      setCompanyEmail("");
      setFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Failed to submit the form. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div className="bg-gradient-to-b from-blue-600 to-blue-400 p-10 flex flex-col justify-center items-center text-white space-y-6">
          <h2 className="text-3xl font-bold text-center leading-tight">
            Download the Railway Premises Filming Request Form
          </h2>
          <p className="text-lg text-center">
            Please download the form, fill in the required details, and upload it using the form on the right.
          </p>
          <a
            href="./Application.docx"
            download
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition-all duration-300"
          >
            <FaDownload className="text-2xl" /> Download Form
          </a>
        </div>

        <div className="p-10 bg-gray-50 flex flex-col justify-center space-y-8">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Upload Your Completed Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaBuilding className="absolute top-4 left-4 text-gray-400 text-lg" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                required
                className="w-full pl-12 p-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-4 text-gray-400 text-lg" />
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Company Email"
                required
                className="w-full pl-12 p-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
            </div>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-400 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all shadow-inner">
              <FaCloudUploadAlt className="text-6xl text-blue-500" />
              <p className="mt-4 text-gray-600 font-medium">
                {file ? file.name : "Click to upload your completed form"}
              </p>
              <input
                type="file"
                required
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RailwayFilmingRequest;