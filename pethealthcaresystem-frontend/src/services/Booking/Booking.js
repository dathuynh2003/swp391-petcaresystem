import React, { useState, useEffect } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button } from '@chakra-ui/react';
import axios from 'axios';
import { CheckIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Box, Image, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';


export default function Booking() {

  // ĐỂ BẮT SAU KHI LÀM XONG
  // let navigate = useNavigate()
  // useEffect(()=> {
  //   if (!localStorage.getItem('isLoggedIn')) {
  //     navigate('/login')
  //   }
  // },[])


  const location = useLocation();


  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [booking, setBooking] = useState({
    description: '',
    type: false,
  });

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  const loadServices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/allServices');
      setServices(response.data);
    } catch (error) {
      console.log(error)
    }

  };

  const loadPets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/pet', { withCredentials: true });
      setPets(response.data);
    } catch (error) {
      console.log(error)
    }
  };

  const loadShift = async () => {
    try {
      const response = await axios.get('http://localhost:8080/shifts/details', { withCredentials: true });
      setShifts(response.data);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    loadServices();
    loadPets();
    loadShift();
    // Kiểm tra xem data có tồn tại không và không được trống
    const data = location?.state;
    console.log("gui qua");
    console.log(data);
    if (data) {
      setSelectedServices(prevServices => [...prevServices, data]);
    }
  }, []);



  const chooseServices = (serviceId) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(serviceId)) {
        return prevSelectedServices.filter((id) => id !== serviceId);
      } else {
        return [...prevSelectedServices, serviceId];
      }
    });
  };

  useEffect(() => {
    console.log(booking);
  }, [booking]);

  const choosePet = (pet) => {
    setSelectedPet(pet);
  };

  const [dates, setDates] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    const getWeekDates = (date) => {
      const firstDayOfWeek = date.getDate() - date.getDay() + 1; // Ngày đầu tiên của tuần (thứ 2)
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(firstDayOfWeek + i);
        return newDate;
      });
      setDates(weekDates);
    };
    getWeekDates(currentWeek);
  }, [currentWeek]);

  const handlePreviousWeek = () => {
    setSelectedVetShift(null);
    setActiveShiftIndex(null);
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(currentWeek.getDate() - 7);
    setActiveDateIndex(null)
    setActiveShiftIndex(null)
    setVets([])
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    setSelectedVetShift(null);
    setActiveShiftIndex(null);
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setActiveDateIndex(null)
    setActiveShiftIndex(null)
    setVets([])
    setCurrentWeek(nextWeek);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en", { weekday: 'short', month: 'long', day: 'numeric' }); // Định dạng ngày thành dd/mm/yyyy
  };

  const [vets, setVets] = useState([]);
  const [activeDateIndex, setActiveDateIndex] = useState(null);
  const [shifts, setShifts] = useState([]);
  const handleClickDay = async (date, index) => {
    setSelectedVetShift(null);
    setActiveShiftIndex(null);
    setDisplaySelectedDate(date.toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' }))
    setActiveDateIndex(index)
    const response = await axios.get(`http://localhost:8080/shifts/shiftByDate/${date.toLocaleDateString('en-CA')}`);
    const shifts = response.data;
    const updateVets = []
    shifts.forEach((shift) => {
      const vetId = shift?.user?.userId //lấy vetId ra
      let vet = updateVets.find((vet) => vet?.vetId === vetId) //xem vetId đã có trong list Vets chưa

      if (!vet) {
        vet = {
          vetId: vetId,
          fullName: shift?.user?.fullName,
          workSchedule: [],
          // shifts: []
        }
        updateVets.push(vet) //bỏ vet vô
      }
      vet.workSchedule.push(shift)
      // vet.shifts.push(shift?.shift)
    })
    setVets(updateVets)
  };

  const [selectedDisplayDate, setDisplaySelectedDate] = useState()
  const [activeShiftIndex, setActiveShiftIndex] = useState()
  const [selectedVetShift, setSelectedVetShift] = useState()

  const [time, setTime] = useState()
  const chooseShift = (vs_id, index, vetName, time) => {
    if (index === activeShiftIndex) {
      setSelectedVetShift(null);
      setActiveShiftIndex(null);
    } else {
      setSelectedVetShift(vs_id);
      setActiveShiftIndex(index);
    }
    setVetName(vetName)
    setTime(time)
  }

  const [vetName, setVetName] = useState()
  useEffect(() => {
    console.log("vs_id: " + selectedVetShift)
  }, [selectedVetShift])
  const [curBooking, setCurrentBooking] = useState()
  const serviceIds = selectedServices.map(service => service.id);//dùng để gửi mảng id đi
  const callAPI = async () => {
    console.log('gui ve');
    console.log(selectedPet.petId);
    console.log(selectedVetShift);
    console.log(serviceIds);
    const response = await axios.post(`http://localhost:8080/createBooking/pet/${selectedPet.petId}/vet-shift/${selectedVetShift}/services/${serviceIds}`, booking, { withCredentials: true })
    setCurrentBooking(response.data)
    console.log(response.data);

  }
  const updateBookingAfterPAID = async (booking) => {
    try {
      const response = await axios.put(`http://localhost:8080/booking/paid`, booking);
      return response.data;
    } catch (error) {
      console.error("There was an error updating the booking to PAID!", error);
      throw error;
    }
  };
  const updateBookingAfterCANCELLED = async (booking) => {
    try {
      const response = await axios.put(`http://localhost:8080/booking/cancelled`, booking);
      return response.data;
    } catch (error) {
      console.error("There was an error updating the booking to CANCELLED!", error);
      throw error;
    }
  };
  const [step, setStep] = useState(0)
  const handleNextClick = (content) => {
    if (content === null || content === undefined || content === '' || content.length === 0) {
      setStep(step)
      toast.warn('Please input required information!')
    }

    else
      setStep(step + 1)
  }
  const handleBackClick = () => {
    setStep(step - 1)
  }
  const handleNextClickDescription = () => {
    setStep(step + 1)
  }

  const handleConfirmClick = async () => {
    try {
      const updatedBooking = await updateBookingAfterPAID(curBooking);
      console.log('Booking updated to PAID:', updatedBooking);
      setBooking(updatedBooking); // Update state with the updated booking
    } catch (error) {
      console.error('Error updating booking to PAID:', error);
    }
    setStep(step + 1)
    toast.done('Book Appointment Successfully!')
  }

  const handleCancelClick = async () => {
    try {
      const updatedBooking = await updateBookingAfterCANCELLED(curBooking);
      console.log('Booking updated to CANCELLED:', updatedBooking);
      setBooking(updatedBooking); // Update state with the updated booking
    } catch (error) {
      console.error('Error updating booking to CANCELLED:', error);
    }
    setStep(step + 1)
    toast.done('Cancel Book Appointment Successfully!')
  }
  const handleClickAPI = (content) => {
    if (content !== null && content !== undefined && content !== '') {
      callAPI()
      setStep(step + 1)
    }
    else toast.warn('Please input required information!')
  }
  const handlePaymentClick = async () => {
    console.log(curBooking)
    const payment = {
      orderCode: booking.orderCode,
      paymentType: 'Credit Card',  // You can modify this as per your requirement
      // amount: 10000,
      paymentDate: new Date().toISOString(),
      status: 'Pending',
      description: curBooking.description,
      user: selectedPet.owner,
      booking: curBooking
    };

    try {
      const response = await axios.post('http://localhost:8080/api/payment/create', payment, { withCredentials: true });
      const { data } = response.data;
      //toast.success('Payment initiated successfully!');
      if (data && data.data && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      }
    } catch (error) {
      toast.error('Payment failed!');
      console.error(error);
    }
  }
  return (
    <div className="container">
      <div className="row">
        <ToastContainer />
        <Tabs className="col-8 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal" index={step}>
          <TabList className="d-flex justify-content-between">
            <Tab>Services</Tab>
            <Tab >Choose Pet</Tab>
            <Tab >Reason</Tab>
            {/* isDisabled={booking?.description === '' || selectedServices.length === 0} */}
            <Tab >Time</Tab>
            <Tab>Payment</Tab>
            <Tab>Get Ready</Tab>
            <Tab>Consult</Tab>
          </TabList>

          <TabPanels >
            {/* maxH="500px" overflowY="auto" */}
            <TabPanel>
              <b className="row mx-auto">Our Services</b>
              <div className="container">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="row w-100 shadow m-3 rounded-3"
                    style={{ height: '85px' }}
                    onClick={() => chooseServices(service)}
                  >
                    <div className="service-info col-7 my-auto mx-3 border h-75">
                      <h5>{service.nameService}</h5>
                      <div className="fs-6">{service.description}</div>
                    </div>
                    <div className="service-price col-2 my-auto mx-3 border h-75 text-center">
                      <div className="my-3 p-1">{service.price.toLocaleString('vi-VN')} VND</div>
                    </div>
                    <div
                      className="service-choose col-1 mx-3 my-auto border rounded-circle"
                      style={{ width: '50px', height: '50px' }}
                    >
                      {selectedServices.some((selectedService) => selectedService.id === service.id) ? (
                        <CheckIcon
                          className="rounded-circle border"
                          style={{
                            backgroundColor: '#007DDE',
                            width: '49px',
                            height: '49px',
                            marginLeft: '-12px',
                            color: 'white',
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ))}

              </div>
              <div className='text-center'>
                <div className='btn btn-primary' onClick={() => handleNextClick(selectedServices)}>Next</div>
              </div>
            </TabPanel>

            <TabPanel className="mx-auto">
              Choose <b>Your Pet</b>
              <div className="container">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    className="row w-100 shadow m-3 rounded-3"
                    style={{ height: '85px' }}
                    onClick={() => choosePet(pet)}
                  >
                    <div
                      className="pet-avatar border my-auto mx-4 rounded-circle col-4"
                      style={{ height: '65px', width: '65px', overflow: 'hidden', position: 'relative' }}
                    >
                      {/* Pet Image */}
                      {pet.petType === 'Dog' && (
                        <img
                          className="rounded-circle"
                          src=""
                          alt="DogImg"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        ></img>
                      )}
                      {pet.petType === 'Cat' && (
                        <img
                          className="rounded-circle"
                          src=""
                          alt="CatImg"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        ></img>
                      )}
                      {pet.petType === 'Bird' && (
                        <img
                          className="rounded-circle"
                          src=""
                          alt="BirdImg"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        ></img>
                      )}
                    </div>
                    <div className="pet-info col-8 border my-2 mx-2">
                      <h4>{pet.name}</h4>
                      <div className="fs-6">
                        {pet.petType}. {pet.age} Months. {pet.breed}
                      </div>
                    </div>
                    <div
                      className="pet-choose col-1 my-auto mx-4 border rounded-circle"
                      style={{ width: '50px', height: '50px' }}
                    >
                      {pet.petId === selectedPet?.petId ? (
                        <CheckIcon
                          className="rounded-circle border"
                          style={{
                            backgroundColor: '#007DDE',
                            width: '49px',
                            height: '49px',
                            marginLeft: '-12px',
                            color: 'white',
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className='text-center'>
                <div className='btn btn-primary' onClick={() => handleBackClick()}>Back</div>
                <div className='btn btn-primary' onClick={() => handleNextClick(selectedPet)}>Next</div>
              </div>

            </TabPanel>

            <TabPanel>
              What's the reason for your consult today?
              <div className="form-floating">
                <textarea
                  className="form-control mt-3"
                  style={{ height: '300px', resize: 'none' }}
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  onChange={(e) => setBooking((prev) => ({ ...prev, description: e.target.value }))}
                ></textarea>
                <label htmlFor="floatingTextarea2">Eg: My pet hasn't been eating the last few days</label>
              </div>

              <div className='text-center mt-3'>
                <div className='btn btn-primary' onClick={() => handleBackClick()}>Back</div>
                <div className='btn btn-primary' onClick={() => handleNextClickDescription()}>Next</div>

              </div>

            </TabPanel>

            <TabPanel>
              <div className="container">
                <div className="row">
                  <div className="col-md-12 border rounded p-4 mt-2 shadow">
                    <div className="d-flex justify-content-between mb-3">
                      <button className="btn btn-primary" onClick={handlePreviousWeek}>
                        Previous Week
                      </button>
                      <button className="btn btn-primary" onClick={handleNextWeek}>
                        Next Week
                      </button>
                    </div>
                    <div className='choose-date row'>
                      {dates.map((date, index) => (
                        <Button
                          key={index}
                          className={`mx-auto btn btn-outline-primary fw-normal ${activeDateIndex === index ? 'active' : ''}`}
                          style={{ width: '12%' }}
                          onClick={() => handleClickDay(date, index)}
                        >{`${formatDate(date)}`} <br /> </Button>
                        // {`(${formatDay(date)})`}  

                      ))}
                    </div>
                    <div className='choose-vetshift'>
                      {vets.map((vet, index) => (
                        <div className=''>
                          <h1 className='fs-3'>{vet?.fullName}</h1>
                          <div className='row'>
                            {vet?.workSchedule?.map((workSchedule, workScheduleIndex) => (
                              <>
                                <button
                                  className={`col-2 mx-4 my-2 btn btn-outline-primary text-black ${activeShiftIndex === workSchedule?.vs_id ? 'active' : ''}`}
                                  disabled={workSchedule?.status !== "Available"}
                                  onClick={() => chooseShift(workSchedule?.vs_id, workSchedule?.vs_id, vet?.fullName, workSchedule?.shift.from_time + ' - ' + workSchedule?.shift.to_time)}
                                >
                                  {workSchedule?.shift?.from_time} - {workSchedule?.shift?.to_time}
                                </button>
                              </>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <div className='btn btn-primary' onClick={() => callAPI()}>
                    Choose
                  </div> */}

                </div>
              </div>
              <div className='text-center mt-3'>
                <div className='btn btn-primary' onClick={() => handleBackClick()}>Back</div>
                <div className='btn btn-primary' onClick={() => handleClickAPI(selectedVetShift)}>Next</div>
              </div>
            </TabPanel>

            <TabPanel>
              <Box className='container row'>
                <Box className='col border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded'>
                  <Box display='flex' alignItems='center'>
                    <Image src="assets/logoPetCare.png" alt="Logo" className="logo" /> Pet Health Care
                  </Box>
                  <Text as='h2' textAlign='center' mb={3}>
                    Booking Information
                  </Text>
                  <Box p={3} mb={5} bg='gray.100' borderRadius='lg'>
                    <Box borderBottom='1px' borderColor='gray.200' mb={3}>
                      <Text width='50%'><b>Booking ID: </b>{booking.id}</Text>
                      <Text width='50%'><b>Date: </b>{new Date().toLocaleDateString("en-GB", { month: 'numeric', day: 'numeric', year: 'numeric' })}</Text>
                    </Box>
                    <Box borderBottom='1px' borderColor='gray.200' mb={3}>
                      <Text width='50%'><b>Pet's owner: </b> {selectedPet?.owner?.fullName}</Text>
                      <Text width='50%'><b>Phone number: </b>{selectedPet?.owner?.phoneNumber}</Text>
                      <Text width='50%'><b>Pet's name: </b> {selectedPet?.name}</Text>
                      <Text width='50%'><b>Pet's type: </b> {selectedPet?.petType}</Text>
                      <Text><b>Pet's breed: </b> {selectedPet?.breed}</Text>
                      <Text><b>Pet's sex: </b> {selectedPet?.gender}</Text>
                      <Text><b>Pet's age: </b> {selectedPet?.age} month(s)</Text>
                    </Box>

                  </Box>

                  <Text as='h4' textAlign='center' mb={3} mt={3} fontWeight='normal'>
                    My appointment date
                  </Text>

                  <Box p={3} mb={5} bg='gray.100' borderRadius='lg'>
                    <Box mb={1} display='flex' justifyContent='space-between'>
                      <Text><b>Appointment date: </b> {selectedDisplayDate}</Text>
                      <Text><b>Time: </b> {time}</Text>
                      <Text><b>Vet: </b>{vetName}</Text>
                    </Box>
                    {/* <Box borderTop='1px' borderColor='gray.200' mt={2}>
                      <Text><b>Description: </b>{booking?.description}</Text>
                    </Box> */}
                  </Box>

                  <Text as='h4' textAlign='center' mb={1} mt={3} fontWeight='normal'>
                    Services' Information
                  </Text>
                  <Box mb={5} bg='gray.100' borderRadius='lg'>
                    <Table variant='simple'>
                      <Thead bg='gray.200'>
                        <Tr textAlign='center'>
                          <Th>No</Th>
                          <Th>Name</Th>
                          <Th>Description</Th>
                          <Th>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {selectedServices.map((service, index) => (
                          <Tr key={index} textAlign='center'>
                            <Td>{index + 1}</Td>
                            <Td>{service?.nameService}</Td>
                            <Td>{service?.description}</Td>
                            <Td>{service?.price.toLocaleString('vi-VN')}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                  </Box>

                  <Box display="flex" justifyContent="flex-end" alignItems="center" className="form-control mb-3">
                    <Text width="50%" mb={3} mt={3} mr={3} ml={3} textAlign="right">
                      <b>Total: </b>{selectedServices.map(service => service.price).reduce((total, price) => total + price, 0).toLocaleString('vi-VN')} VND
                    </Text>
                  </Box>
                </Box>
                <Box textAlign='center' mt={0}>
                  {
                    booking?.type ? null : <Button colorScheme="teal" onClick={handlePaymentClick}>Pay Now</Button>
                  }
                </Box>
              </Box>
            </TabPanel>

            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div >
  );
}