import React from 'react';
import ChoosePet from '../services/Booking/ChoosePet';
import { background } from '@chakra-ui/react';
import StepsBooking from './StepsBooking';

export default function BookingPage() {
  return (
    <div className="container">
      <div className="col-md-7 offset-md-4 border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded "></div>
      <div className="col-md-7 offset-md-4 border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded">
        <StepsBooking />
      </div>
    </div>
  );
}
