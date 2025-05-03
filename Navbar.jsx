import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaInfoCircle,
  FaTrain,
  FaBlog,
  FaPhoneAlt,
  FaUser,
  FaTimes,
  FaBeer,
  FaInfo,
  FaAccusoft,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setProfilePicURL(userData.profilePicURL);
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
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
        setProfilePicURL(null);
      }
    });

    return () => unsubscribe();
  }, [auth, database]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="text-2xl font-bold flex items-center space-x-2">
          <span className="text-blue-300 animate-pulse">🚂</span>
          <span>
            <NavLink to="/home">RailMate</NavLink>
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {[
            { icon: FaHome, label: "HOME", path: "/home" },
            { icon: FaAccusoft, label: "ABOUT", path: "/about" },
            { icon: FaTrain, label: "OUR SERVICE", path: "/ourservice" },
            { icon: FaBlog, label: "BLOGS", path: "/blogs" },
            { icon: FaPhoneAlt, label: "CONTACT", path: "/contact" },
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 hover:text-blue-300 cursor-pointer transition transform hover:scale-105"
            >
              {React.createElement(item.icon)}
              <span>
                <NavLink className="text-white" to={item.path}>
                  {item.label}
                </NavLink>
              </span>
            </li>
          ))}
        </ul>

        {/* Login/Profile Button */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src={profilePicURL || "https://cdn.pixabay.com/photo/2013/07/13/10/44/man-157699_1280.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={handleProfileClick}
              />
            </div>
          ) : (
            <button className="bg-blue-400 text-black px-4 py-2 rounded-md shadow-md hover:bg-blue-500 transition duration-300 flex items-center space-x-2 transform hover:scale-105">
              <FaUser />
              <span>
                <NavLink to="/login">LOGIN</NavLink>
              </span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white text-2xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="flex flex-col items-center space-y-6 py-6">
          {[
            { icon: FaHome, label: "HOME", path: "/home" },
            { icon: FaInfoCircle, label: "ABOUT", path: "/about" },
            { icon: FaTrain, label: "OUR SERVICE", path: "/ourservice" },
            { icon: FaBlog, label: "BLOGS", path: "/blogs" },
            { icon: FaPhoneAlt, label: "CONTACT", path: "/contact" },
          ].map((item, index) => (
            <li
              key={index}
              onClick={handleNavClick}
              className="flex items-center space-x-3 text-blue-300 cursor-pointer hover:text-white transition transform hover:scale-105"
            >
              {React.createElement(item.icon)}
              <span>
                <NavLink to={item.path}>{item.label}</NavLink>
              </span>
            </li>
          ))}
          <li>
            {user ? (
              <div className="flex items-center space-x-2">
                <img
                  src={profilePicURL || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={handleProfileClick}
                />
              </div>
            ) : (
              <button
                onClick={handleNavClick}
                className="bg-blue-400 text-black px-4 py-2 rounded-md shadow-md hover:bg-blue-500 transition duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <FaUser />
                <span>
                  <NavLink to="/login">LOGIN</NavLink>
                </span>
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
