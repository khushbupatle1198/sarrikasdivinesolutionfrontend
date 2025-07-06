import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Courses from './components/Courses';
import Consultation from './components/Consultation';
import EReport from './components/EReport';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Login from './components/Login';
import ResetPasswordPage from './components/ResetPasswordPage.js';
import NotFound from './components/NotFound';
import UserDashboard from './User Dashboard/UserDashboard';
import AdminDashboard from './AdminDashboard/AdminDashboard.js';
import CoursePurchaseForm from './forms/CoursePurchaseForm.js';
import OtpVerificationPage from './forms/OtpVerificationPage.js';
import AdminLogin from './AdminDashboard/AdminLogin.js';
import ConsultationBooking from './forms/ConsultationBooking.js';
import EReportBooking from './forms/EReportBooking.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/consultation" element={<Consultation />} />
      <Route path="/ereport" element={<EReport />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/userdashboard" element={<UserDashboard />} />
      <Route path="/admindash" element={<AdminDashboard />} />
      <Route path="/purchase-course" element={<CoursePurchaseForm />} />
       <Route path="/purchase/otp" element={<OtpVerificationPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/consultationbooking" element={<ConsultationBooking />} />ereportbooking
        <Route path="/ereportbooking" element={<EReportBooking />} />
    </Routes>
  );
}

export default App;