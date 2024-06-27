import React, { useState, useEffect, useCallback } from 'react';
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
    Image
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import moment from 'moment'
import { faUser, faPaw, faXRay } from '@fortawesome/free-solid-svg-icons';
import { RepeatIcon, SearchIcon, ViewIcon } from '@chakra-ui/icons';
import { South } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

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




    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/all-bookings?pageNo=${currentPage}&pageSize=${pageSize}`, { withCredentials: true });
            const { content, totalPages } = response.data.data;
            setOriginalBookings(content);
            setBookings(content);
            setTotalPages(totalPages);
            setError(null);
        } catch (error) {
            console.error("Error fetching bookings:", error);
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
            let url = `http://localhost:8080/staff-booking-date-status?` + `pageNo=${pageNo}&pageSize=${pageSize}`;

            if (status) {
                console.log(status)
                url += `&status=${status}`;
            }
            if (fromDate) {
                console.log(fromDate)
                url += `&fromDate=${fromDate}`;
            }
            url += `&toDate=${toDate.length == 0 ? moment(new Date()).format("YYYY-MM-DD") : toDate}`;
            console.log(url)
            console.log('&toDate=' + toDate.length == 0 ? moment(new Date()).format('yyyy-MM-dd') : toDate)
            const response = await axios.get(url, { withCredentials: true });
            const { content, totalPages } = response.data.data;
            setBookings(content);
            setTotalPages(totalPages);

        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Error fetching bookings. Please try again later.");
            setBookings([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingsByPhoneNumber = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/bookings-staff?pageNo=${currentPage}&pageSize=${pageSize}&phoneNumber=${phoneNumber}`, { withCredentials: true });
            const { content, totalPages } = response.data.data;
            setBookings(content);
            setTotalPages(totalPages);
            setError(null); // Clear any previous errors

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
            setSelectedBooking(booking);
            const response = await axios.get(`http://localhost:8080/get-booking/${bookingId}/details`, { withCredentials: true });
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
        setCurrentPage(1);
        setIsSearchByPhone(false);
        setIsFilteredSearch(false);
        fetchAllBookings(1);
        // fetchFilteredBookings(1)
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
        setPet(pet)
        setOwner(pet.owner)
        setSelectedBooking(booking)
        setAppointmentTime(appointmentTime)
    }

    const handleRequestRefund = async (bookingId) => {
        try {
            const response = await axios.put(`http://localhost:8080/refund-booking-by-staff/${bookingId}`, {}, { withCredentials: true })
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

    return (
        <Container maxW="container.xl" py={6}>
            {error && <Text color="red.500" mb={4}>{error}</Text>}
            <Flex justify="space-between" mb={3}>
                <FormControl width="100px" mr={2}>
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
                </FormControl>

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
                                <option value="PENDING">Pending</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="PAID">Paid</option>
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
                        // console.log(booking.id, " - ", strAppointmentTime)
                        return (
                            <Tr key={booking.id}>
                                <Td>B{booking.id}</Td>
                                <Td>{formatDateTime(booking.vetShiftDetail.date, 'dd-MM-yyyy')}</Td>
                                <Td>{formatDateTime(booking.bookingDate, 'dd-MM-yyyy')}</Td>
                                <Td>{formatPrice(booking.totalAmount)} VND</Td>
                                <Td>
                                    <Badge colorScheme={
                                        (booking.status === 'Pending' || booking.status === 'Request Refund') ? 'yellow' :
                                            booking.status === 'CANCELLED' ? 'red' : 'green'
                                    }>
                                        {booking.status}
                                    </Badge>
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
                                    * Staff canceling a booking requires a full refund (100%)
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
                <Modal isOpen={isOpen} onClose={closeModal} size='xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Booking Details #{selectedBooking.id}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box mb={4}>
                                <Text fontSize="lg" fontWeight="bold">
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} /> Customer
                                </Text>
                            </Box>
                            <Box ml={4}>
                                <Text><strong>Name:</strong> {selectedBooking.pet.owner.fullName}</Text>
                                <Text><strong>Phone:</strong> {selectedBooking.pet.owner.phoneNumber}</Text>
                                <Text><strong>Email:</strong> {selectedBooking.pet.owner.email}</Text>
                                <Text><strong>Address:</strong> {selectedBooking.pet.owner.address}</Text>
                            </Box>
                            <Box mb={4}>
                                <Text fontSize="lg" fontWeight="bold">
                                    <FontAwesomeIcon icon={faXRay} style={{ marginRight: '8px' }} /> Service
                                </Text>
                                {bookingDetails.map((detail, index) => (
                                    <Box key={index} ml={4}>
                                        <Text><strong>Name:</strong> {detail.petService.nameService}</Text>
                                        <Text><strong>Description:</strong> {detail.petService.description}</Text>
                                        <Text><strong>Price:</strong> {formatPrice(detail.petService.price)} VND</Text>
                                    </Box>
                                ))}
                            </Box>
                            <Box mb={4}>
                                <Text fontSize="lg" fontWeight="bold">
                                    <FontAwesomeIcon icon={faPaw} style={{ marginRight: '8px' }} /> Pet
                                </Text>
                            </Box>
                            <Box ml={4}>

                                <Text><strong>Name:</strong> {selectedBooking.pet.name}</Text>
                                <Text><strong>Type:</strong> {selectedBooking.pet.petType}</Text>
                                <Text><strong>Gender:</strong> {selectedBooking.pet.gender}</Text>
                                <Text><strong>Age:</strong> {selectedBooking.pet.age} Month(s)</Text>
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeModal}>Close</Button>
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
        </Container>
    );
};

export default BookingHistory;