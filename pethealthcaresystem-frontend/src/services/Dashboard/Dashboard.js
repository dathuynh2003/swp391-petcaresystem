import React, { useEffect, useState } from 'react';
import UserChart from './UserChart'
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { Button, Input } from '@chakra-ui/react';
import { formatDate } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  let navigate = useNavigate()
  const roleId = localStorage.getItem('roleId')
  if (roleId !== '4'){
    navigate('/404page')
  }
  const [summaryData, setSummaryData] = useState([]);
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB").replace(/\//g, '-')
  }


  const handleLoadData = () => {
    if (endDate < startDate) {
      toast.error("The end date is invalid!")
      return
    }

    try {
      const response = axios.get('http://localhost:8080/api/summary-data', {
        params: { startDate: formatDate(startDate), endDate: formatDate(endDate) }
      }).then(response => {
        setSummaryData(response.data);
      })

    } catch (error) {
      toast.error(error)
    }

  }
  useEffect(() => {
    handleLoadData()
  }, [])
  console.log(formatDate(startDate));

  console.log(summaryData);
  console.log(startDate);
  const integerTickFormatter = (value) => {
    return Number.isInteger(value) ? value : '';
  };
  return (
    <>
      <div>
      <ToastContainer />
        <h1 className='text-center mt-3 mb-3'>Summary Data Dashboard</h1>

        <div className='d-flex align-items-center gap-4 mb-5 mx-auto justify-content-center'>
          <b>Start date: </b><Input type='date' onChange={(e) => setStartDate(e.target.value)} style={{ width: '20%' }} />
          <b>End Date: </b><Input type='date' onChange={(e) => setEndDate(e.target.value)} style={{ width: '20%' }} />
          <Button onClick={handleLoadData} colorScheme='teal'>Search</Button>
        </div>

        <div className='mb-5'>
          <LineChart width={1200} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={integerTickFormatter} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalUser" stroke="#ff7300" />
          </LineChart>
          <h5 className='text-center fst-italic'>Chart of growing user</h5>
        </div>


        <div className='mb-5'>
          <LineChart width={1200} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" />
            <Line type="monotone" dataKey="totalRefundAmount" stroke="#8884d8" />
          </LineChart>
          <h5 className='text-center fst-italic'>Chart of Total Amount and Total Refund Amount</h5>
        </div>
        <div className=''>
          <BarChart width={1200} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalBooking" fill="#82ca9d" />
            <Bar dataKey="totalCancelBooking" fill="#cc0066" />
          </BarChart>
          <h5 className='text-center fst-italic'>Chart of total Booking and Cancel Booking</h5>
        </div>
      </div>
      {/* <UserChart /> */}
    </>


  )
}
