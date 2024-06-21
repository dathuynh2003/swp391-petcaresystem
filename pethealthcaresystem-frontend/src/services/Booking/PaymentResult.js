import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Container,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { parseISO, format } from 'date-fns';

export default function PaymentResult() {
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();
  let status = query.get("status");
  let orderCode = query.get("orderCode");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [payment, setPayment] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    if (status && orderCode) {
      axios.put('http://localhost:8080/payment-update', {
        orderCode,
        status
      })
        .then((res) => {
          const paymentData = res.data.data;
          setPayment(paymentData);
          setIsLoading(false);
          onOpen();
          console.log('Payment Data:', paymentData); // Log payment data
          if (paymentData.booking) {
            console.log('Booking Data:', paymentData.booking); // Log booking data
          }
        })
        .catch((error) => {
          setIsLoading(false);
          alert(error?.response?.data?.errorMessage ?? error?.message);
        });
    }
  }, [status, orderCode, onOpen]);

  const handleClose = () => {
    onClose();
    navigate('/'); // Navigate to the booking page
  };

  if (isLoading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading...</Text>
      </Container>
    );
  }

  const formatDateTime = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'PPPpp');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }
  };

  const renderBookingInfo = (booking) => (
    <Box>
      <Text mb={3}><b>Booking ID:</b> {booking.id}</Text>
      <Text mb={3}><b>Booking Date:</b> {formatDateTime(booking.bookingDate)}</Text>
      <Text mb={3}><b>Appointment Date:</b> {formatDateTime(booking.appointmentDate)}</Text>
      <Text mb={3}><b>Status:</b> {booking.status}</Text>
      <Text mb={3}><b>Total Amount:</b> {booking.totalAmount.toFixed(2)} VND</Text>
      <Text mb={3}><b>Description:</b> {booking.description}</Text>

      <Heading as="h4" size="md" mt={4} mb={3}>User Information</Heading>
      <Text mb={3}><b>Full Name:</b> {booking.user.fullName}</Text>
      <Text mb={3}><b>Email:</b> {booking.user.email}</Text>
      <Text mb={3}><b>Phone Number:</b> {booking.user.phoneNumber}</Text>
      <Text mb={3}><b>Address:</b> {booking.user.address}</Text>

      <Heading as="h4" size="md" mt={4} mb={3}>Pet Information</Heading>
      <Text mb={3}><b>Pet Name:</b> {booking.pet.name}</Text>
    </Box>
  );

  return (
    <Fragment>
      {payment && (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {payment.status === 'CANCELLED' && (
                <Text color="red.500">Payment CANCELLED</Text>
              )}
              {payment.status === 'PAID' && (
                <Text color="green.500">Payment PAID</Text>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {payment.booking && renderBookingInfo(payment.booking)}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Fragment>
  );
}
