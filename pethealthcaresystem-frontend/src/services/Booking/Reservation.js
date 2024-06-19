import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservation = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [bookingDetails, setBookingDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:8080/bookings", { withCredentials: true });
                setBookings(response.data.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    const viewDetail = async (bookingId) => {
        try {
            const booking = bookings.find(booking => booking.id === bookingId);
            setSelectedBooking(booking);
            const response = await axios.get(`http://localhost:8080/get-booking/${bookingId}/details`, { withCredentials: true });

            console.log(response.data); // Ensure the response structure matches your expectations
            setBookingDetails(response.data.data); // Set bookingDetails state with the fetched details
            setShowModal(true); // Show modal after fetching details
        } catch (error) {
            console.error(`Error fetching booking details for ID ${bookingId}:`, error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBookingId(null);
        setBookingDetails([]);
    };
    function formatPrice(price) {
        // Convert price to a number (in case it's a string or something else)
        price = Number(price);

        // Format the price using toLocaleString with options
        return price.toLocaleString('vi-VN'); // 'vi-VN' is for Vietnamese locale, adjust as needed
    }
    return (
        <div className='container'>
            {/* <h1>Booking List</h1> */}
            <table className="table py-5">
                <thead>
                    <tr>
                        <th scope="col">BookingID</th>
                        <th scope="col">Appoinment Date</th>
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
                            <td className="col-2"><span class="badge bg-success">PAID</span></td>
                            <td className='col-3'>
                                <button type="button" class="btn btn-outline-info btn-sm" onClick={() => viewDetail(booking.id)}>Detail</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Booking Details #{selectedBooking.id}</h5>
                                {/* <button type="button" className="close" onClick={closeModal} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button> */}
                            </div>
                            <div className="modal-body">
                                <ul>
                                    {bookingDetails.map((detail, index) => (
                                        <div key={index}>
                                            <h4>Customer</h4>
                                            <div style={{ marginLeft: '20px' }}>
                                                <p><strong>Name: </strong>{selectedBooking.pet.owner.fullName}</p>
                                                <p><strong>Phone: </strong>{selectedBooking.pet.owner.phoneNumber}</p>
                                                <p><strong>Email: </strong>{selectedBooking.pet.owner.email}</p>
                                                <p><strong>Address: </strong>{selectedBooking.pet.owner.address}</p>
                                            </div>

                                            <h4>Service</h4>
                                            <div style={{ marginLeft: '20px' }}>
                                                <p><strong>Name: </strong>{detail.petService.nameService}</p>
                                                <p><strong>Price: </strong>{formatPrice(detail.petService.price)} VND</p>
                                            </div>

                                            <h4>Pet</h4>
                                            <div style={{ marginLeft: '20px' }}>
                                                <p><strong>Name: </strong>{selectedBooking.pet.name}</p>
                                                <p><strong>Type: </strong>{selectedBooking.pet.petType}</p>
                                                <p><strong>Gender: </strong>{selectedBooking.pet.gender}</p>
                                                <p><strong>Age: </strong>{selectedBooking.pet.age} Year(s)</p>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
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

export default Reservation;
