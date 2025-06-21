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
import NotFound from './components/NotFound';
import UserDashboard from './User Dashboard/UserDashboard';
import AdminDashboard from './AdminDashboard/AdminDashboard.js';

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
      <Route path="*" element={<NotFound />} />
      <Route path="/userdashboard" element={<UserDashboard />} />
      <Route path="/admindash" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;