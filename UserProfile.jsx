import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaUser, FaEnvelope, FaPhoneAlt, FaSignOutAlt, FaCamera, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const auth = getAuth();
  const database = getDatabase();
  const storage = getStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
            setProfilePicURL(data.profilePicURL);
            setQrCodeUrl(data.qrCodeUrl);
          } else {
            console.log("No user data found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserData(null);
        setQrCodeUrl(null);
      }
    });

    return () => unsubscribe();
  }, [auth, database]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Logged out", "You have been logged out successfully!", "success");
      navigate('/login');
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleProfileUpdate = async () => {
    const user = auth.currentUser;
    if (user && userData) {
      const userRef = ref(database, `users/${user.uid}`);
      let updatedData = { ...userData };

      if (profilePic) {
        const storageRefPic = storageRef(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRefPic, profilePic);
        const url = await getDownloadURL(storageRefPic);
        //get access tocken Url
        updatedData.profilePicURL = url;
      }

      try {
        await update(userRef, updatedData);
        setUserData(updatedData);
        setProfilePicURL(updatedData.profilePicURL);
        setIsEditing(false);
        Swal.fire("Success", "Profile updated successfully!", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleDownloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="w-full md:w-1/4 bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">User Dashboard</h2>
          <motion.button
            className="text-red-500 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            onClick={handleLogout}
          >
            <FaSignOutAlt />
          </motion.button>
        </div>
        <div className="space-y-2">
          <button
            className={`w-full py-2 px-4 rounded-md ${activeTab === "profile" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`w-full py-2 px-4 rounded-md ${activeTab === "tickets" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("tickets")}
          >
            Tickets
          </button>
        </div>
      </div>

      <div className="w-full md:w-3/4 p-6">
        {activeTab === "profile" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">User Profile</h2>
            {userData ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-3 p-3 border rounded-md shadow-sm">
                  {profilePicURL ? (
                    <img src={profilePicURL} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <FaUser className="text-green-500 text-5xl" />
                  )}
                  {isEditing && (
                    <label className="cursor-pointer flex items-center space-x-2 text-green-500">
                      <FaCamera />
                      <span>Upload Photo</span>
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-md shadow-sm">
                  <FaUser className="text-green-500" />
                  <span className="text-gray-700">{userData.firstName} {userData.lastName}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-md shadow-sm">
                  <FaEnvelope className="text-green-500" />
                  <span className="text-gray-700">{userData.email}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-md shadow-sm">
                  <FaPhoneAlt className="text-green-500" />
                  <span className="text-gray-700">{userData.phone || "N/A"}</span>
                </div>
                {!isEditing ? (
                  <motion.button
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </motion.button>
                ) : (
                  <motion.button
                    className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </motion.button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">Loading user data...</p>
            )}
          </div>
        )}
        {activeTab === "tickets" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Tickets</h2>
            {qrCodeUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                <motion.button
                  className="flex items-center space-x-2 text-green-500 hover:text-green-600"
                  whileHover={{ scale: 1.1 }}
                  onClick={handleDownloadQRCode}
                >
                  <FaDownload />
                  <span>Download QR Code</span>
                </motion.button>
              </div>
            ) : (
              <p className="text-center text-gray-500">No QR code available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
