import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

export default function VetWorkSchedules() {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/shifts/all', { withCredentials: true });
        setShifts(response.data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:8080/shifts/vet-shift', { withCredentials: true });
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

  const handleShowModal = (scheduledShift) => {
    setModalData(scheduledShift);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const getFieldValue = (value) => (value !== "" && value !== null && value !== undefined ? value : "N/A");

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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-primary" onClick={handlePreviousWeek}>
              Previous Week
            </button>
            <button className="btn btn-primary" onClick={handleNextWeek}>
              Next Week
            </button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={headerCellStyle}>Work Shift</th>
                {dates.map((date, index) => (
                  <th key={index} style={headerCellStyle} className="text-center">{`${formatDay(date)} ${formatDate(date)}`}</th>
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
                    return (
                      <td
                        key={dateIndex}
                        style={{
                          ...cellStyle,
                          cursor: scheduledShift ? 'pointer' : 'default',
                          backgroundColor: scheduledShift ? '#188754' : '',
                          color: scheduledShift ? 'white' : ''
                        }}
                        onClick={() => scheduledShift?.status === "Booked" && handleShowModal(scheduledShift)}
                      >
                        {scheduledShift?.status === "Booked" && scheduledShift?.bookings?.map((booking, index) => (
                          booking?.status === "PAID" && (
                            <div key={index}>
                              <strong>{booking?.user?.fullName}</strong>
                              <div>{booking?.pet?.name} ({booking?.pet?.petType})</div>
                            </div>
                          )
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
                  <p><strong>Name:</strong> {getFieldValue(modalData.bookings[0].user.fullName)}</p>
                  <p><strong>Address:</strong> {getFieldValue(modalData.bookings[0].user.address)}</p>
                  <p><strong>Phone:</strong> {getFieldValue(modalData.bookings[0].user.phoneNumber)}</p>
                  <p><strong>Dob:</strong> {getFieldValue(formatDate(modalData.bookings[0].user.dob))}</p>
                </div>
                <div className="col-md-6">
                  <h5>Pet Information</h5>
                  <p><strong>Name:</strong> {getFieldValue(modalData.bookings[0].pet.name)}</p>
                  <p><strong>Age:</strong> {getFieldValue(modalData.bookings[0].pet.age)} (month(s))</p>
                  <p><strong>Gender:</strong> {getFieldValue(modalData.bookings[0].pet.gender)}</p>
                  <p><strong>Breed:</strong> {getFieldValue(modalData.bookings[0].pet.breed)}</p>
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
                      <td>{getFieldValue(detail.petService.nameService)}</td>
                      <td>{getFieldValue(detail.petService.description)}</td>
                      {/* <td>{getFieldValue(detail.petService.price)}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {modalData && (
            <Link to={`/viewPet/${modalData.bookings[0].pet.petId}`} className="btn btn-primary">
              View Pet
            </Link>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
