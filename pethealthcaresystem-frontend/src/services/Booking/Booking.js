import React, { useState, useEffect } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button } from '@chakra-ui/react';
import axios from 'axios';
import { CheckIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function Booking() {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [booking, setBooking] = useState({
    description: '',
    type: false,
  });
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [dates, setDates] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeDateIndex, setActiveDateIndex] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDisplayDate, setDisplaySelectedDate] = useState();
  const [vets, setVets] = useState([]);
  const [activeShiftIndex, setActiveShiftIndex] = useState();
  const [selectedVetShift, setSelectedVetShift] = useState();
  const [time, setTime] = useState();
  const [vetName, setVetName] = useState();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
    loadPets();
    loadShift();
  }, []);

  const loadServices = async () => {
    const response = await axios.get('http://localhost:8080/services');
    setServices(response.data);
  };

  const loadPets = async () => {
    const response = await axios.get('http://localhost:8080/pet', { withCredentials: true });
    setPets(response.data);
  };

  const loadShift = async () => {
    const response = await axios.get('http://localhost:8080/shifts/details');
    setShifts(response.data);
  };

  const chooseServices = (serviceId) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(serviceId)) {
        return prevSelectedServices.filter((id) => id !== serviceId);
      } else {
        return [...prevSelectedServices, serviceId];
      }
    });
  };

  const choosePet = (pet) => {
    setSelectedPet(pet);
  };

  useEffect(() => {
    const getWeekDates = (date) => {
      const firstDayOfWeek = date.getDate() - date.getDay() + 1;
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
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en", { weekday: 'short', month: 'long', day: 'numeric' });
  };

  const handleClickDay = (date, index) => {
    setSelectedDate(date.toLocaleDateString('en-CA'));
    setDisplaySelectedDate(date.toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' }));
    setActiveDateIndex(index);
  };

  const loadShiftsByDate = async () => {
    const response = await axios.get(`http://localhost:8080/shifts/shiftByDate/${selectedDate}`);
    const shifts = response.data;
    const updateVets = [];
    shifts.forEach((shift) => {
      const vetId = shift?.user?.userId;
      let vet = updateVets.find((vet) => vet?.vetId === vetId);

      if (!vet) {
        vet = {
          vetId: vetId,
          fullName: shift?.user?.fullName,
          workSchedule: [],
        };
        updateVets.push(vet);
      }
      vet.workSchedule.push(shift);
    });
    setVets(updateVets);
  };

  useEffect(() => {
    if (selectedDate) {
      loadShiftsByDate();
    }
  }, [selectedDate]);

  const chooseShift = (vs_id, index, vetName, time) => {
    setSelectedVetShift(vs_id);
    setActiveShiftIndex(index);
    setVetName(vetName);
    setTime(time);
  };

  const serviceIds = selectedServices.map(service => service.id);

  const callAPI = async () => {
    const response = await axios.post(`http://localhost:8080/createBooking/pet/${selectedPet.petId}/vet-shift/${selectedVetShift}/services/${serviceIds}`, booking, { withCredentials: true });
    console.log(response.data);
  };

  const handleNextClick = (content) => {
    if (!content || (Array.isArray(content) && content.length === 0)) {
      setStep(step);
      toast.warn('Please input required information!');
    } else {
      setStep(step + 1);
    }
  };

  const handleBackClick = () => {
    setStep(step - 1);
  };

  const handleNextClickDescription = () => {
    setStep(step + 1);
  };

  const handleClickAPI = async (content) => {
    if (content) {
      await callAPI();
      setStep(step + 1);
    } else {
      toast.warn('Please input required information!');
    }
  };

  const handlePaymentClick = async () => {
    const paymentRequest = {
      paymentType: "CARD", // Replace with your actual payment type
      amount: 10000, // Replace with your actual amount
      paymentDate: new Date().toISOString(), // Replace with your actual payment date
      status: "PENDING", // Replace with your actual status
      description: "Payment for order 642197", // Replace with your actual description
      user: { id: selectedPet.ownerId }, // Replace with your actual user id
      booking: { id: booking.id } // Replace with your actual booking id
    };
    try {
      const response = await axios.post('http://localhost:8080/api/payment', paymentRequest);
      const paymentData = response.data.data.data;
      if (paymentData && paymentData.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl;
      }
    } catch (error) {
      console.error("Payment error: ", error);
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <ToastContainer />
        <Tabs className="col-8 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal" index={step}>
          <TabList className="d-flex justify-content-between">
            <Tab>Services</Tab>
            <Tab>Choose Pet</Tab>
            <Tab>Reason</Tab>
            <Tab>Time</Tab>
            <Tab>Payment</Tab>
            <Tab>Get Ready</Tab>
            <Tab>Consult</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <b className="row mx-auto">Our Services</b>
              <div className="container">
                {services.map((service, index) => (
                  <div
                    className="row w-100 shadow m-3 rounded-3"
                    style={{ height: '85px' }}
                    onClick={() => chooseServices(service)}
                    key={index}
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
                    className="row w-100 shadow m-3 rounded-3"
                    style={{ height: '85px' }}
                    onClick={() => choosePet(pet)}
                    key={index}
                  >
                    <div className="service-info col-7 my-auto mx-3 border h-75">
                      <h5>{pet.name}</h5>
                      <div className="fs-6">{pet.breed}</div>
                    </div>
                    <div className="service-price col-2 my-auto mx-3 border h-75 text-center">
                      <div className="my-3 p-1">{pet.age} years old</div>
                    </div>
                    <div
                      className="service-choose col-1 mx-3 my-auto border rounded-circle"
                      style={{ width: '50px', height: '50px' }}
                    >
                      {selectedPet && selectedPet.id === pet.id ? (
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
                <div className='btn btn-primary' onClick={() => handleNextClick(selectedPet)}>Next</div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className='text-center'>
                <h5>Enter Description</h5>
                <textarea
                  className='form-control'
                  value={booking.description}
                  onChange={(e) => setBooking({ ...booking, description: e.target.value })}
                />
                <div className='btn btn-primary mt-3' onClick={handleNextClickDescription}>Next</div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className='text-center'>
                <h5>Choose Time</h5>
                <div>
                  {dates.map((date, index) => (
                    <div
                      className={`btn ${index === activeDateIndex ? 'btn-primary' : 'btn-outline-primary'} m-2`}
                      key={index}
                      onClick={() => handleClickDay(date, index)}
                    >
                      {formatDate(date)}
                    </div>
                  ))}
                </div>
                <div>
                  {vets.map((vet, index) => (
                    <div key={index}>
                      <h6>{vet.fullName}</h6>
                      {vet.workSchedule.map((schedule, i) => (
                        <div
                          key={i}
                          className={`btn ${i === activeShiftIndex ? 'btn-primary' : 'btn-outline-primary'} m-2`}
                          onClick={() => chooseShift(schedule.vs_id, i, vet.fullName, schedule.startTime)}
                        >
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className='btn btn-primary mt-3' onClick={() => handleClickAPI(selectedVetShift)}>Next</div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className='text-center'>
                <h5>Payment</h5>
                <div className='btn btn-primary' onClick={handlePaymentClick}>Proceed to Payment</div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className='text-center'>
                <h5>Get Ready</h5>
                <p>Your booking is confirmed. Please get ready for the appointment.</p>
                <div className='btn btn-primary' onClick={() => navigate('/')}>Home</div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className='text-center'>
                <h5>Consult</h5>
                <p>Consult with the vet during your appointment time.</p>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
