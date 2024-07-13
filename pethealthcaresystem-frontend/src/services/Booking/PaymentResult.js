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
  Table,
  Tbody,
  Tr,
  Td,
  useDisclosure,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { parseISO, format } from 'date-fns';
import { URL } from '../../utils/constant'
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
  const navigate = useNavigate();

  useEffect(() => {
    if (status && orderCode) {
      axios.put(`${URL}/payment-update`, {
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
    navigate('/');
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
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) {
      console.error('Invalid amount:', amount);
      return 'Invalid Amount';
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount).replace(/\s₫$/, ' ₫');
  };

  const renderBookingInfo = (booking) => {
    console.log('Booking Amount:', booking.totalAmount); // Log booking.amount before formatting

    return (
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <Heading as="h4" size="md" mb={4} >Booking Information</Heading>
          <Box mb={3}>
            <Text fontWeight="bold">Booking ID: {booking.id}</Text>
            {/* <Text>{booking.id}</Text> */}
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Booking Date: {formatDateTime(booking.bookingDate)}</Text>
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Appointment Date: {formatDateTime(booking.vetShiftDetail.date)}</Text>
            <Text fontWeight="bold"> Slot: {booking.vetShiftDetail.shift.from_time} - {booking.vetShiftDetail.shift.to_time}</Text>
          </Box>
          <Box mb={3}>

            <Text fontWeight="bold"
              color={booking.status === 'CANCELLED' ? 'red.500' : booking.status === 'PAID' ? 'green.500' : 'black'}>
              Status: {booking.status}
            </Text>
            {/* <Text>{booking.status}</Text> */}
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Total Amount: {booking.totalAmount.toLocaleString('vi-VN')} VND</Text>
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Description: {booking.description}</Text>
          </Box>
        </GridItem>
        <GridItem>
          <Heading as="h4" size="md" mb={4}>User Information</Heading>
          <Box mb={3}>
            <Text fontWeight="bold">Full Name: {booking.user.fullName}</Text>
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Email: {booking.user.email}</Text>
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Phone Number: {booking.user.phoneNumber}</Text>
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Address: {booking.user.address}</Text>
          </Box>
          <Heading as="h4" size="md" mt={6} mb={4}>Pet Information</Heading>
          <Box mb={3}>
            <Text fontWeight="bold">Pet Name: {booking.pet.name}</Text>
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Gender: {booking.pet.gender}</Text>
          </Box>
          <Box mb={3}>
            <Text fontWeight="bold">Description: {booking.pet.description}</Text>
          </Box>
        </GridItem>
      </Grid>
    );
  };

  return (
    <Fragment>
      {payment && (
        <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {payment.status === 'CANCELLED' && (
                <Text color="red.500" textAlign="center">Payment CANCELLED</Text>
              )}
              {payment.status === 'PAID' && (
                <Text color="green.500" textAlign="center">Payment PAID</Text>
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
