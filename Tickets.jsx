import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Select from 'react-select';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import QRCode from 'qrcode';
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, push, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


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
const storage = getStorage(app);

function Tickets() {
  const [activeTab, setActiveTab] = useState("general");
  const [generalFormData, setGeneralFormData] = useState({
    NIC: '',
    mobileNumber: '',
    email: '',
    from: '',
    to: '',
    date: '',
    journeyTime: '',
    returnTrip: false,
    returnDate: '',
    passengers: 1,
    class: 'Second Class',
  });

  const [warrantFormData, setWarrantFormData] = useState({
    NIC: '',
    mobileNumber: '',
    email: '',
    warrantNumber: '',
    dateOfIssue: '',
    from: '',
    to: '',
    passengers: 1,
    class: 'Second Class',
  });

  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [stationOptions, setStationOptions] = useState([]);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetch('/json/stations.json')
      .then(response => response.json())
      .then(data => {
        const options = data.stations.map(station => ({
          value: station.name,
          label: station.name,
        }));
        setStationOptions(options);
      })
      .catch(error => console.error('Error fetching station data:', error));
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e, isGeneral = false) => {
    const { name, value } = e.target;
    if (isGeneral) {
      setGeneralFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setWarrantFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleStationChange = (selectedOption, isGeneral = false, fieldName) => {
    if (isGeneral) {
      setGeneralFormData((prevData) => ({
        ...prevData,
        [fieldName]: selectedOption ? selectedOption.value : '',
      }));
    } else {
      setWarrantFormData((prevData) => ({
        ...prevData,
        [fieldName]: selectedOption ? selectedOption.value : '',
      }));
    }
  };

  const createPaymentIntent = async (amount) => {
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
},
        body: `amount=${amount}&currency=usd`,
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      return data;
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      throw error;
    }
  };

  const sendEmail = async (formData, qrCodeUrl) => {
    const response = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formData.email,
        subject: 'Railway Booking Confirmation',
        text: `
          Passenger: ${formData.NIC}
          Mobile: ${formData.mobileNumber}
          From: ${formData.from}
          To: ${formData.to}
          Date: ${formData.date}
          Journey Time: ${formData.journeyTime}
          Return Trip: ${formData.returnTrip ? 'Yes' : 'No'}
          Return Date: ${formData.returnDate}
          Passengers: ${formData.passengers}
          Class: ${formData.class}
        `,
        qrCodeUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const result = await response.text();
    console.log(result);
  };

  const storeBookingData = async (formData, qrCodeUrl) => {
    const bookingRef = dbRef(database, 'bookings');
    const newBookingRef = push(bookingRef);
    await set(newBookingRef, {
      ...formData,
      qrCodeUrl,
    });
  };

  const uploadQRCodeToStorage = async (qrCodeDataUrl) => {
    const response = await fetch(qrCodeDataUrl);
    const blob = await response.blob();
    const qrCodeRef = storageRef(storage, `qr_codes/${Date.now()}.png`);
    await uploadBytes(qrCodeRef, blob);
    const downloadUrl = await getDownloadURL(qrCodeRef);
    return downloadUrl;
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const paymentIntent = await createPaymentIntent(5000); // Replace with your amount
      setPaymentIntent(paymentIntent);

      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: generalFormData.NIC,
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        setPaymentSuccess(false);
      } else {
        setPaymentError(null);
        setPaymentSuccess(true);
        console.log('General form submitted:', generalFormData);
        console.log('PaymentIntent:', confirmedPaymentIntent);

        // Generate QR code
        const qrData = `
          Passenger: ${generalFormData.NIC}
          Mobile: ${generalFormData.mobileNumber}
          From: ${generalFormData.from}
          To: ${generalFormData.to}
          Date: ${generalFormData.date}
          Journey Time: ${generalFormData.journeyTime}
          Return Trip: ${generalFormData.returnTrip ? 'Yes' : 'No'}
          Return Date: ${generalFormData.returnDate}
          Passengers: ${generalFormData.passengers}
          Class: ${generalFormData.class}
        `;
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        setQrCodeDataUrl(qrCodeUrl);

        // Upload QR code to Firebase Storage
        const downloadUrl = await uploadQRCodeToStorage(qrCodeUrl);

        // Store booking data in Firebase Realtime Database
        await storeBookingData(generalFormData, downloadUrl);

        // Send email
        await sendEmail(generalFormData, downloadUrl);
      }
    } catch (error) {
      setPaymentError(error.message);
      setPaymentSuccess(false);
    }
  };

  const handleWarrantSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const paymentIntent = await createPaymentIntent(5000); // Replace with your amount
      setPaymentIntent(paymentIntent);

      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: warrantFormData.NIC,
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        setPaymentSuccess(false);
      } else {
        setPaymentError(null);
        setPaymentSuccess(true);
        console.log('Warrant form submitted:', warrantFormData);
        console.log('PaymentIntent:', confirmedPaymentIntent);

        // Generate QR code
        const qrData = `
          Passenger: ${warrantFormData.NIC}
          Mobile: ${warrantFormData.mobileNumber}
          Warrant Number: ${warrantFormData.warrantNumber}
          Date of Issue: ${warrantFormData.dateOfIssue}
          From: ${warrantFormData.from}
          To: ${warrantFormData.to}
          Passengers: ${warrantFormData.passengers}
          Class: ${warrantFormData.class}
        `;
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        setQrCodeDataUrl(qrCodeUrl);

        // Upload QR code to Firebase Storage
        const downloadUrl = await uploadQRCodeToStorage(qrCodeUrl);

        // Store booking data in Firebase Realtime Database
        await storeBookingData(warrantFormData, downloadUrl);

        // Send email
        await sendEmail(warrantFormData, downloadUrl);
      }
    } catch (error) {
      setPaymentError(error.message);
      setPaymentSuccess(false);
    }
  };

  const handleGeneralReset = () => {
    setGeneralFormData({
      NIC: '',
      mobileNumber: '',
      email: '',
      from: '',
      to: '',
      date: '',
      journeyTime: '',
      returnTrip: false,
      returnDate: '',
      passengers: 1,
      class: 'Second Class',
    });
    setPaymentError(null);
    setPaymentSuccess(false);
    setPaymentIntent(null);
    setQrCodeDataUrl(null);
  };

  const handleWarrantReset = () => {
    setWarrantFormData({
      NIC: '',
      mobileNumber: '',
      email: '',
      warrantNumber: '',
      dateOfIssue: '',
      from: '',
      to: '',
      passengers: 1,
      class: 'Second Class',
    });
    setPaymentError(null);
    setPaymentSuccess(false);
    setPaymentIntent(null);
    setQrCodeDataUrl(null);
  };

  return (
    <div>
      <header className="py-12 bg-gradient-to-br from-gray-800 to-gray-900 text-center shadow-lg relative">
        <h1 className="text-5xl font-extrabold tracking-wide text-white m-2">Railway Booking System</h1>
        <p className="text-lg mt-3 max-w-2xl mx-auto opacity-90"></p>
      </header>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-4xl bg-white mt-6 rounded-lg shadow-lg p-6">
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 text-lg font-medium ${
                activeTab === "general"
                  ? "text-white bg-green-600"
                  : "text-green-600 border border-green-600"
              } rounded-l-lg`}
              onClick={() => handleTabSwitch("general")}
            >
              General Passenger
            </button>
            <button
              className={`px-6 py-2 text-lg font-medium ${
                activeTab === "warrant"
                  ? "text-white bg-green-600"
                  : "text-green-600 border border-green-600"
              } rounded-r-lg`}
              onClick={() => handleTabSwitch("warrant")}
            >
              Warrant Passenger
            </button>
          </div>

          {/* General Passenger Form */}
          {activeTab === "general" && (
            <form onSubmit={handleGeneralSubmit} className="space-y-4 text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="NIC" className="block text-sm font-medium">NIC/Passport Number</label>
                  <input
                    type="text"
                    name="NIC"
                    id="NIC"
                    value={generalFormData.NIC}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium">Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={generalFormData.mobileNumber}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={generalFormData.email}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white">
                    <FaMapMarkerAlt className="text-gray-500 mr-2 text-lg" />
                    <Select
                      id="from"
                      name="from"
                      options={stationOptions}
                      placeholder="Select From Station"
                      onChange={(selectedOption) => handleStationChange(selectedOption, true, 'from')}
                      className="w-full outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white">
                    <FaMapMarkerAlt className="text-gray-500 mr-2 text-lg" />
                    <Select
                      id="to"
                      name="to"
                      options={stationOptions}
                      placeholder="Select To Station"
                      onChange={(selectedOption) => handleStationChange(selectedOption, true, 'to')}
                      className="w-full outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={generalFormData.date}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="journeyTime" className="block text-sm font-medium">Journey Time</label>
                  <input
                    type="time"
                    name="journeyTime"
                    id="journeyTime"
                    value={generalFormData.journeyTime}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 items-center">
                <label htmlFor="returnTrip" className="text-sm font-medium">Return Trip</label>
                <input
                  type="checkbox"
                  name="returnTrip"
                  id="returnTrip"
                  checked={generalFormData.returnTrip}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500"
                />
                {generalFormData.returnTrip && (
                  <input
                    type="date"
                    name="returnDate"
                    value={generalFormData.returnDate}
                    onChange={(e) => handleInputChange(e, true)}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium">Passengers</label>
                  <input
                    type="number"
                    name="passengers"
                    id="passengers"
                    value={generalFormData.passengers}
                    onChange={(e) => handleInputChange(e, true)}
                    min="1"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="class" className="block text-sm font-medium">Class</label>
                  <select
                    name="class"
                    id="class"
                    value={generalFormData.class}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Second Class">Second Class</option>
                    <option value="First Class">First Class</option>
                    <option value="Third Class">Third Class</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="card-element" className="block text-sm font-medium">Card Details</label>
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              {paymentError && <div className="text-red-500">{paymentError}</div>}
              {paymentSuccess && (
                <div className="text-green-500">
                  Payment Successful!
                  {qrCodeDataUrl && (
                    <div>
                      <img src={qrCodeDataUrl} alt="QR Code" />
                      <a href={qrCodeDataUrl} download="ticket.png">Download QR Code</a>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleGeneralReset}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                  disabled={!stripe}
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {/* Warrant Passenger Form */}
          {activeTab === "warrant" && (
            <form onSubmit={handleWarrantSubmit} className="space-y-4 text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="NIC" className="block text-sm font-medium">NIC/Passport Number</label>
                  <input
                    type="text"
                    name="NIC"
                    id="NIC"
                    value={warrantFormData.NIC}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium">Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={warrantFormData.mobileNumber}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={warrantFormData.email}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="warrantNumber" className="block text-sm font-medium">Warrant Number</label>
                  <input
                    type="text"
                    name="warrantNumber"
                    id="warrantNumber"
                    value={warrantFormData.warrantNumber}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dateOfIssue" className="block text-sm font-medium">Date of Issue</label>
                  <input
                    type="date"
                    name="dateOfIssue"
                    id="dateOfIssue"
                    value={warrantFormData.dateOfIssue}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white">
                    <FaMapMarkerAlt className="text-gray-500 mr-2 text-lg" />
                    <Select
                      id="from"
                      name="from"
                      options={stationOptions}
                      placeholder="Select From Station"
                      onChange={(selectedOption) => handleStationChange(selectedOption, false, 'from')}
                      className="w-full outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white">
                    <FaMapMarkerAlt className="text-gray-500 mr-2 text-lg" />
                    <Select
                      id="to"
                      name="to"
                      options={stationOptions}
                      placeholder="Select To Station"
                      onChange={(selectedOption) => handleStationChange(selectedOption, false, 'to')}
                      className="w-full outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium">Passengers</label>
                  <input
                    type="number"
                    name="passengers"
                    id="passengers"
                    value={warrantFormData.passengers}
                    onChange={(e) => handleInputChange(e)}
                    min="1"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="class" className="block text-sm font-medium">Class</label>
                  <select
                    name="class"
                    id="class"
                    value={warrantFormData.class}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Second Class">Second Class</option>
                    <option value="First Class">First Class</option>
                    <option value="Third Class">Third Class</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="card-element" className="block text-sm font-medium">Card Details</label>
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              {paymentError && <div className="text-red-500">{paymentError}</div>}
              {paymentSuccess && (
                <div className="text-green-500">
                  Payment Successful!
                  {qrCodeDataUrl && (
                    <div>
                      <img src={qrCodeDataUrl} alt="QR Code" />
                      <a href={qrCodeDataUrl} download="ticket.png">Download QR Code</a>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleWarrantReset}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                  disabled={!stripe}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <Elements stripe={stripePromise}>
    <Tickets />
  </Elements>
);

export default App;
