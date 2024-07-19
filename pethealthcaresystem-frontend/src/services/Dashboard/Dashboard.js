import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, ResponsiveContainer
} from 'recharts';
import {
  Button, Input, Box, Flex, Text, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid, IconButton, Link
} from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, TimeIcon } from '@chakra-ui/icons';
import { curveCardinal } from 'd3-shape';
import './Dashboard.css'
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import BookIcon from '@mui/icons-material/Book';
import AppBlockingIcon from '@mui/icons-material/AppBlocking';
import { URL } from '../../utils/constant'

export default function Dashboard() {
  let navigate = useNavigate();
  const roleId = localStorage.getItem('roleId');
  if (roleId !== '4') {
    navigate('/404page');
  }
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-CA')
  };

  const defaultStartDate = () => {
    const nowMonth = new Date().getMonth() + 1
    const nowYear = new Date().getFullYear()
    const tmptStartDate = nowYear + "-" + nowMonth + "-01"
    return formatDate(tmptStartDate)
  }

  const [summaryData, setSummaryData] = useState([]);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(formatDate(new Date()));
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

  // const [today, setToday] = useState(new Date())

  const handleLoadData = async () => {
    if (new Date(endDate) < new Date(startDate)) {
      console.log(new Date(endDate) < new Date(startDate));
      toast.error('The end date is invalid!');
      return;
    }
    console.log("start date đây: ");
    console.log(formatDate(startDate));
    console.log("end date đây: ");
    console.log(formatDate(formatDate(endDate)));
    try {
      const response = await axios.get(`${URL}/api/summary-data`, {
        params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
      });
      setSummaryData(response.data);
      console.log(response.data);
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
  }


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
    let total = data.reduce((acc, cur) => acc + cur.totalUser, 0);
    setUserTrend(total > totalUser ? 'up' : total < totalUser ? 'down' : null);
    setTotalUser(total);
  };




  useEffect(() => {

    handleLoadData()
  }, [filter])
  const integerTickFormatter = (value) => {
    return Number.isInteger(value) ? value : '';
  };
  // const handleFilterChange = (newFilter) => {
  //   setFilter(newFilter);

  //   // const today = new Date();
  //   let startDate, endDate;

  //   if (newFilter === 'lastWeek') {
  //     let tempToday = today; // Tạo bản sao của today
  //     tempToday.setDate(today.getDate() - (today.getDay() + 6) % 7); // Bắt đầu từ thứ 2 của tuần trước
  //     startDate = new Date(tempToday);
  //     endDate = new Date(tempToday);
  //     endDate.setDate(tempToday.getDate() + 6); // Kết thúc vào chủ nhật của tuần trước

  //   } else if (newFilter === 'lastMonth') {
  //     startDate = new Date(today.getFullYear(), today.getMonth()-1, 1);
  //     endDate = new Date(today.getFullYear(), today.getMonth() , 0);
  //   } else if (newFilter === 'lastYear') {
  //     startDate = new Date(today.getFullYear() - 1, 0, 1);
  //     endDate = new Date(today.getFullYear() - 1, 11, 31);
  //   }

  //   setStartDate(formatDate(startDate)); // Định dạng và cập nhật startDate
  //   setEndDate(formatDate(endDate)); // Định dạng và cập nhật endDate
  // };

  const handleFilterChange = (newFilter) => {

    setFilter(newFilter);
    // Set startDate and endDate based on filter
    const today = new Date();
    let start, end;
    if (newFilter === 'lastWeek') {
      start = new Date(today) //tạo bản sao để k ảnh hưởng đến today
      let dayOfWeek = today.getDay(); // 0 (Chủ Nhật) đến 6 (Thứ Bảy)

      let distanceToMonday = (dayOfWeek + 6) % 7; // Khoảng cách đến thứ 2 tuần trước
      //cộng thêm 6 cho đủ 1 tuần 7 ngày, tính hiện tại là 1 ngày
      // % 7 để tìm được khoảng cách nó cách thứ 2

      start.setDate(today.getDate() - distanceToMonday - 7); // Lùi lại để đến thứ 2 của tuần trước
      end = new Date(start) //tạo bản sao để k ảnh hưởng đến start
      end.setDate(start.getDate() + 6);

    } else if (newFilter === 'lastMonth') {
      start = (today.getFullYear()) + "-" + today.getMonth() + "-01"
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (newFilter === 'lastYear') {
      // start = new Date(today.setFullYear(today.getFullYear() - 1));
      start = (today.getFullYear() - 1) + "-01-01"
      end = (today.getFullYear() - 1) + "-12-31";
    }
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
    console.log(start);
    console.log(end);
  };
  ;

  return (
    <>
      <Link
        color="teal.500"
        href={`${URL}/api/summary-data/export`}
        textDecoration="none"
        fontWeight="bold"
        fontSize="16px"
      >
        <FontAwesomeIcon icon={faFileExport} style={{ marginRight: '8px' }} />
        Export File
      </Link>
      <ToastContainer />
      <div  >
        <Box textAlign="center" mt={3} mb={5}>
          <h3 style={{ color: 'teal' }}>Summary Data Dashboard</h3>
        </Box>
        <div className='d-flex align-items-center gap-4 mb-5 mx-auto justify-content-center'>
          <b>Start date: </b><Input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '20%' }} />
          <b>End Date: </b><Input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '20%' }} />
          <Button onClick={handleLoadData} colorScheme='teal'>Filter</Button>
          <div className='d-flex align-items-center text-center' >
            <Button colorScheme={filter === 'lastWeek' ? 'teal' : 'gray'} onClick={() => handleFilterChange('lastWeek')}>Last Week</Button>
            <Button colorScheme={filter === 'lastMonth' ? 'teal' : 'gray'} onClick={() => handleFilterChange('lastMonth')}>Last Month</Button>
            <Button colorScheme={filter === 'lastYear' ? 'teal' : 'gray'} onClick={() => handleFilterChange('lastYear')}>Last Year</Button>
          </div>
        </div>
        <div className='d-flex mb-5 gap-3 align-items-center justify-content-evenly'>

          <div className='text-center p-5 shadow rounded-circle'
            style={{
              background: 'linear-gradient(135deg, #FFC0CB, #FF69B4)'
              , width: '200px', height: '200px', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
            }}>
            <h6 className='fst-italic' style={{ color: 'white' }}><PeopleIcon></PeopleIcon> Total User</h6>
            <div className='d-flex align-items-center text-center gap-2'>
              <h1 className='fw-bold '>{totalUser}</h1> people
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
            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #1E90FF, #00FFFF)', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}><PaidIcon></PaidIcon> Total Amount</h6>
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

            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #FFB6C1, #FF4500)', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}><CurrencyExchangeIcon></CurrencyExchangeIcon> Total Refund Amount</h6>
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
            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #1E90FF, #00FFFF)', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}><BookIcon></BookIcon> Total Booking</h6>
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

            <div className='text-center p-3 shadow rounded' style={{ background: 'linear-gradient(135deg, #FFB6C1, #FF4500)', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
              <h6 className='fst-italic' style={{ color: 'white' }}><AppBlockingIcon></AppBlockingIcon> Total Cancel Booking</h6>
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
        </div>





        <div className='area-chart-container  mb-5 ' style={{}}>
          <BarChart width={1150} height={300} data={summaryData}>
            <defs>
              <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB6C1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF69B4" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("en-Gb")} />
            <YAxis tickFormatter={integerTickFormatter} />
            <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString("en-Gb")} />
            <Legend />
            <Bar type="monotone" dataKey="totalUser" fill="url(#colorPink)" />
          </BarChart>
          <Text textAlign="center" fontStyle="italic" fontSize={'18'} color='teal'>
            Chart of growing user
          </Text>
        </div>



        <div className='mb-5 area-chart-container'>

          <BarChart width={1150} height={300} data={summaryData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#87CEFA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#B0E0E6" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="colorCancel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FA8072" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F08080" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("en-Gb")} />
            <YAxis tickFormatter={integerTickFormatter} />
            <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString("en-Gb")} />
            <Legend />
            <Bar dataKey="totalAmount" fill="url(#colorUv)" />
            <Bar dataKey="totalRefundAmount" fill="url(#colorCancel)" />
          </BarChart>
          <Text textAlign="center" fontStyle="italic" fontSize={'18'} color='teal'>
            Chart of Total Amount and Total Refund Amount
          </Text>
        </div>


        <div className='mb-5 area-chart-container'>
          <BarChart width={1150} height={300} data={summaryData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#87CEFA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#B0E0E6" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="colorCancel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FA8072" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F08080" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("en-Gb")} />
            <YAxis tickFormatter={integerTickFormatter} />
            <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString("en-Gb")} />
            <Legend />
            <Bar dataKey="totalBooking" fill="url(#colorUv)" />
            <Bar dataKey="totalCancelBooking" fill="url(#colorCancel)" />
          </BarChart>
          <Text textAlign="center" fontStyle="italic" fontSize={'18'} color='teal'>
            Chart of total Booking and Cancel Booking
          </Text>
        </div>
      </div>
    </>
  );
}
