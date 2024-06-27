import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

export default function UserChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/getAllUsers', {withCredentials: true})
      .then(response => {
        const userData = response.data.users;
        console.log('User data from API:', userData);

        // Xử lý dữ liệu để tính tổng số lượng người dùng theo ngày
        const dateCountMap = userData.reduce((acc, user) => {
          const date = dayjs(user.createdAt).format('YYYY-MM-DD');
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Sắp xếp các ngày theo thứ tự
        const sortedDates = Object.keys(dateCountMap).sort();

        // Tạo dữ liệu tích lũy cho biểu đồ
        let cumulativeCount = 0;
        const chartData = sortedDates.map(date => {
          cumulativeCount += dateCountMap[date];
          return { date, users: cumulativeCount };
        });

        console.log('Processed chart data:', chartData);
        setData(chartData);
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu: ", error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
