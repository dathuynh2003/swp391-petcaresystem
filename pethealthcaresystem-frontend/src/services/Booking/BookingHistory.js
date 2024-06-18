import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number search

    // Number of bookings to display per page
    const pageSize = 5;

    useEffect(() => {
        fetchBookings();
    }, [currentPage]);

    const fetchBookings = async () => {
        try {
            let url = `http://localhost:8080/bookings-staff?pageNo=${currentPage}&pageSize=${pageSize}`;
            if (phoneNumber) {
                url += `&phoneNumber=${phoneNumber}`; // Add phone number to the query if it exists
            }
            const response = await axios.get(url, { withCredentials: true });
            const { content, totalPages } = response.data.data;
            setBookings(content);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Error fetching bookings. Please try again later.");
        }
    };

    const viewDetail = async (bookingId) => {
        try {
            const booking = bookings.find(booking => booking.id === bookingId);
            setSelectedBooking(booking);
            const response = await axios.get(`http://localhost:8080/get-booking/${bookingId}/details`, { withCredentials: true });
            setBookingDetails(response.data.data);
            setShowModal(true);
        } catch (error) {
            console.error(`Error fetching booking details for ID ${bookingId}:`, error);
            setError("Error fetching booking details. Please try again later.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setBookingDetails([]);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page when performing a new search
        fetchBookings();
    };

    function formatPrice(price) {
        return Number(price).toLocaleString('vi-VN');
    }

    return (
        <div className='container'>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            {/* Search input for phone number */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter customer phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleSearch}>
                    Search
                </button>
            </div>

            <table className="table py-5">
                <thead>
                    <tr>
                        <th scope="col">BookingID</th>
                        <th scope="col">Appointment Date</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {bookings.map((booking, index) => (
                        <tr key={index}>
                            <td className="col-1">B{booking.id}</td>
                            <td className='col-2'>{new Date(booking.vetShiftDetail.date).toLocaleDateString()}</td>
                            <td className="col-2">{formatPrice(booking.totalAmount)} VND</td>
                            <td className="col-2">
                                <span className={booking.status === 'Pending' ? 'btn btn-warning' : (booking.status === 'CANCELLED' ? 'btn btn-danger' : 'btn btn-success')}>{booking.status}</span>
                            </td>
                            <td className='col-3'>
                                <button type="button" className="btn btn-outline-info btn-sm" onClick={() => viewDetail(booking.id)}>Detail</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Booking Details #{selectedBooking.id}</h5>
                            </div>
                            <div className="modal-body">
                                <h4>Customer</h4>
                                <div style={{ marginLeft: '20px' }}>
                                    <p><strong>Name: </strong>{selectedBooking.pet.owner.fullName}</p>
                                    <p><strong>Phone: </strong>{selectedBooking.pet.owner.phoneNumber}</p>
                                    <p><strong>Email: </strong>{selectedBooking.pet.owner.email}</p>
                                    <p><strong>Address: </strong>{selectedBooking.pet.owner.address}</p>
                                </div>
                                <h4>Service</h4>
                                <div style={{ marginLeft: '20px' }}>
                                    {bookingDetails.map((detail, index) => (
                                        <div key={index}>
                                            <p><strong>Name: </strong>{detail.petService.nameService}</p>
                                            <p><strong>Price: </strong>{formatPrice(detail.petService.price)} VND</p>
                                        </div>
                                    ))}
                                </div>
                                <h4>Pet</h4>
                                <div style={{ marginLeft: '20px' }}>
                                    <p><strong>Name: </strong>{selectedBooking.pet.name}</p>
                                    <p><strong>Type: </strong>{selectedBooking.pet.petType}</p>
                                    <p><strong>Gender: </strong>{selectedBooking.pet.gender}</p>
                                    <p><strong>Age: </strong>{selectedBooking.pet.age} Year(s)</p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
