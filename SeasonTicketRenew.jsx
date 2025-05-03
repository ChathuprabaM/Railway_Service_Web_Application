import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
    FaUser, FaSchool, FaUniversity, FaIdCard, FaCalendarAlt, FaMapMarkerAlt, FaUpload, FaBriefcase
} from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';



function SeasonTicketRenew() {
    const [formType, setFormType] = useState('student');
    const [stations, setStations] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getDatabase();
    const storage = getStorage();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login');
            }
        });

        // Fetch stations data
        fetch('/json/stations.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.stations) {
                    const formattedStations = data.stations.map(station => ({
                        value: station.name,
                        label: station.name
                    }));
                    setStations(formattedStations);
                } else {
                    throw new Error("Invalid JSON structure");
                }
            })
            .catch(error => {
                console.error("Error loading stations:", error);
                setError("Failed to load stations data. Please try again later.");
            });

        return () => unsubscribe();
    }, [auth, navigate]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.status = 'pending';
        data.userId = user.uid;
        data.userType = formType; // Store the user type

        if (formType === 'worker' && file) {
            const fileRef = storageRef(storage, `id_cards/${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            data.idCardURL = downloadURL;
        }

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Create a payment intent
        const paymentIntent = await createPaymentIntent(data);

        if (paymentIntent.error) {
            console.error("Stripe payment intent error:", paymentIntent.error);
            Swal.fire('Error', 'There was an error creating the payment intent.', 'error');
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: data.fullName,
            },
        });

        if (error) {
            console.error("Stripe payment error:", error);
            Swal.fire('Error', 'There was an error processing your payment.', 'error');
            return;
        }

        // Confirm the payment
        const confirmResult = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: paymentMethod.id,
        });

        if (confirmResult.error) {
            console.error("Stripe payment confirmation error:", confirmResult.error);
            Swal.fire('Error', 'There was an error confirming your payment.', 'error');
            return;
        }

        if (confirmResult.paymentIntent.status === 'succeeded') {
            set(ref(db, `renewals/${user.uid}`), data)
                .then(() => {
                    Swal.fire('Success', 'Form submitted and payment processed successfully!', 'success');
                    window.location.href = '/home';
                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                    Swal.fire('Error', 'There was an error submitting the form.', 'error');
                });
        } else {
            Swal.fire('Error', 'Payment failed. Please try again.', 'error');
        }
    };

    const createPaymentIntent = async (data) => {
        // Create a payment intent using Stripe's client-side library
        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
               
            },
            body: new URLSearchParams({
                amount: 1000,
                currency: "usd",
                "payment_method_types[]": "card",
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return { error };
        }

        const paymentIntent = await response.json();
        return { client_secret: paymentIntent.client_secret, error: null };
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-8 mt-8 mb-8 w-full max-w-3xl">
                    <h1 className="text-2xl font-bold mb-6 text-center">Season Ticket Renewal</h1>
                    <div className="flex flex-col md:flex-row justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-8">
                        <button
                            onClick={() => setFormType('student')}
                            className={`px-6 py-3 flex items-center space-x-2 rounded text-lg
                                ${formType === 'student' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <FaSchool />
                            <span>Students</span>
                        </button>

                        <button
                            onClick={() => setFormType('worker')}
                            className={`px-6 py-3 flex items-center space-x-2 rounded text-lg
                                ${formType === 'worker' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <FaBriefcase />
                            <span> Workers / University</span>
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="userType" value={formType} /> {/* Hidden input for user type */}
                        {formType === 'student' ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaUser className="text-gray-500 mr-2" />
                                        <input type="text" name="fullName" placeholder="Enter Full Name" className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaIdCard className="text-gray-500 mr-2" />
                                        <input type="text" name="designation" placeholder="Enter Designation (Age/Father's Name)" className="w-full outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <input type="text" name="address" placeholder="Enter Address" className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaCalendarAlt className="text-gray-500 mr-2" />
                                        <input type="date" name="expiryDate" placeholder="Date of Expiry" className="w-full outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <Select
                                            options={stations}
                                            name="fromStation"
                                            placeholder="From Station"
                                            className="w-full outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <Select
                                            options={stations}
                                            name="toStation"
                                            placeholder="To Station"
                                            className="w-full outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaCalendarAlt className="text-gray-500 mr-2" />
                                        <input type="date" name="fromDate" placeholder="From Date" className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaCalendarAlt className="text-gray-500 mr-2" />
                                        <input type="date" name="toDate" placeholder="To Date" className="w-full outline-none" />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Select Duration</label>
                                    <select name="duration" className="w-full border rounded px-3 py-2 outline-none">
                                        <option>Monthly</option>
                                        <option>3 Months</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaUser className="text-gray-500 mr-2" />
                                        <input type="text" name="fullName" placeholder="Enter Full Name" className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaIdCard className="text-gray-500 mr-2" />
                                        <input type="text" name="designation" placeholder="Enter Designation" className="w-full outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaIdCard className="text-gray-500 mr-2" />
                                        <input type="text" name="nicNumber" placeholder="Enter NIC Number" className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaCalendarAlt className="text-gray-500 mr-2" />
                                        <input type="date" name="nicDate" placeholder="NIC Date" className="w-full outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaIdCard className="text-gray-500 mr-2" />
                                        <input type="text" name="idCardNumber" placeholder="Enter ID Card Number" className="w-full outline-none" />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaUniversity className="text-gray-500 mr-2" />
                                        <input type="text" name="workplace" placeholder="Enter Workplace/University" className="w-full outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <Select
                                            options={stations}
                                            name="fromStation"
                                            placeholder="From Station"
                                            className="w-full outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                        <Select
                                            options={stations}
                                            name="toStation"
                                            placeholder="To Station"
                                            className="w-full outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <FaIdCard className="text-gray-500 mr-2" />
                                        <input type="text" name="class" placeholder="Class" className="w-full outline-none" />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Select Duration</label>
                                    <select name="duration" className="w-full border rounded px-3 py-2 outline-none">
                                        <option>Monthly</option>
                                        <option>3 Months</option>
                                    </select>
                                </div>

                                <div className="max-w-md mx-auto p-4">
                                    <label className="block text-lg font-semibold text-gray-700 mb-2">Upload ID Card Photo (University or Office)</label>
                                    <div className="flex items-center justify-between border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition duration-300 ease-in-out">
                                        <div className="flex items-center space-x-3">
                                            <FaUpload className="text-gray-500 text-2xl" />
                                            <span className="text-gray-500 text-sm">Click to upload or drag & drop</span>
                                        </div>
                                        <input type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
                                        <label htmlFor="fileInput" className="cursor-pointer text-indigo-500 text-sm font-semibold hover:underline">Choose File</label>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Payment Information</label>
                            <CardElement
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
                            />
                        </div>

                        <button className="w-full bg-green-500 text-white py-2 rounded mt-4">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const WrappedSeasonTicketRenew = () => (
    <Elements stripe={stripePromise}>
        <SeasonTicketRenew />
    </Elements>
);

export default WrappedSeasonTicketRenew;
