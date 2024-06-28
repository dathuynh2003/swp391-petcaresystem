import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from 'recharts';
import {
  Button, Input, Box, Flex, Text, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid, IconButton,
} from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, TimeIcon } from '@chakra-ui/icons';

export default function Dashboard() {
  let navigate = useNavigate();
  const roleId = localStorage.getItem('roleId');
  if (roleId !== '4') {
    navigate('/404page');
  }

  const [summaryData, setSummaryData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueTrend, setRevenueTrend] = useState(null); // null, 'up', 'down'
  const [totalRefundAmount, setTotalRefundAmount] = useState(0)
  const [refundTrend, setRefundTrend] = useState()
  const [totalUser, setTotalUser] = useState(0)
  const [userTrend, setUserTrend] = useState(null)
  const [totalBooking, setTotalBooking] = useState(0)
  const [bookingTrend, setBookingTrend] = useState()
  const [totalCancelBooking, setTotalCancelBooking] = useState(0)
  const [cancelTrend, setCancelTrend] = useState()

  const [filter, setFilter] = useState('');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
  };

  const handleLoadData = async () => {
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('The end date is invalid!');
      return;
    }
    console.log(startDate);
    console.log(endDate);
    try {
      const response = await axios.get('http://localhost:8080/api/summary-data', {
        params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
      });
      setSummaryData(response.data);
      calculateTotalRevenue(response.data);
      if (response.data === undefined) {
        setTotalUser(0)
        setUserTrend(null)
        return
      }
      calculateTotalUser(response?.data)
      calculateTotalBooking(response?.data)
      calculateTotalRefund(response?.data)
      calculateTotalCancelBooking(response?.data)
    } catch (error) {
      toast.error(error.message);
    }
  };


  const calculateTotalCancelBooking = (data) => {
    let total = data.reduce((acc, cur) => acc + cur.totalCancelBooking, 0)
    setCancelTrend(total > totalCancelBooking ? 'up' : total < totalCancelBooking ? 'down' : null)
    setTotalCancelBooking(total)
  }



  const calculateTotalRefund = (data) => {
    let total = data.reduce((acc, cur) => acc + cur.totalRefundAmount, 0)
    setRefundTrend(total > totalRefundAmount ? 'up' : total < totalRefundAmount ? 'down' : null)
    setTotalRefundAmount(total)
  }

  const calculateTotalBooking = (data) => {
    let total = data.reduce((acc, cur) => acc + cur.totalBooking, 0)
    setBookingTrend(total > totalBooking ? 'up' : total < totalBooking ? 'down' : null)
    setTotalBooking(total)
  }

  const calculateTotalRevenue = (data) => {
    let total = data.reduce((acc, cur) => acc + cur.totalAmount, 0);
    setRevenueTrend(total > totalRevenue ? 'up' : total < totalRevenue ? 'down' : null);
    setTotalRevenue(total);
  };
  const calculateTotalUser = (data) => {
    console.log("length đây");
    console.log(data);
    console.log(data?.length);
    if (data === undefined || data?.length === 0) {

      setUserTrend(null);
      setTotalUser(0)
      return
    }
    let lastItem = data.slice().reverse().find(entry => entry?.totalUser !== 0) //tạo bản sao mảng, đảo ngược lại, tìm phần tử đầu tiên khác 0
    console.log(lastItem);
    let total = lastItem?.totalUser
    if (lastItem == null) {
      setTotalUser(0)
      return
    }
    setUserTrend(total > totalUser ? 'up' : total < totalUser ? 'down' : null)
    setTotalUser(total)
  }

  useEffect(() => {
    const nowMonth = new Date().getMonth() + 1
    const nowYear = new Date().getFullYear()
    const tmptStartDate = nowMonth + '-01-' + nowYear
    console.log("day neeeeeeeee");
    setStartDate(formatDate(tmptStartDate))

    setEndDate(formatDate(new Date()))
    console.log(formatDate(new Date()));
    handleLoadData()
  }, [])
  useEffect(() => {
    handleLoadData();
  }, [filter]);

  const integerTickFormatter = (value) => {
    return Number.isInteger(value) ? value : '';
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // Set startDate and endDate based on filter
    const today = new Date();
    let start, end;

    if (newFilter === 'lastWeek') {
      start = new Date(today.setDate(today.getDate() - 7));
      end = new Date();
    } else if (newFilter === 'lastMonth') {
      start = new Date(today.setMonth(today.getMonth() - 1));
      end = new Date();
    } else if (newFilter === 'lastYear') {
      start = new Date(today.setFullYear(today.getFullYear() - 1));
      end = new Date();
    }
    // else if (newFilter === 'yearly') {
    //   start = new Date(today.setFullYear(today.getFullYear() - 1));
    //   end = new Date();
    // }
    // } else if (newFilter === 'lifeTime') {
    //   start = new Date('2024-06-01'); // Example start date ' 2020-01-01'
    //   end = new Date();
    // }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <>
      <ToastContainer />
      <div  >
        <Box textAlign="center" mt={3} mb={5}>
          <h3>Summary Data Dashboard</h3>
        </Box>
        <div className='d-flex align-items-center gap-4 mb-5 mx-auto justify-content-center'>
          <b>Start date: </b><Input type='date' onChange={(e) => setStartDate(e.target.value)} style={{ width: '20%' }} />
          <b>End Date: </b><Input type='date' onChange={(e) => setEndDate(e.target.value)} style={{ width: '20%' }} />
          <Button onClick={handleLoadData} colorScheme='teal'>Fillter</Button>
          <div className='d-flex align-items-center text-center' >
            <Button colorScheme={filter === 'lastWeek' ? 'teal' : 'gray'} onClick={() => handleFilterChange('lastWeek')}>Last Week</Button>
            <Button colorScheme={filter === 'lastMonth' ? 'teal' : 'gray'} onClick={() => handleFilterChange('lastMonth')}>Last Month</Button>
            <Button colorScheme={filter === 'lastYear' ? 'teal' : 'gray'} onClick={() => handleFilterChange('lastYear')}>Last Year</Button>
          </div>
        </div>
        <div className='d-flex mb-5 gap-3 align-items-center justify-content-evenly'>

          <div className='text-center p-5 shadow rounded-circle' style={{ background: 'linear-gradient(135deg, #008080, #FFD700)' }}>
            <h6 className='fst-italic' style={{ color: 'white' }}>Total User</h6>
            <div className='d-flex align-items-center text-center gap-2'>
              <h2 className='fw-bold '>{totalUser}</h2> people
            </div>

            {userTrend === 'up' && (
              <Text color="white">
                Increasing <ArrowUpIcon />
              </Text>
            )}
            {userTrend === 'down' && (
              <Text color="red.500">
                Decreasing <ArrowDownIcon />
              </Text>
            )}
          </div>

          <div className='d-flex gap-2'>
            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #008080, #FFD700)', color: '' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}>Total Amount</h6>
              <div className='d-flex align-items-center text-center gap-2'>
                <h1 className='fw-bold '>{totalRevenue.toLocaleString('vi-VN') + " "}</h1> VND
              </div>
              {revenueTrend === 'up' && (
                <Text color="white">
                  Increasing <ArrowUpIcon />
                </Text>
              )}
              {revenueTrend === 'down' && (
                <Text color="red.500">
                  Decreasing <ArrowDownIcon />
                </Text>
              )}
            </div>

            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #FF69B4, #1E90FF)', color: '' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}>Total Refund Amount</h6>
              <div className='d-flex align-items-center text-center gap-2'>
                <h1 className='fw-bold text-center'>{totalRefundAmount.toLocaleString('vi-VN') + " "}</h1> VND
              </div>
              {refundTrend === 'up' && (
                <Text color="white">
                  Increasing <ArrowUpIcon />
                </Text>
              )}
              {refundTrend === 'down' && (
                <Text color="red.500">
                  Decreasing <ArrowDownIcon />
                </Text>
              )}
            </div>
          </div>

          <div className='d-flex gap-2'>
            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #008080, #FFD700)', color: '' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}>Total Booking</h6>
              <div className='d-flex align-items-center text-center gap-2'>
                <h1 className='fw-bold '>{totalBooking}</h1> booking(s)
              </div>

              {bookingTrend === 'up' && (
                <Text color="white">
                  Increasing <ArrowUpIcon />
                </Text>
              )}
              {bookingTrend === 'down' && (
                <Text color="red.500">
                  Decreasing <ArrowDownIcon />
                </Text>
              )}
            </div>

            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #FF69B4, #1E90FF)', color: '' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}>Total Cancel Booking</h6>
              <div className='d-flex align-items-center text-center gap-2'>
                <h1 className='fw-bold '>{totalCancelBooking}</h1> booking(s)
              </div>

              {cancelTrend === 'up' && (
                <Text color="white">
                  Increasing <ArrowUpIcon />
                </Text>
              )}
              {cancelTrend === 'down' && (
                <Text color="red.500">
                  Decreasing <ArrowDownIcon />
                </Text>
              )}
            </div>
          </div>
          {/* <Stat>
          <StatLabel>Operational Cost</StatLabel>
          <StatNumber>$2,923</StatNumber>
          <StatHelpText>Avg. cost per operation: $30.0</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Avg Patient Per Doctor</StatLabel>
          <StatNumber>30.4</StatNumber>
          <StatHelpText>Available: 120</StatHelpText>
        </Stat> */}
        </div>






        <Box mb={5}>
          <LineChart width={1200} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={integerTickFormatter} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalUser" stroke="#ff7300" />
          </LineChart>
          <Text textAlign="center" fontStyle="italic">
            Chart of growing user
          </Text>
        </Box>

        <Box mb={5}>
          <LineChart width={1200} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" />
            <Line type="monotone" dataKey="totalRefundAmount" stroke="#8884d8" />
          </LineChart>
          <Text textAlign="center" fontStyle="italic">
            Chart of Total Amount and Total Refund Amount
          </Text>
        </Box>

        <Box>
          <BarChart width={1200} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={integerTickFormatter} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalBooking" fill="#82ca9d" />
            <Bar dataKey="totalCancelBooking" fill="#cc0066" />
          </BarChart>
          <Text textAlign="center" fontStyle="italic">
            Chart of total Booking and Cancel Booking
          </Text>
        </Box>
      </div>
    </>
  );
}
