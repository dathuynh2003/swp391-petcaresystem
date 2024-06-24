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
    Flex
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import moment from 'moment'
import { faUser, faPaw, faXRay } from '@fortawesome/free-solid-svg-icons';
import { SearchIcon } from '@chakra-ui/icons';
import { South } from '@mui/icons-material';

const BookingHistory = () => {
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
    const [isSearchByPhone, setIsSearchByPhone] = useState(false); // State để theo dõi trạng thái tìm kiếm
    const [isFilteredSearch, setIsFilteredSearch] = useState(false); // State để theo dõi tìm kiếm có lọc



    const { isOpen, onOpen, onClose } = useDisclosure();

    const pageSize = 5;

    useEffect(() => {
        if (isSearchByPhone) {
            fetchBookingsByPhoneNumber();
        }
        else if (isFilteredSearch) {
            fetchFilteredBookings();
        }
        else {
            fetchAllBookings();
        }
    }, [currentPage, isSearchByPhone, isFilteredSearch]);


    useEffect(() => {
        fetchFilteredBookings(1);
    }, [status, fromDate, toDate])




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
            url += ('&toDate=' + toDate.length == 0 ? moment(new Date()).format('yyyy-MM-dd') : toDate)
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
            console.error("Error fetching bookings by phone number:", error);
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
        setIsSearchByPhone(true);
        fetchBookingsByPhoneNumber();
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
    };

    const formatPrice = (price) => {
        return Number(price).toLocaleString('vi-VN');
    };
    const formatDateTime = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            console.error('Invalid date:', dateString);
            return 'Invalid Date';
        }
    };

    return (
        <Container maxW="container.xl" py={6}>
            {error && <Text color="red.500" mb={4}>{error}</Text>}
            <Flex justify="space-between" mb={6}>
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
                    <Flex flexDirection="column">
                        <FormLabel htmlFor="fromDate" mt={2}>From</FormLabel>
                        <Input
                            type="date"
                            id="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </Flex>
                    <Flex flexDirection="column">
                        <FormLabel htmlFor="toDate" mt={2}>To</FormLabel>
                        <Input
                            type="date"
                            id="toDate"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </Flex>


                </Flex>
            </FormControl>
            <FormControl width="150px" marginTop="10px" mr={2}>
                <Select placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="PAID">Paid</option>
                </Select>
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
                    {bookings.map((booking) => (
                        <Tr key={booking.id}>
                            <Td>B{booking.id}</Td>
                            <Td>{new Date(booking.vetShiftDetail.date).toLocaleDateString()}</Td>
                            <Td>{formatDateTime(booking.bookingDate)}</Td>
                            <Td>{formatPrice(booking.totalAmount)} VND</Td>
                            <Td>
                                <Badge colorScheme={
                                    booking.status === 'Pending' ? 'yellow' :
                                        booking.status === 'CANCELLED' ? 'red' : 'green'
                                }>
                                    {booking.status}
                                </Badge>
                            </Td>
                            <Td>
                                <Button size="sm" onClick={() => viewDetail(booking.id)}>Detail</Button>
                            </Td>
                        </Tr>
                    ))}
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
                                <Text><strong>Age:</strong> {selectedBooking.pet.age} Year(s)</Text>
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={closeModal}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default BookingHistory;