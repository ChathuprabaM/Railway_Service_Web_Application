import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { FaLocationArrow, FaSearch, FaTrain } from 'react-icons/fa';

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

function TrainSchedule() {
  const [trainDetails, setTrainDetails] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    arrivalStation: '',
    departureStation: '',
    trainName: ''
  });

  useEffect(() => {
    fetchTrainSchedules();
  }, []);

  const fetchTrainSchedules = async () => {
    const trainRef = ref(database, 'trainSchedules');
    try {
      const snapshot = await get(trainRef);
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        setTrainDetails(data);
        setFilteredTrains(data);
      }
    } catch (error) {
      console.error("Error fetching train schedules:", error);
    }
  };

  const handleSearch = () => {
    const filteredData = trainDetails.filter(train => 
      (searchQuery.arrivalStation ? train.arrivalStation.toLowerCase().includes(searchQuery.arrivalStation.toLowerCase()) : true) &&
      (searchQuery.departureStation ? train.departureStation.toLowerCase().includes(searchQuery.departureStation.toLowerCase()) : true) &&
      (searchQuery.trainName ? train.trainName.toLowerCase().includes(searchQuery.trainName.toLowerCase()) : true)
    );
    setFilteredTrains(filteredData);
  };

  return (
    <div className="min-h-screen  p-6 flex flex-col items-center">
      {/* Search Bar */}
      <div className="bg-white shadow-xl rounded-lg p-6 flex flex-wrap items-center w-full max-w-4xl mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <FaLocationArrow className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          <input
            type="text"
            className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Arrival Station"
            value={searchQuery.arrivalStation}
            onChange={(e) => setSearchQuery({ ...searchQuery, arrivalStation: e.target.value })}
          />
        </div>
        <div className="relative flex-1">
          <FaLocationArrow className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          <input
            type="text"
            className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Departure Station"
            value={searchQuery.departureStation}
            onChange={(e) => setSearchQuery({ ...searchQuery, departureStation: e.target.value })}
          />
        </div>
        <div className="relative flex-1">
          <FaTrain className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          <input
            type="text"
            className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Train Name"
            value={searchQuery.trainName}
            onChange={(e) => setSearchQuery({ ...searchQuery, trainName: e.target.value })}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 flex items-center transition-transform transform hover:scale-105"
        >
          <FaSearch className="mr-2" /> Search
        </button>
      </div>

      {/* Train Schedule Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredTrains.map((train, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-800">{train.trainName}</h2>
            <p className="text-gray-600">Departure: {train.departureStation} at {train.departure}</p>
            <p className="text-gray-600">Arrival: {train.arrivalStation} at {train.arrival}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainSchedule;
