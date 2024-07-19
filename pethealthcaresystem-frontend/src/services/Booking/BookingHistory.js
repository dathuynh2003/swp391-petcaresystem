import React, { useState, useEffect, useCallback, Fragment } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    useDisclosure,
    VStack,
    Badge,
    Select,
    Flex,
    Image,
    Link
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'
import { faUser, faPaw, faXRay } from '@fortawesome/free-solid-svg-icons';
import { RepeatIcon, SearchIcon, ViewIcon } from '@chakra-ui/icons';
import { CheckCircleOutline, RadioButtonUnchecked, South } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { URL } from '../../utils/constant'
const BookingHistory = () => {
    const navigate = useNavigate()
    const [originalBookings, setOriginalBookings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isSearchByPhone, setIsSearchByPhone] = useState(false);
    const [isFilteredSearch, setIsFilteredSearch] = useState(false);
    const [searchType, setSearchType] = useState('all');
    const { isOpen: isOpenRefundModal, onOpen: onOpenRefundModal, onClose: onCloseRefundModal } = useDisclosure();
    const [owner, setOwner] = useState(null)    //Lưu owner để hiển thị vào modal refund
    const [pet, setPet] = useState(null)        //Lưu pet để hiển thị vào modal refund
    const [appointmentTime, setAppointmentTime] = useState('')  //Lưu để hiển thị vào modal refund
    //Tỉ lệ hoàn lại 100% vì là staff cacel nên có trách nhiệm hoàn lại 100%
    const refundPercentage = 1
    const [petAge, setPetAge] = useState(null)



    const { isOpen, onOpen, onClose } = useDisclosure();

    const pageSize = 5;

    useEffect(() => {
        if (searchType === 'phone') {
            fetchBookingsByPhoneNumber(currentPage);
        }
        else if (searchType === 'filter') {
            fetchFilteredBookings(currentPage);
        }
        else {
            fetchAllBookings(currentPage);
        }
    }, [currentPage, searchType]);


    useEffect(() => {
        if (status || fromDate || toDate) {
            setSearchType('filter');
            fetchFilteredBookings(1);
        }
    }, [status, fromDate, toDate]);




    const fetchAllBookings = async (page) => {
        setLoading(true);
        const pageNo = page ?? currentPage; // Default to currentPage if no page is provided
        try {
            const response = await axios.get(`${URL}/all-bookings?pageNo=${pageNo}&pageSize=${pageSize}`, { withCredentials: true });
            const { content, totalPages } = response.data.data;
            setOriginalBookings(content);
            setBookings(content);
            setTotalPages(totalPages);
            setError(null);
            setCurrentPage(Math.min(pageNo, totalPages));
        } catch (error) {
            setError("Error fetching bookings. Please try again later.");
            setBookings([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredBookings = async (page) => {
        setLoading(true);

        const pageNo = page ?? currentPage

        try {
            let url = `${URL}/staff-booking-date-status?` + `pageNo=${pageNo}&pageSize=${pageSize}`;

            if (status) {
                console.log(status)
                url += `&status=${status}`;
            }
            if (fromDate) {
                console.log(fromDate)
                url += `&fromDate=${fromDate}`;
            }
            url += `&toDate=${toDate.length === 0 ? moment(new Date()).format("YYYY-MM-DD") : toDate}`;
            console.log(url)
            console.log('&toDate=' + toDate.length === 0 ? moment(new Date()).format('yyyy-MM-dd') : toDate)
            const response = await axios.get(url, { withCredentials: true });
            const { content, totalPages } = response.data.data;
            setBookings(content);
            setTotalPages(totalPages);
            setError(null)
            setCurrentPage(Math.min(pageNo, totalPages));


        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Error fetching bookings. Please try again later.");
            setBookings([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingsByPhoneNumber = async (page) => {
        setLoading(true);
        const pageNo = page ?? currentPage;

        try {
            const response = await axios.get(`${URL}/bookings-staff?pageNo=${currentPage}&pageSize=${pageSize}&phoneNumber=${phoneNumber}`, { withCredentials: true });
            const { content, totalPages } = response.data.data;
            setBookings(content);
            setTotalPages(totalPages);
            setError(null); // Clear any previous errors
            setCurrentPage(Math.min(pageNo, totalPages)); // Ensure currentPage does not exceed totalPages

        } catch (error) {
            // console.error("Error fetching bookings by phone number:", error);
            setError("Error fetching bookings. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (phoneNumber) {
    //         fetchBookingsByPhoneNumber();
    //     }
    //     else {
    //         fetchAllBookings();
    //     }


    // }, [phoneNumber, fetchBookingsByPhoneNumber]);


    const viewDetail = async (bookingId) => {
        try {
            const booking = bookings.find(booking => booking.id === bookingId);
            console.log(booking)
            setSelectedBooking(booking);
            const response = await axios.get(`${URL}/get-booking/${bookingId}/details`, { withCredentials: true });
            setBookingDetails(response.data.data);
            onOpen();
        } catch (error) {
            console.error(`Error fetching booking details for ID ${bookingId}:`, error);
            setError("Error fetching booking details. Please try again later.");
        }
    };

    const closeModal = () => {
        setBookingDetails([]);
        onClose();
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
        setCurrentPage(1);
        // setIsSearchByPhone(true);
        setSearchType('phone');
        fetchBookingsByPhoneNumber(1);
    };

    // const handleFilterSearch = () => {
    //     setCurrentPage(1);
    //     setIsSearchByPhone(false);
    //     setIsFilteredSearch(true);
    // };


    const clearFilters = () => {
        setPhoneNumber('');
        setStatus('');
        setFromDate('');
        setToDate('');
        setBookings(originalBookings);
        setCurrentPage(1); // Reset to first page
        setIsSearchByPhone(false);
        setIsFilteredSearch(false);
        setSearchType('all'); // Reset search type to all
        fetchAllBookings(1); // Fetch bookings for the first page
    };


    const formatPrice = (price) => {
        return Number(price).toLocaleString('vi-VN');
    };
    const formatDateTime = (dateString, formatter) => {
        try {
            const date = parseISO(dateString);
            return format(date, formatter);
        } catch (error) {
            console.error('Invalid date:', dateString);
            return 'Invalid Date';
        }
    };

    const handleClickRefund = async (booking, appointmentTime) => {
        onOpenRefundModal()
        const pet = booking.pet
        //Tính tuổi của pet để hiển thị
        const today = new Date();
        const dob = new Date(pet.dob);
        // Tính số tháng chênh lệch giữa hai ngày
        const diffMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
        const age = diffMonths !== 0 ? diffMonths : 1;
        setPetAge(age)
        setPet(pet)
        setOwner(pet.owner)
        setSelectedBooking(booking)
        setAppointmentTime(appointmentTime)
    }

    const handleRequestRefund = async (bookingId) => {
        try {
            const response = await axios.put(`${URL}/refund-booking-by-staff/${bookingId}`, {}, { withCredentials: true })
            if (response.data.message === 'successfully') {
                toast.success('Send request refund successfully')
            } else {
                toast.warning(response.data.message)
            }
        } catch (e) {
            // navigate('/404page')
            console.log(e.message)
        }
    }
    // const handleExportPayments = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/export/payments', {
    //             responseType: 'blob', // Ensure response type is blob for file download
    //             withCredentials: true // Include credentials if required
    //         });

    //         // Create a blob object from the response data
    //         const blob = new Blob([response.data], { type: 'application/pdf' });

    //         // Create a URL for the blob object
    //         const url = window.URL.createObjectURL(blob);

    //         // Create a link element to initiate download
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'payments.pdf'); // Set the filename for download
    //         document.body.appendChild(link);
    //         link.click();

    //         // Clean up
    //         link.parentNode.removeChild(link);
    //     } catch (error) {
    //         console.error('Error exporting payments:', error);
    //         toast.error('Error exporting payments. Please try again later.');
    //     }
    // };
    // const handleExportPayments = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/export/payments', { responseType: 'blob' });

    //         // Create a Blob object from the CSV data
    //         const blob = new Blob([response.data], { type: 'text/csv' });

    //         // Create a link element to trigger the download
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'payments.csv');
    //         document.body.appendChild(link);

    //         // Trigger the download
    //         link.click();

    //         // Clean up: remove the temporary link and URL object
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error('Error exporting payments:', error);
    //         toast.error('Error exporting payments. Please try again later.');

    //         // Handle error, show a message to the user
    //     }
    // };


    //Tính tuổi của pet dựa vào dob (đơn vị month(s))
    const today = new Date();
    const dob = new Date(selectedBooking?.pet?.dob);
    const diffMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
    const age = diffMonths !== 0 ? diffMonths : 1;

    const handleCheckin = async (booking) => {
        console.log(booking)
        console.log(booking);

        // Cập nhật trạng thái của booking
        const updatedBooking = { ...booking, status: 'Checked_In' };
        // Call API
        try {
            const response = await axios.put(`${URL}/update-booking`, updatedBooking, { withCredentials: true })
            if (response.data.statusCode) {
                window.location.reload()
                toast.success("Check in successfully")
            }
        } catch (e) {
            navigate('404page')
        }

    }

    const getUpcomingRevisitBookings = async (page) => {
        const pageNo = page ?? currentPage;
        try {
            const response = await axios.get(`${URL}/upcoming-revisit-bookings?pageNo=${pageNo}&pageSize=${pageSize}`, { withCredentials: true })
            if (response.data.message === "successfully") {
                setBookings(response.data.content.content)
                setTotalPages(response.data.content.totalPages)
            } else {
                toast.warn(response.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (

        <Container maxW="container.xl" py={6}>
            {error && <Text color="red.500" mb={4}>{error}</Text>}
            {/* <Button onClick={handleExportPayments} colorScheme="teal" mb={4}>Export Payments</Button> */}

            <Flex justify="space-between" mb={3}>
                <FormControl className='row' mr={2}>
                    <InputGroup width="300px"> {/* Điều chỉnh độ rộng ở đây */}
                        <Input
                            id="phoneNumber"
                            placeholder="Enter customer phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label="Search"
                                icon={<SearchIcon />}
                                onClick={handleSearch}
                            />
                        </InputRightElement>
                    </InputGroup>
                    {/* Nút để filter các booking cần phải liên hệ để nhắc tái khái */}
                    <Button className='col-2 mx-3' colorScheme='teal' onClick={() => getUpcomingRevisitBookings(currentPage)}>Re-visit Reminders</Button>
                </FormControl>
                <Link
                    color="teal.500"
                    href={`${URL}/payments/export`}
                    textDecoration="none"
                    fontWeight="bold"
                    fontSize="16px"
                >
                    <FontAwesomeIcon icon={faFileExport} style={{ marginRight: '8px' }} />
                    Export File
                </Link>

                {loading && <Spinner size="lg" />}
            </Flex>
            <FormControl width="150px" mb={2}>
                <Flex justify="space-between">
                    <Flex flexDirection="column" mr={3}>
                        <FormLabel htmlFor="fromDate" mt={2}>From</FormLabel>
                        <Input
                            type="date"
                            id="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </Flex>
                    <Flex flexDirection="column" mr={3}>
                        <FormLabel htmlFor="toDate" mt={2}>To</FormLabel>
                        <Input
                            type="date"
                            id="toDate"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </Flex>
                    <Flex flexDirection="column">
                        <FormLabel htmlFor="status" mt={2}>Status</FormLabel>
                        <FormControl width="150px" id='status'>
                            <Select placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="REFUNDED">Refund</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="PAID">Paid</option>
                                <option value="Request Refund">Refund Requests</option>
                                <option value="Checked_In">Checked In</option>
                                <option value="DONE">Done</option>
                            </Select>
                        </FormControl>
                    </Flex>
                </Flex>
            </FormControl>
            <FormControl width="150px" marginTop="10px" mr={2}>

            </FormControl>
            {/* <Button onClick={handleFilterSearch} mb={4}>Search</Button> */}
            <Button onClick={clearFilters} mb={4}>Clear Filters</Button>


            {/* <FormControl width="150px" marginTop="10px">
                <Select placeholder="Select status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="PAID">Paid</option>
                </Select>
            </FormControl> */}
            {/* <FormControl width="150px" mb={4}>
                <FormLabel htmlFor="fromDate">From Date</FormLabel>
                <Input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                <FormLabel htmlFor="toDate" mt={2}>To Date</FormLabel>
                <Input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </FormControl> */}

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>BookingID</Th>
                        <Th>Appointment Date</Th>
                        <Th>Booking Date</Th>
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
                        return (
                            //Các booking có trạng thái CANCELLED (Booking nhưng hủy thanh toán thì k cần hiển thị
                            (booking?.status !== "CANCELLED") && <Tr key={booking.id}>
                                <Td>B{booking.id}</Td>
                                <Td>{formatDateTime(booking.vetShiftDetail.date, 'dd-MM-yyyy')} {booking.vetShiftDetail.shift.from_time} - {booking.vetShiftDetail.shift.to_time}</Td>
                                <Td>{formatDateTime(booking.bookingDate, 'dd-MM-yyyy HH:mm')}</Td>
                                <Td>{formatPrice(booking.totalAmount)} VND</Td>
                                <Td>
                                    {(booking.status === "PAID" || booking.status === "DONE") && <Badge colorScheme="green">{booking.status}</Badge>}
                                    {(booking.status === "Request Refund" || booking.status === 'Checked_In' || booking.status === "Pending") && <Badge colorScheme="yellow">{booking.status}</Badge>}
                                    {(booking.status === "Refunded") && <Badge colorScheme="red">{booking.status}</Badge>}
                                </Td>
                                <Td>
                                    {/* <Button size="sm" onClick={() => viewDetail(booking.id)}>Detail</Button> */}
                                    <FormControl marginLeft={2}>
                                        <span style={{ marginRight: '20px' }} className='icon-container'>
                                            <ViewIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} onClick={() => viewDetail(booking.id)} />
                                            <span className="icon-text">View</span>
                                        </span>
                                        {isCancelable &&
                                            <span style={{ marginRight: '20px' }} className='icon-container'>
                                                <RepeatIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'}
                                                    onClick={() => handleClickRefund(booking, strAppointmentTime)} />
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

            <Box mt={4} display="flex" justifyContent="space-between">
                {totalPages > 0 ? (
                    <>
                        <Button onClick={handlePreviousPage} isDisabled={currentPage === 1}>Previous</Button>
                        <Text>Page {currentPage} of {totalPages}</Text>
                        <Button onClick={handleNextPage} isDisabled={currentPage === totalPages}>Next</Button>
                    </>
                ) : (
                    <Text textColor="red" fontWeight="bold">No bookings found</Text>
                )}
            </Box>

            <Modal isOpen={isOpenRefundModal} onClose={onCloseRefundModal} size={'3xl'} >
                <ModalOverlay />
                <ModalContent marginTop={10}>
                    <ModalHeader pb={0}>
                        <Box display='flex' alignItems='center' className='fs-5'>
                            <Image src="logoApp.svg" alt="Logo" className="logo" /> Pet Health Care
                        </Box>
                        <Text textAlign='center' mb={3} className='fs-3'>
                            Request Cancellation Booking
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
                            <FormLabel>Pet's age <Input readOnly value={petAge + " month(s)"} /></FormLabel>
                        </FormControl>
                        <FormControl className='d-flex mt-3'>
                            <FormLabel className='w-100'>
                                <Input readOnly value="Refund Infomation" className='text-center fw-bold' />
                            </FormLabel>
                        </FormControl>
                        <FormControl className='d-flex justify-content-between'>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Booking ID</Th>
                                        <Th>Appointment Time</Th>
                                        <Th>Cancel Time</Th>
                                        <Th>Amount Paid</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>B{selectedBooking?.id}</Td>
                                        <Td>{appointmentTime}</Td>
                                        <Td>{format(new Date(), 'dd/MM/yyyy hh:mm')}</Td>
                                        <Td>{selectedBooking?.totalAmount.toLocaleString('vi-VN')} VND</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </FormControl>
                        <FormControl className='d-flex justify-content-between'>
                            <Box className='w-50 fst-italic fw-medium'>
                                {refundPercentage === 1 ?
                                    <Box>
                                        <CheckCircleOutline htmlColor='#50C8B4' />
                                        100% refund (Cancel at least 7 days in advance)
                                    </Box>
                                    :
                                    <Box>
                                        <RadioButtonUnchecked />
                                        100% refund (Cancel at least 7 days in advance)
                                    </Box>
                                }
                                {refundPercentage === 0.75 ?
                                    <Box>
                                        <CheckCircleOutline htmlColor='#50C8B4' />
                                        75% refund (Cancel 3 to 6 days in advance)
                                    </Box>
                                    :
                                    <Box>
                                        <RadioButtonUnchecked />
                                        75% refund (Cancel 3 to 6 days in advance)
                                    </Box>
                                }
                                {refundPercentage === 0 ?
                                    <Box>
                                        <CheckCircleOutline htmlColor='#50C8B4' />
                                        0% refund (Cancel 2 days or less in advance)
                                    </Box>
                                    :
                                    <Box>
                                        <RadioButtonUnchecked />
                                        0% refund (Cancel 2 days or less in advance)
                                    </Box>
                                }
                            </Box>
                            <Box className='w-50 fw-medium' fontSize={14}>
                                Amount customer will receive after canceling booking:
                                <Input className="fw-bold" readOnly value={(selectedBooking?.totalAmount * refundPercentage).toLocaleString('vi-VN') + " VND"} />
                            </Box>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter className='pt-0'>
                        <Button colorScheme="gray" mr={3} onClick={() => onCloseRefundModal()}>
                            Close
                        </Button>
                        <Button colorScheme="red" onClick={() => {
                            handleRequestRefund(selectedBooking.id);
                            onCloseRefundModal();
                        }}>
                            Send request
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>

            {selectedBooking && (
                <Modal isOpen={isOpen} onClose={closeModal} size='2xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Booking Details #{selectedBooking.id}
                            <Badge className='mx-3 mb-1' colorScheme={
                                (selectedBooking.status === "PAID" || selectedBooking.status === "DONE") ? "green" : (
                                    selectedBooking.status === "Request Refund" || selectedBooking.status === 'Checked_In') ? "yellow" :
                                    (selectedBooking.status === "Refunded") && "red"
                            }>
                                {selectedBooking.status}
                            </Badge>
                            {selectedBooking.reVisitDate && <Badge className='col-3 mx-5 text-center fs-6' colorScheme='white'>
                                Re-visitDate: {formatDateTime(selectedBooking.reVisitDate, 'dd/MM/yyyy')}
                            </Badge>
                            }
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex mb={4}>
                                <Box flex="1" mr={4}>
                                    <Text fontSize="lg" fontWeight="bold" style={{ color: 'teal' }}>
                                        <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', color: 'teal' }} /> Customer
                                    </Text>
                                    <Box mt={2}>
                                        <Text><strong>Name:</strong> {selectedBooking.pet.owner.fullName}</Text>
                                        <Text><strong>Phone:</strong> {selectedBooking.pet.owner.phoneNumber}</Text>
                                        <Text><strong>Email:</strong> {selectedBooking.pet.owner.email}</Text>
                                        <Text><strong>Address:</strong> {selectedBooking.pet.owner.address}</Text>
                                    </Box>
                                </Box>
                                <Box flex="1" ml={4}>
                                    <Text fontSize="lg" fontWeight="bold" style={{ color: 'teal' }}>
                                        <FontAwesomeIcon icon={faPaw} style={{ marginRight: '8px', color: 'teal' }} /> Pet
                                    </Text>
                                    <Box mt={2}>
                                        <Text><strong>Name:</strong> {selectedBooking.pet.name}</Text>
                                        <Text><strong>Type:</strong> {selectedBooking.pet.petType}</Text>
                                        <Text><strong>Gender:</strong> {selectedBooking.pet.gender}</Text>
                                        <Text><strong>Age:</strong> {age} Month(s)</Text>
                                    </Box>
                                </Box>
                            </Flex>
                            <Flex mb={4}>
                                <Box flex="1" mr={4}>
                                    <Text fontSize="lg" fontWeight="bold" style={{ color: 'teal', marginBottom: '0px' }}>
                                        <FontAwesomeIcon icon={faXRay} style={{ marginRight: '8px', color: 'teal' }} /> Service
                                    </Text>
                                    <Box mt={2}>
                                        {bookingDetails.map((detail, index) => (
                                            <Fragment>
                                                <Text><strong>Name:</strong> {detail.petService.nameService}</Text>
                                                <Text><strong>Description:</strong> {detail.petService.description}</Text>
                                                <Text><strong>Price:</strong> {formatPrice(detail.petService.price)} VND</Text>
                                            </Fragment>
                                        ))}
                                    </Box>
                                </Box>
                                <Box flex="1" ml={4}>
                                    <Text fontSize="lg" fontWeight="bold" style={{ color: 'teal', marginBottom: '0px' }}>
                                        <FontAwesomeIcon icon={faXRay} style={{ marginRight: '8px', color: 'teal' }} /> Booking
                                    </Text>
                                    <Box mt={2}>
                                        <Text><strong>Date:</strong> {formatDateTime(selectedBooking.bookingDate, 'dd-MM-yyy')}</Text>
                                        <Text><strong>Appointment Date:</strong> {formatDateTime(selectedBooking.vetShiftDetail.date, 'dd-MM-yyyy')}</Text>
                                        <Text><strong>Slot:</strong> {selectedBooking.vetShiftDetail.shift.from_time} - {selectedBooking.vetShiftDetail.shift.to_time}</Text>
                                        <Text><strong>Description:</strong> {selectedBooking.description}</Text>
                                    </Box>
                                </Box>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeModal} colorScheme='red'>Close</Button>
                            {/* Ngày khám = ngày hiện tại thì hiện nút Checkin */}
                            {(selectedBooking.status === "PAID" && formatDateTime(selectedBooking.vetShiftDetail.date, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyy')) &&
                                <Button onClick={() => { closeModal(); handleCheckin(selectedBooking) }} className='mx-2' colorScheme='teal'>Check In</Button>}
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
        </Container >
    );
};

export default BookingHistory;