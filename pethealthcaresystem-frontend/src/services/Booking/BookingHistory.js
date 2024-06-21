import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
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
} from '@chakra-ui/react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const pageSize = 5;

  useEffect(() => {
    fetchBookings();
  }, [currentPage, phoneNumber]);

  const debouncedSearch = debounce(() => {
    setCurrentPage(1);
    fetchBookings();
  }, 300);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/bookings-staff?pageNo=${currentPage}&pageSize=${pageSize}`;
      if (phoneNumber) {
        url += `&phoneNumber=${phoneNumber}`;
      }
      const response = await axios.get(url, { withCredentials: true });
      const { content, totalPages } = response.data.data;
      setBookings(content);
      setTotalPages(totalPages);
      setError(null);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    //   setError("Error fetching bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const viewDetail = async (bookingId) => {
    try {
      const booking = bookings.find(booking => booking.id === bookingId);
      setSelectedBooking(booking);
      const response = await axios.get(`http://localhost:8080/get-booking/${bookingId}/details`, { withCredentials: true });
      setBookingDetails(response.data.data);
      onOpen();
    } catch (error) {
    //   console.error(`Error fetching booking details for ID ${bookingId}:`, error);
      setError("Error fetching booking details. Please try again later.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    debouncedSearch();
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  };

  return (
    <Container maxW="container.xl" py={6}>
      {error && <Text color="red.500" mb={4}>{error}</Text>}

      <VStack spacing={4} mb={6}>
        <FormControl>
          <FormLabel htmlFor="phoneNumber">Customer Phone Number</FormLabel>
          <Input
            id="phoneNumber"
            placeholder="Enter customer phone number"
            value={phoneNumber}
            onChange={handleInputChange}
          />
        </FormControl>
        {loading && <Spinner size="lg" />}
      </VStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>BookingID</Th>
            <Th>Appointment Date</Th>
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
        <Button onClick={handlePreviousPage} isDisabled={currentPage === 1}>Previous</Button>
        <Text>Page {currentPage} of {totalPages}</Text>
        <Button onClick={handleNextPage} isDisabled={currentPage === totalPages}>Next</Button>
      </Box>

      {selectedBooking && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Booking Details #{selectedBooking.id}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mb={4}>
                <Text fontSize="lg" fontWeight="bold">Customer</Text>
                <Text><strong>Name:</strong> {selectedBooking.pet.owner.fullName}</Text>
                <Text><strong>Phone:</strong> {selectedBooking.pet.owner.phoneNumber}</Text>
                <Text><strong>Email:</strong> {selectedBooking.pet.owner.email}</Text>
                <Text><strong>Address:</strong> {selectedBooking.pet.owner.address}</Text>
              </Box>
              <Box mb={4}>
                <Text fontSize="lg" fontWeight="bold">Service</Text>
                {bookingDetails.map((detail, index) => (
                  <Box key={index} ml={4}>
                    <Text><strong>Name:</strong> {detail.petService.nameService}</Text>
                    <Text><strong>Price:</strong> {formatPrice(detail.petService.price)} VND</Text>
                  </Box>
                ))}
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">Pet</Text>
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
