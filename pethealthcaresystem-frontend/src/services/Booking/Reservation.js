import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Badge, useToast, useDisclosure
} from '@chakra-ui/react';

const Reservation = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingDetails, setBookingDetails] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

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
            setBookingDetails(response.data.data);
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

    return (
        <Box p={5}>
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Booking ID</Th>
                        <Th>Appointment Date</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {bookings.map((booking, index) => (
                        <Tr key={index}>
                            <Td><b>B{booking.id}</b></Td>
                            <Td><b>{new Date(booking.vetShiftDetail.date).toLocaleDateString()}</b></Td>
                            <Td><b>{formatPrice(booking.totalAmount)} VND</b></Td>
                            <Td>
                                <Badge colorScheme="green">PAID</Badge>
                            </Td>
                            <Td>
                                <Button size="sm" colorScheme="blue" onClick={() => viewDetail(booking.id)}>Detail</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {selectedBooking && (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Booking Details #{selectedBooking.id}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {bookingDetails.map((detail, index) => (
                                <Box key={index} mb={4}>
                                    <Text fontSize="lg" fontWeight="bold">Customer</Text>
                                    <Box ml={4}>
                                        <Text><strong>Name:</strong> {selectedBooking.pet.owner.fullName}</Text>
                                        <Text><strong>Phone:</strong> {selectedBooking.pet.owner.phoneNumber}</Text>
                                        <Text><strong>Email:</strong> {selectedBooking.pet.owner.email}</Text>
                                        <Text><strong>Address:</strong> {selectedBooking.pet.owner.address}</Text>
                                    </Box>

                                    <Text fontSize="lg" fontWeight="bold">Service</Text>
                                    <Box ml={4}>
                                        <Text><strong>Name:</strong> {detail.petService.nameService}</Text>
                                        <Text><strong>Price:</strong> {formatPrice(detail.petService.price)} VND</Text>
                                    </Box>

                                    <Text fontSize="lg" fontWeight="bold">Pet</Text>
                                    <Box ml={4}>
                                        <Text><strong>Name:</strong> {selectedBooking.pet.name}</Text>
                                        <Text><strong>Type:</strong> {selectedBooking.pet.petType}</Text>
                                        <Text><strong>Gender:</strong> {selectedBooking.pet.gender}</Text>
                                        <Text><strong>Age:</strong> {selectedBooking.pet.age} Year(s)</Text>
                                    </Box>
                                </Box>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Box>
    );
};

export default Reservation;
