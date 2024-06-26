import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = () => {
    axios.get('http://localhost:8080/api/summary-data')
      .then(response => {
        setSummaryData(response.data);
      })
      .catch(error => {
        console.error('Error fetching summary data:', error);
      });
  };

  const formatDataForChart = (data, key) => {
    return {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: key,
          data: data.map(item => item[key]),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }
      ]
    };
  };

  return (
    <div>
      <h1>Payment Statistics</h1>
      <div>
        <h2>Total Amount</h2>
        <Bar data={formatDataForChart(summaryData, 'totalAmount')} />
      </div>
      <div>
        <h2>Total Bookings</h2>
        <Bar data={formatDataForChart(summaryData, 'totalBooking')} />
      </div>
      <div>
        <h2>Total Users</h2>
        <Bar data={formatDataForChart(summaryData, 'totalUser')} />
      </div>
    </div>
  );
}
