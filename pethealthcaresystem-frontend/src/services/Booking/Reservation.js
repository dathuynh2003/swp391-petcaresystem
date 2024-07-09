import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Badge, useToast, useDisclosure, Spinner, Flex, TableContainer, TableCaption, Tfoot,
    FormControl,
    FormLabel,
    Input,
    Image
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import './Invoice.css'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RepeatIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


const Reservation = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenRefundModal, onOpen: onOpenRefundModal, onClose: onCloseRefundModal } = useDisclosure();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [totalPages, setTotalPages] = useState(1);   // Total number of pages
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState(null)    //Lưu owner để hiển thị vào modal refund
    const [pet, setPet] = useState(null)        //Lưu pet để hiển thị vào modal refund
    const [appointmentTime, setAppointmentTime] = useState('')  //Lưu để hiển thị vào modal refund
    const [refundPercentage, setRefundPercentage] = useState(null)

    const pageSize = 5
    useEffect(() => {
        fetchBookings();
    }, [currentPage]);

    const fetchBookings = async () => {
        setLoading(false)
        try {
            const response = await axios.get('http://localhost:8080/reservations', {
                params: {
                    pageNo: currentPage,
                    pageSize: pageSize
                }, withCredentials: true
            });
            // setBookings(response.data.data.content);
            // setLoading(false); // Set loading to false after data is fetched
            const { content, totalPages } = response.data.data;
            console.log(response.data.data);
            setBookings(content)
            setTotalPages(totalPages)

        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast({
                title: "Error",
                description: "Failed to fetch bookings. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setLoading(false)
        }
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    const formatDateTime = (dateString, formatter) => {
        try {
            const date = parseISO(dateString);
            return format(date, formatter);
        } catch (error) {
            console.error('Invalid date:', dateString);
            return 'Invalid Date';
        }
    };

    const viewDetail = async (bookingId) => {
        try {
            const booking = bookings.find(booking => booking.id === bookingId);
            setSelectedBooking(booking);
            // Fetch details for selected booking if needed
            onOpen();
        } catch (error) {
            console.error(`Error fetching booking details for ID ${bookingId}:`, error);
            toast({
                title: "Error",
                description: `Error fetching booking details for ID ${bookingId}`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const formatPrice = (price) => {
        price = Number(price);
        return price.toLocaleString('vi-VN');
    };
    // const handleNextPage = () => {
    //     if (currentPage < totalPages - 1) {
    //         setCurrentPage(currentPage + 1);
    //     }
    // };
    // const handlePrevPage = () => {
    //     if (currentPage > 0) {
    //         setCurrentPage(currentPage - 1);
    //     }
    // };
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
    // const generatePDF = () => {
    //     const doc = new jsPDF();

    //     // Example: Add content to PDF
    //     doc.text(`Booking Details #${selectedBooking.id}`, 10, 10);
    //     doc.text(`Booking Date: ${formatDateTime(selectedBooking.bookingDate)}`, 10, 20);
    //     doc.text(`Appointment Date: ${formatDateTime(selectedBooking.vetShiftDetail.date)}`, 10, 30);
    //     doc.text(`Booking No: ${selectedBooking.id}`, 10, 40);
    //     doc.text(`Description: ${selectedBooking.description}`, 10, 50);

    //     let yPos = 70;
    //     selectedBooking.bookingDetails.forEach((detail, index) => {
    //         yPos += 10;
    //         doc.text(`${index + 1}. ${detail.petService.nameService}`, 10, yPos);
    //         yPos += 10;
    //         doc.text(`   Description: ${detail.petService.description}`, 10, yPos);
    //         yPos += 10;
    //         doc.text(`   Price: ${formatPrice(detail.petService.price)}`, 10, yPos);
    //     });

    //     doc.save(`Booking_Detail_${selectedBooking.id}.pdf`);
    // };
    // const printInvoice = () => {
    //     window.print();
    //};
    // const printRef = useRef(null); 

    // const handlePrint = () => {
    //     const input = printRef.current;

    //     html2canvas(input).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'mm', 'a4');
    //         pdf.addImage(imgData, 'PNG', 0, 0);
    //         pdf.save(`booking_detail_${selectedBooking.id}.pdf`);
    //     });
    // };

    const handleClickRefund = async (booking, appointmentTime, refundPercentage) => {
        onOpenRefundModal()
        const pet = booking.pet
        setPet(pet)
        setOwner(pet.owner)
        setSelectedBooking(booking)
        setAppointmentTime(appointmentTime)
        setRefundPercentage(refundPercentage)
    }
    const handleRequestRefund = async (bookingId) => {
        try {
            const response = await axios.put(`http://localhost:8080/refund/booking/${bookingId}`, {}, { withCredentials: true })
            if (response.data.message === 'successfully') {
                // toast.success('Send request refund successfully')
                toast({
                    title: "Success",
                    description: "Send request refund successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                window.location.reload()
            } else {
                toast.warning(response.data.message)
            }
        } catch (e) {
            // navigate('/404page')
            console.log(e.message)
        }
    }

    return (
        <Box p={5}>
            <Box>
                <Table variant="striped" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th>Booking ID</Th>
                            <Th>Booking Date</Th>
                            <Th>Appointment Date</Th>
                            <Th>Slot</Th>
                            <Th>Amount</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bookings.map((booking) => {
                            const vetShiftDetail = booking.vetShiftDetail
                            const shift = booking.vetShiftDetail.shift
                            // Tạo đối tượng Date từ date và from_time
                            const [year, month, day] = vetShiftDetail?.date.split('-');
                            const [hour, minute] = shift.from_time.split(':');
                            const appointmentDate = new Date(`${year}/${month}/${day} ${hour}:${minute}`); //Ngày giờ khám!

                            // Định dạng lại ngày giờ (dd/MM/yyyy hh:mm)
                            const formattedDate = `${String(appointmentDate.getDate()).padStart(2, '0')}/${String(appointmentDate.getMonth() + 1).padStart(2, '0')}/${String(appointmentDate.getFullYear())}`
                            const formattedTime = `${String(appointmentDate.getHours()).padStart(2, '0')}:${String(appointmentDate.getMinutes()).padStart(2, '0')}`
                            const strAppointmentTime = `${formattedDate} ${formattedTime}`  //dùng để in ra nếu cần thiết.

                            const isCancelable = new Date() < appointmentDate && booking.status === 'PAID';
                            // console.log(booking.id, " - ", strAppointmentTime)

                            //Tỉ lệ hoàn lại
                            const diffDays = Math.ceil((appointmentDate - new Date()) / (1000 * 60 * 60 * 24));
                            const refundPercentage = diffDays >= 7 ? 1 : (diffDays >= 3 ? 0.75 : 0)
                            // console.log(booking.id, " - ", diffDays, "-", refundPercentage);


                            return (
                                <Tr key={booking.id}>
                                    <Td><b>B{booking.id}</b></Td>
                                    <Td><b>{formatDateTime(booking.bookingDate, 'dd/MM/yyyy')}</b></Td>
                                    <Td><b>{formatDateTime(booking.vetShiftDetail.date, 'dd/MM/yyyy')}</b></Td>
                                    <Td><b>{booking.vetShiftDetail.shift.from_time} - {booking.vetShiftDetail.shift.to_time}</b></Td>
                                    <Td><b>{formatPrice(booking.totalAmount)} VND</b></Td>
                                    <Td>
                                        {booking.status === "PAID" && <Badge colorScheme="green">{booking.status}</Badge>}
                                        {booking.status === "Request Refund" && <Badge colorScheme="yellow">{booking.status}</Badge>}
                                        {booking.status === "Refunded" && <Badge colorScheme="green">{booking.status}</Badge>}
                                    </Td>
                                    <Td>
                                        {/* <Button size="sm" colorScheme="blue" onClick={() => viewDetail(booking.id)}>Detail</Button> */}
                                        <FormControl marginLeft={2}>
                                            <span style={{ marginRight: '20px' }} className='icon-container'>
                                                <ViewIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} onClick={() => viewDetail(booking.id)} />
                                                <span className="icon-text">View</span>
                                            </span>
                                            {isCancelable &&
                                                <span style={{ marginRight: '20px' }} className='icon-container'>
                                                    <RepeatIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'}
                                                        onClick={() => handleClickRefund(booking, strAppointmentTime, refundPercentage)} />
                                                    <span className="icon-text">Request Payment Refund</span>
                                                </span>
                                            }
                                        </FormControl>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
                {/* <Flex mt={4} justifyContent="center" alignItems="center">
                    <Button size="sm" onClick={handlePrevPage} isDisabled={currentPage === 0}>Previous</Button>
                    <Text mx={4}>Page {currentPage + 1} of {totalPages}</Text>
                    <Button size="sm" onClick={handleNextPage} isDisabled={currentPage === totalPages - 1}>Next</Button>
                </Flex> */}
            </Box>
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                <Text>Page {currentPage} of {totalPages}</Text>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
            </Box>

            <Modal isOpen={isOpenRefundModal} onClose={onCloseRefundModal} size={'3xl'} >
                <ModalOverlay />
                <ModalContent marginTop={5}>
                    <ModalHeader pb={0}>
                        <Box display='flex' alignItems='center' className='fs-5'>
                            <Image src="logoApp.svg" alt="Logo" className="logo" /> Pet Health Care
                        </Box>
                        <Text textAlign='center' mb={3} className='fs-3'>
                            Request Cancellation And Refund
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='py-0'>
                        <FormControl mt={4} className='d-flex'>
                            <FormLabel className='w-50'>
                                Pet's owner
                                <Input readOnly value={owner?.fullName} />
                            </FormLabel>
                            <FormLabel className='w-50'>
                                Phone number
                                <Input readOnly value={owner?.phoneNumber} />
                            </FormLabel>
                        </FormControl>
                        <FormControl className='d-flex'>
                            <FormLabel className='w-50'>
                                Pet's name
                                <Input readOnly value={pet?.name} />
                            </FormLabel>
                            <FormLabel className='w-50'>
                                Pet's type
                                <Input readOnly value={pet?.petType} />
                            </FormLabel>
                        </FormControl>
                        <FormControl className='d-flex justify-content-between'>
                            <FormLabel>Pet's breed <Input readOnly value={pet?.breed} /></FormLabel>
                            <FormLabel>Pet's sex <Input readOnly value={pet?.gender} /></FormLabel>
                            <FormLabel>Pet's age <Input readOnly value={pet?.age} /></FormLabel>
                        </FormControl>
                        <FormControl className='d-flex mt-3'>
                            <FormLabel className='w-100'>
                                <Input readOnly value="Refund Infomation" className='text-center fw-bold' />
                            </FormLabel>
                        </FormControl>
                        <FormControl className='d-flex'>
                            <FormLabel className='w-50'>
                                Booking Date
                                <Input readOnly value={selectedBooking?.bookingDate ? formatDateTime(selectedBooking.bookingDate, 'dd/MM/yyyy hh:mm') : 'N/A'} />
                            </FormLabel>
                            <FormLabel className='w-50'>
                                Appointment Date
                                <Input readOnly value={appointmentTime} />
                            </FormLabel>
                        </FormControl>
                        <FormControl className='d-flex justify-content-between'>
                            <FormLabel className='mb-0 w-50'>
                                <Text className='text-danger text-center mb-0 fw-bold'>Refund Policy</Text>
                                <Text className='text-danger my-0'>
                                    * Full refund (100%): If cancellation is made at least 7 days in advance<br />
                                    * Partial refund (75%): If cancellation is made between 3 to 6 days in advance<br />
                                    * No refund (0%): For all other cases <br />
                                    *Refund via momo using the phone number in the user profile
                                </Text>
                            </FormLabel>
                            <FormLabel className='w-50'>
                                Amount booking
                                <Input readOnly value={selectedBooking?.totalAmount.toLocaleString('vi-VN') + " VND"} />
                                Amount refunded
                                <Input className="fw-bold" readOnly value={(selectedBooking?.totalAmount * refundPercentage).toLocaleString('vi-VN') + " VND"} />
                            </FormLabel>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter className='pt-0'>
                        <Button colorScheme="red" mr={3} onClick={() => onCloseRefundModal()}>
                            Close
                        </Button>
                        <Button colorScheme="green" onClick={() => {
                            handleRequestRefund(selectedBooking.id);
                            onCloseRefundModal();
                        }}>
                            Refund
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>

            {selectedBooking && (
                <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Booking Details #{selectedBooking.id}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="invoice-wrapper" id="print-area">
                                <div className="invoice">
                                    <div className="invoice-container">
                                        <div className="invoice-head">
                                            <div className="invoice-head-top">
                                                <div className="invoice-head-top-left text-start">
                                                    <img src="/assets/logoPetCare.png" alt="Logo" />
                                                </div>
                                                <div className="invoice-head-top-right text-end">
                                                    <h3>Booking Detail #{selectedBooking.id}</h3>
                                                </div>
                                            </div>
                                            <div className="hr"></div>
                                            <div className="invoice-head-middle">
                                                <div className="invoice-head-middle-left text-start">
                                                    <p>
                                                        <span className="text-bold">Booking Date</span>:
                                                        {formatDateTime(selectedBooking.bookingDate, 'dd/MM/yyyy')}
                                                    </p>
                                                    <p>
                                                        <span className="text-bold">Appointment Date</span>:
                                                        {formatDateTime(selectedBooking.vetShiftDetail.date, 'dd/MM/yyyy')}
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
                                                        <li><b>Dob: </b>{selectedBooking.user.dob || 'N/A'}</li>
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
                                                                <td className="text-end">{formatPrice(detail.petService.price)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="invoice-body-bottom">
                                                    {/* <div className="invoice-body-info-item border-bottom">
                                                        <div className="info-item-td text-end text-bold">Sub Total:</div>
                                                        <div className="info-item-td text-end">{selectedBooking.bookingDetails.reduce((acc, detail) => acc + detail.amount, 0)}</div>
                                                    </div> */}
                                                    <div className="invoice-body-info-item border-bottom">
                                                        <div className="info-item-td text-end text-bold">Tax:</div>
                                                        <div className="info-item-td text-end"></div>
                                                    </div>
                                                    <div className="invoice-body-info-item">
                                                        <div className="info-item-td text-end text-bold">Total:</div>
                                                        <div className="info-item-td text-end">{formatPrice(selectedBooking.bookingDetails.reduce((acc, detail) => acc + detail.petService.price, 0))} VND</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose}>Close</Button>
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
        </Box>
    );
};

export default Reservation;
