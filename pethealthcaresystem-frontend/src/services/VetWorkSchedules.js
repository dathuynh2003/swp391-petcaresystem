import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Button } from '@chakra-ui/react';
import { URL } from '../utils/constant';

export default function VetWorkSchedules() {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  //dùng để lưu status booking của ca làm việc muốn xem chi tiết lên
  const [statusBooking, setStatusBooking] = useState("");

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${URL}/shifts/all`, { withCredentials: true });
        setShifts(response.data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${URL}/shifts/vet-shift`, { withCredentials: true });
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    const getWeekDates = (date) => {
      const firstDayOfWeek = date.getDate() - date.getDay() + 1; // Ngày đầu tiên của tuần (thứ 2)
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(firstDayOfWeek + i);
        return newDate;
      });
      setDates(weekDates);
    };

    fetchShifts();
    fetchSchedule();
    getWeekDates(currentWeek);
  }, [currentWeek]);

  const handlePreviousWeek = () => {
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleDateFilter = () => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      setCurrentWeek(date);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const dateObj = new Date(isoDate);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'long' }); // Định dạng ngày thành Mon, Tue, Wed, ...
  };

  const handleShowModal = (scheduledShift, status) => {
    setModalData(scheduledShift);
    setStatusBooking(status)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const cellStyle = {
    height: '50px', // Adjust as needed
    width: '100px', // Adjust as needed
    textAlign: 'center',
    verticalAlign: 'middle'
  };

  const headerCellStyle = {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    padding: '10px',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'center'
  };

  //Tính tuổi của pet dựa vào dob (đơn vị month(s))
  const today = new Date();
  const dob = new Date(modalData?.bookings[0]?.pet?.dob);
  const diffMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
  const age = diffMonths !== 0 ? diffMonths : 1;

  //Che sđt
  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'N/A';
    // Tính số lượng chữ 'x' cần hiển thị
    const totalLength = phoneNumber.length;
    const numberOfXLetters = totalLength - 5; // 3 số đầu và 2 số cuối không bị che giấu

    const maskedPart = 'x'.repeat(numberOfXLetters); // Tạo chuỗi 'x'
    return phoneNumber.slice(0, 3) + maskedPart + phoneNumber.slice(-2);
  };

  //Che địa chỉ
  const maskAddress = (address) => {
    if (!address) return 'N/A';

    //Các số đầu tiền là số nhà nên che = x
    return address.replace(/^\d+/, match => 'x'.repeat(match.length));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <div className="d-flex justify-content-between mb-3">
            <Button onClick={handlePreviousWeek} style={{ background: 'teal', color: 'white' }}>
              Previous Week
            </Button>
            <Button onClick={handleNextWeek} style={{ background: 'teal', color: 'white' }}>
              Next Week
            </Button>
          </div>
          <div className="d-flex mb-3">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="form-control"
              style={{ maxWidth: '200px' }}
            />
            <Button onClick={handleDateFilter} style={{ background: 'teal', color: 'white', marginLeft: '20px' }}>
              Filter by Date
            </Button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={headerCellStyle}>Work Shift</th>
                {dates.map((date, index) => (
                  <th key={index} style={headerCellStyle} className="text-center">
                    <div>{`${formatDay(date)}`}</div>
                    <div>{`${formatDate(date)}`}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, shiftIndex) => (
                <tr key={shiftIndex}>
                  <td style={cellStyle}>{`${shift.from_time} - ${shift.to_time}`}</td>
                  {dates.map((date, dateIndex) => {
                    const scheduledShift = schedule.find(
                      (item) =>
                        new Date(item.date).toLocaleDateString('en-GB') === formatDate(date) &&
                        item.shift.shiftId === shift.shiftId,
                    );
                    //Thêm vào lọc lại nếu chỉ mới thanh toán thì hiện màu vàng còn checkin rồi thì hiện màu xanh lá
                    const status = scheduledShift?.status === "Booked" && scheduledShift?.bookings?.find((booking) =>
                      booking?.status === 'PAID' || booking?.status === 'Checked_In' || booking?.status === 'DONE'
                    )?.status
                    const backgroundColor = status === 'PAID' ? '#FFC107' :
                      (status === 'Checked_In' || status === 'DONE') ? 'green' : '';
                    return (
                      <td
                        key={dateIndex}
                        style={{
                          ...cellStyle,
                          cursor: scheduledShift ? 'pointer' : 'default',
                          backgroundColor: backgroundColor,
                          color: scheduledShift ? 'white' : ''
                        }}
                        onClick={() => scheduledShift?.status === "Booked" && handleShowModal(scheduledShift, status)}
                      >
                        {scheduledShift?.status === "Booked" && scheduledShift?.bookings?.map((booking, index) => (
                          (booking?.status === "Checked_In" || booking?.status === "PAID") ? (
                            <div key={index}>
                              <strong>{booking?.user?.fullName}</strong>
                              <div>{booking?.pet?.name} ({booking?.pet?.petType})</div>
                            </div>
                          ) : (booking?.status === "DONE" && <div key={index} className='fw-bold'>DONE</div>)
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        dialogClassName="modal-dialog-centered"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5>Customer Information</h5>
                  <p><strong>Name:</strong> {modalData.bookings[0].user.fullName ? modalData.bookings[0].user.fullName : 'N/A'}</p>
                  <p><strong>Address:</strong> {maskAddress(modalData.bookings[0].user.address)}</p>
                  <p><strong>Phone:</strong> {maskPhoneNumber(modalData.bookings[0].user.phoneNumber)}</p>
                  <p><strong>Dob:</strong> {formatDate(modalData.bookings[0].user.dob) ? formatDate(modalData.bookings[0].user.dob) : 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <h5>Pet Information</h5>
                  <p><strong>Name:</strong> {modalData.bookings[0].pet.name ? modalData.bookings[0].pet.name : 'N/A'}</p>
                  <p><strong>Age:</strong> {age ? age + ' month(s)' : 'N/A'}</p>
                  <p><strong>Gender:</strong> {modalData.bookings[0].pet.gender ? modalData.bookings[0].pet.gender : 'N/A'}</p>
                  <p><strong>Breed:</strong> {modalData.bookings[0].pet.breed ? modalData.bookings[0].pet.breed : 'N/A'}</p>
                </div>
              </div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Description</th>
                    {/* <th>Price</th> */}
                  </tr>
                </thead>
                <tbody>
                  {modalData.bookings[0].bookingDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{detail.petService.nameService ? detail.petService.nameService : 'N/A'}</td>
                      <td>{detail.petService.description ? detail.petService.description : 'N/A'}</td>
                      {/* <td>{detail.petService.price}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="col-md-6">
                <p><strong>Booking Description:</strong> {modalData.bookings[0].description ? modalData.bookings[0].description : 'N/A'}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {modalData && (
            //Check in rồi mới cho bác sĩ view vào để khám
            statusBooking === "Checked_In" && <Button style={{ background: 'teal', color: 'white' }}>
              {/* Thêm state { fromButton: true } vào để chặn vet view = đường dẫn link chỉ có thể vào bằng cách nhấn nút này */}
              {/* Thêm state { booking: modalData.bookings[0] } vào để gửi booking đã chọn qua trang viewPet */}
              <Link to={`/viewPet/${modalData.bookings[0].pet.petId}`} state={{ fromButton: true, booking: modalData.bookings[0] }} >
                View Pet
              </Link>
            </Button>

          )}
          <Button variant="secondary" style={{ background: 'red', color: 'white' }} onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
