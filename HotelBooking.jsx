import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDqKGq46IoIH9niBllskGCvYzcEFnKN3C8",
  authDomain: "lms-02-7f92a.firebaseapp.com",
  databaseURL: "https://lms-02-7f92a-default-rtdb.firebaseio.com",
  projectId: "lms-02-7f92a",
  storageBucket: "lms-02-7f92a.appspot.com",
  messagingSenderId: "117398270755",
  appId: "1:117398270755:web:d4e2f91b3fca3b02585296",
  measurementId: "G-18XNH5VWW1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function HotelBooking() {
  const [accommodations, setAccommodations] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchAccommodations = async () => {
      const accommodationsRef = dbRef(database, 'accommodations');
      const snapshot = await get(accommodationsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const accommodationsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAccommodations(accommodationsArray);
      }
    };
    fetchAccommodations();
  }, []);

  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  const handleBookNow = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-blue-50">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {accommodations.map((accommodation, index) => (
        <div 
          key={accommodation.id} 
          className="group relative flex justify-center transition-all duration-300 hover:-translate-y-2"
        >
          {/* Card Container */}
          <div className="w-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={accommodation.photos?.[0] || 'https://source.unsplash.com/random/800x600?hotel'}
                alt={accommodation.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {accommodation.isFeatured && (
                  <span className="px-3 py-1 bg-amber-400 text-xs font-bold uppercase tracking-wide text-black rounded-full">
                    Featured
                  </span>
                )}
                {accommodation.discount && (
                  <span className="px-3 py-1 bg-red-500 text-xs font-bold text-white rounded-full">
                    {accommodation.discount}% OFF
                  </span>
                )}
              </div>
              
              {/* Favorite Button */}
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
  
            {/* Content Section */}
            <div className="p-6">
              {/* Rating and Category */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < accommodation.rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {accommodation.rating} ({accommodation.reviews} reviews)
                  </span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {accommodation.type}
                </span>
              </div>
  
              {/* Title and Location */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {accommodation.name}
              </h3>
              <div className="flex items-center text-gray-500 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="truncate">{accommodation.address}</span>
              </div>
  
              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-6">
                {accommodation.amenities?.slice(0, 3).map(amenity => (
                  <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
  
              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    $ 10
                    <span className="text-sm font-normal text-gray-500"> / night</span>
                  </p>
                  {accommodation.previousPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      $ 10
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleBookNow(accommodation.bookingUrl)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default HotelBooking;
