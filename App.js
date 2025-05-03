import './App.css';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import Footer from './components/Footer';
import Features from './components/Features';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import OurService from './pages/OurServices';
import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/ContactUs';
import BlogPage from './pages/BlogPage';
import AboutUs from './pages/AboutUs';
import Tickets from './pages/Tickets';
import PaymentPage from './pages/Payment';
import GenerateQR from './pages/GenerateQR';
import SeasonTicketRenew from './pages/SeasonTicketRenew';
import HotelBooking from './pages/HotelBooking';
import TrainShedule from './pages/TrainShedule';
import UserProfile from './pages/UserProfile';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './stripe'; // Import your stripePromise
import RailwayPremises from './pages/RailwayPremises';
function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      
      <Routes>
        <Route path="ourservice" element={<OurService />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<HeroSlider />} />
        <Route path="blogs" element={<BlogPage />} />
        <Route path='/login' element = {<Login />} />
        <Route path='contact' element = {<Contact />} />
        <Route path='about' element = {<AboutUs />} />
        <Route path='tickets' element = {<Tickets />} />
        <Route path='/generateQR' element={<GenerateQR />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/seasonTickets" element={<SeasonTicketRenew />} />
        <Route path="/hotelbooking" element={<HotelBooking />} />
        <Route path = "/trinshedule" element = {<TrainShedule/>} />
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<UserProfile />} />
         <Route path='/railwaypremises' element = {<RailwayPremises/>} />
      </Routes>
      {location.pathname === '/' && <Features />}
      <Footer />
    </div>
  );
}

function RootApp() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}> {/* Wrap App with Elements provider */}
        <App />
      </Elements>
    </BrowserRouter>
  );
}

export default RootApp;
