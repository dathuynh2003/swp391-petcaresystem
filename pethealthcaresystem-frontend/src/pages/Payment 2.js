import React from 'react'
import AuthProvider from '../context/auth.context'
import { BrowserRouter as Router, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import PaymentResult from '../services/Booking/PaymentResult';

export default function PaymentPage() {
  return (
    <AuthProvider>
        <Routes>
        </Routes>
    </AuthProvider>
  )
}
