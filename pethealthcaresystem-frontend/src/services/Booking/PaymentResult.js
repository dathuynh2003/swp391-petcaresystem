import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PaymentResult() {
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();
  let status = query.get("status");
  let orderCode = query.get("orderCode");
  const [payment, setPayment] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDisplayDate, setDisplaySelectedDate] = useState()
  useEffect(() => {
    if (status && orderCode) {
      axios.put('http://localhost:8080/payment-update', {
        orderCode,
        status
      })
        .then((res) => {
          const paymentData = res.data.data;
          setPayment(paymentData);
          setIsLoading(false);
          console.log('Payment Data:', paymentData); // Log payment data
          if (paymentData.booking) {
            console.log('Booking Data:', paymentData.booking); // Log booking data
          }
        })
        .catch((error) => {
          setIsLoading(false);
          alert(error?.response?.data?.errorMessage ?? error?.message);
        });
    }
  }, [status, orderCode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderBookingInfo = (booking) => (
    <div>
      <h3 className="text-center">Booking Information</h3>
      <div className="mb-3">
        <label className="form-label"><b>Booking ID:</b> {booking.id}</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Booking Date:</b> {new Date(booking.bookingDate).toLocaleString()}</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Appointment Date:</b> {new Date(booking.appointmentDate).toLocaleString()}</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Status:</b> {booking.status}</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Total Amount:</b> {booking.totalAmount.toFixed(2)} VND</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Description:</b> {booking.description}</label>
      </div>
      <h4 className="text-center">User Information</h4>
      <div className="mb-3">
        <label className="form-label"><b>Full Name:</b> {booking.user.fullName}</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Email:</b> {booking.user.email}</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Phone Number:</b> {booking.user.phoneNumber}</label>
      </div>
      <div className="mb-3">
        <label className="form-label"><b>Address:</b> {booking.user.address}</label>
      </div>
      <h4 className="text-center">Pet Information</h4>
      <div className="mb-3">
        <label className="form-label"><b>Pet Name:</b> {booking.pet.name}</label>
      </div>
    </div>
  );

  return (
    <Fragment>
      {payment && (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  {payment.status === 'CANCELLED' && (
                    <div>
                      <h2 className="text-center text-danger">Payment CANCELLED</h2>
                      {payment.booking && renderBookingInfo(payment.booking)}
                    </div>
                  )}
                  {payment.status === 'PAID' && (
                    <div>
                      <h2 className="text-center text-success">Payment PAID</h2>
                      {payment.booking && renderBookingInfo(payment.booking)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}