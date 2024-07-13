import {
    Box, Button, FormControl, FormLabel, Image, Input, Modal,
    ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Select, Text, useDisclosure
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import ReactPaginate from 'react-paginate'
import { format } from 'date-fns'
import { CancelPresentation, CheckBox } from '@mui/icons-material'
import { URL } from '../utils/constant';

export default function RefundRequests() {
    const navigate = useNavigate()
    const { isOpen: isOpenRefuseModal, onOpen: onOpenRefuseModal, onClose: onCloseRefuseModal } = useDisclosure()
    const { isOpen: isOpenDetailModal, onOpen: onOpenDetailModal, onClose: onCloseDetailModal } = useDisclosure()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const pageSize = 10
    const [bookings, setBookings] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [reason, setReason] = useState('')

    const handlePageClick = (data) => {
        setCurrentPage(data.selected)
    }

    useEffect(() => {
        const fetchBookingsNeedRefund = async (page, status) => {
            try {
                const response = await axios.get(`${URL}/get-bookings-by-status/${status}?page=${page}&size=${pageSize}`, { withCredentials: true })
                if (response.data.message === 'Successfully') {
                    setTotalPages(response.data.bookings.totalPages)
                    setBookings(response.data.bookings.content)
                } else {
                    toast.warning(response.data.message)
                }
            } catch (e) {
                navigate('/404page')
            }
        }
        fetchBookingsNeedRefund(currentPage, "Request Refund")
    }, [currentPage])

    const acceptRefundRequest = async (booking) => {
        try {
            const response = await axios.put(`${URL}/accept-refund/booking/${booking.id}`, {}, { withCredentials: true })
            if (response.data.message === 'successfully') {
                toast.success('Refund confirmation successed')
                window.location.reload()
            } else {
                toast.warning('Refund confirmation failed')
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    const refuseRefundRequest = async (booking) => {
        try {
            const response = await axios.put(`${URL}/refuse-refund/booking/${booking.id}?reason=${reason}`, {}, { withCredentials: true })
            if (response.data.message === 'successfully') {
                toast.success('Refused refund successed')
                window.location.reload()
            } else {
                toast.warning('Refused refund failed')
            }
        } catch (e) {
            navigate('/404page')
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div>
                    <table className="table table-hover shadow mt-5">
                        <thead >
                            <tr className='text-center'>
                                <th className="col"> Booking ID</th>
                                <th className="col">Appointment Date</th>
                                <th className="col">Refund Request Date</th>
                                <th className='col'>Total Amount</th>
                                <th className='col'>Amount Refund</th>
                                <th className='col'>Refund To</th>
                                <th className='col'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings?.map((booking, index) => {
                                const vetShiftDetail = booking.vetShiftDetail
                                const shift = booking.vetShiftDetail.shift
                                const cust = booking.pet.owner

                                const [year, month, day] = vetShiftDetail?.date.split('-');
                                const [hour, minute] = shift.from_time.split(':');
                                const appointmentDate = new Date(`${year}/${month}/${day} ${hour}:${minute}`);

                                const strAppointmentDate = format(appointmentDate, "dd/MM/yyyy hh:mm")
                                const strRefundDate = format(booking.refundDate, "dd/MM/yyyy hh:mm")

                                const diffDays = Math.ceil((appointmentDate - new Date(booking?.refundDate)) / (1000 * 60 * 60 * 24));
                                const refundPercentage = diffDays >= 7 ? 1 : (diffDays >= 3 ? 0.75 : 0)

                                return (
                                    <tr key={index} className='text-center item'>
                                        <td style={{ cursor: 'pointer', color: 'Teal' }} onClick={() => { setSelectedBooking(booking); onOpenDetailModal() }}>B{booking.id}</td>
                                        <td>{strAppointmentDate}</td>
                                        <td>{strRefundDate}</td>
                                        <td>{booking.totalAmount.toLocaleString('vi-VN')} VND</td>
                                        <td>{(booking.totalAmount * refundPercentage).toLocaleString('vi-VN')} VND</td>
                                        <td>{cust.phoneNumber}</td>
                                        <td>
                                            <FormControl marginLeft={2}>
                                                <span style={{ marginRight: '20px' }} className='icon-container'>
                                                    <CheckBox style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'}
                                                        onClick={() => acceptRefundRequest(booking)}
                                                    />
                                                    <span className="icon-text">Confirm Refunded</span>
                                                </span>
                                                <span style={{ marginRight: '20px' }} className='icon-container'>
                                                    <CancelPresentation style={{ color: 'red', cursor: 'pointer' }} boxSize={'5'}
                                                        onClick={() => { setSelectedBooking(booking); onOpenRefuseModal() }}
                                                    />
                                                    <span className="icon-text">Refuse to refund</span>
                                                </span>
                                            </FormControl>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <Modal isOpen={isOpenRefuseModal} onClose={onCloseRefuseModal} size={'xl'}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader className='fw-bold text-center my-3 justify-content-center fs-5'>Please enter the reason for your refusal</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6} >
                                <FormControl className='d-flex'>
                                    <FormLabel className='w-100'>
                                        Reason
                                        <Input value={reason} onChange={(e) => setReason(e.target.value)} />
                                    </FormLabel>
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='teal' mr={3} mb={3} onClick={() => refuseRefundRequest(selectedBooking)}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </div>
            </div>
            <div className=''>
                <ReactPaginate style={{ background: 'teal' }}
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination justify-content-center'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                />
            </div>

            {selectedBooking && (
                <Modal isOpen={isOpenDetailModal} onClose={onCloseDetailModal} size='3xl'>
                    <ModalOverlay />
                    <ModalContent marginTop={5}>
                        <ModalHeader pb={0}>
                            <Box display='flex' alignItems='center' className='fs-5'>
                                <Image src="logoApp.svg" alt="Logo" className="logo" /> Pet Health Care
                            </Box>
                            <Text textAlign='center' mb={3} className='fs-3'>
                                Booking Details #{selectedBooking.id}
                            </Text>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="invoice-container">
                                <div className="invoice-head">
                                    <div className="invoice-head-middle">
                                        <div className="invoice-head-middle-left text-start">
                                            <p>
                                                <span className="text-bold">Booking Date</span>: {format(new Date(selectedBooking.bookingDate), 'dd/MM/yyyy')}
                                            </p>
                                            <p>
                                                <span className="text-bold">Appointment Date</span>: {format(new Date(selectedBooking.vetShiftDetail.date), 'dd/MM/yyyy')}
                                            </p>
                                        </div>

                                        <div className="invoice-head-middle-right text-end">
                                            <p><span className="text-bold">Booking No:</span> {selectedBooking.id}</p>
                                        </div>
                                        <div className="invoice-head-middle-left text-start">
                                            <p><span className="text-bold">Description</span>: {selectedBooking.description}</p>
                                        </div>
                                    </div>
                                    <div className="hr"></div>
                                    <div className="invoice-head-bottom row mb-3">
                                        <div className="invoice-head-bottom-left col-6 ">
                                            <ul className='customer-info'>
                                                <li className='text-bold'>Customer Information</li>
                                                <li><b>Name: </b>{selectedBooking.user.fullName || 'N/A'}</li>
                                                <li><b>Address: </b>{selectedBooking.user.address || 'N/A'}</li>
                                                <li><b>Phone: </b>{selectedBooking.user.phoneNumber || 'N/A'}</li>
                                                <li><b>Dob: </b>{format(new Date(selectedBooking.user.dob), 'dd/MM/yyyy') || 'N/A'}</li>
                                            </ul>
                                        </div>
                                        <div className="invoice-head-bottom-right col-6">
                                            <ul className="pet-info">
                                                <li className='text-bold'>Pet Information</li>
                                                <li><b>Name: </b>{selectedBooking.pet.name || 'N/A'}</li>
                                                <li><b>Age: </b>{selectedBooking.pet.age || 'N/A'}</li>
                                                <li><b>Gender: </b>{selectedBooking.pet.gender || 'N/A'}</li>
                                                <li><b>Breed: </b>{selectedBooking.pet.breed || 'N/A'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-view">
                                    <div className="invoice-body">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td className='text-bold'>#</td>
                                                    <td className="text-bold">Service</td>
                                                    <td className="text-bold">Description</td>
                                                    <td className="text-end text-bold" >Price</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedBooking.bookingDetails.map((detail, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{detail.petService.nameService}</td>
                                                        <td>{detail.petService.description}</td>
                                                        <td className="text-end">{detail.petService.price.toLocaleString('vi-VN')} VND</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="invoice-body-bottom">
                                            <div className="info-item-td text-end text-bold">Total</div>
                                            <div className="info-item-td text-end">{selectedBooking.totalAmount.toLocaleString('vi-VN')} VND</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" onClick={onCloseDetailModal}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
