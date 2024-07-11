import React from 'react'
import AuthProvider from '../context/auth.context'
import { BrowserRouter as Router, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import PaymentResult from '../services/Booking/PaymentResult';
import { URL } from '../utils/constant';
export default function PaymentPage() {
  return (
    <AuthProvider>
        <Routes>
        </Routes>
    </AuthProvider>
  )
}
