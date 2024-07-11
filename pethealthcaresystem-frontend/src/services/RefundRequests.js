import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react'
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
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const pageSize = 10
    const [bookings, setBookings] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [reason, setReason] = useState('')

    const handlePageClick = (data) => {
        // console.log(data.selected)
        setCurrentPage(data.selected)
    }

    useEffect(() => {
        const fetchBookingsNeedRefund = async (page, status) => {
            try {
                const response = await axios.get(`${URL}/get-bookings-by-status/${status}?page=${page}&size=${pageSize}`, { withCredentials: true })
                if (response.data.message === 'Successfully') {
                    console.log("bookings: ", response.data.bookings.content)
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
            // navigate('/404page')
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

                                // Tạo đối tượng Date từ date(ngày khám str) và from_time (thời gian khám str)
                                const [year, month, day] = vetShiftDetail?.date.split('-');
                                const [hour, minute] = shift.from_time.split(':');
                                const appointmentDate = new Date(`${year}/${month}/${day} ${hour}:${minute}`); //Ngày giờ khám!

                                const strAppointmentDate = format(appointmentDate, "dd/MM/yyyy hh:mm")
                                const strRefundDate = format(booking.refundDate, "dd/MM/yyyy hh:mm")

                                //Tỉ lệ hoàn lại
                                const diffDays = Math.ceil((appointmentDate - new Date(booking?.refundDate)) / (1000 * 60 * 60 * 24));
                                const refundPercentage = diffDays >= 7 ? 1 : (diffDays >= 3 ? 0.75 : 0)
                                // console.log(booking.id, " - ", diffDays, "-", booking.refundDate);

                                return (
                                    <tr key={index} className='text-center item'>
                                        <td>B{booking.id}</td>
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
