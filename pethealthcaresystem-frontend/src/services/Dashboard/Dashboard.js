import React, { useEffect, useState } from 'react';
import UserChart from './UserChart'
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart, Bar } from 'recharts';

export default function Dashboard() {

  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/summary-data', {
      params: { startDate: '2024-01-01', endDate: '2024-06-30' }
    }).then(response => {
      setSummaryData(response.data);
    });
  }, []);

  return (
    <>
      <div>
        <h1>Summary Data Dashboard</h1>
        <LineChart width={600} height={300} data={summaryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
          <Line type="monotone" dataKey="totalRefundAmount" stroke="#82ca9d" />
        </LineChart>
        <BarChart width={600} height={300} data={summaryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalBooking" fill="#8884d8" />
          <Bar dataKey="totalCancelBooking" fill="#82ca9d" />
        </BarChart>

        // Chart for total users
        <LineChart width={600} height={300} data={summaryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalUser" stroke="#ff7300" />
        </LineChart>
      </div>
      <div>Dashboard</div>
      <UserChart />
    </>


  )
}
