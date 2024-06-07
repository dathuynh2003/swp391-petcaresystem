import React, { useState, useEffect } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels } from '@chakra-ui/react';
import axios from 'axios';
import { CheckIcon } from '@chakra-ui/icons';
export default function Booking() {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [selectedShift, setSelectedShift] = useState('');

  const [step, setStep] = useState(2);

  const [booking, setBooking] = useState({
    appointmentDate: '',
    status: '',
    description: '',
    user_id: '',
    pet_id: '',
    vs_id: 0,
    type: false,
  });

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

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

  useEffect(() => {
    loadServices();
    loadPets();
    loadShift();
  }, []);

  const chooseServices = (serviceId) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(serviceId)) {
        return prevSelectedServices.filter((id) => id !== serviceId);
      } else {
        return [...prevSelectedServices, serviceId];
      }
    });

    // console.log("Mảng có: " + selectedServices.length + " phần tử")
  };

  useEffect(() => {
    console.log('Mảng có: ' + selectedServices.length + ' phần tử');
    console.log(selectedServices);
  }, [selectedServices]);

  useEffect(() => {
    console.log(booking);
  }, [booking]);

  const choosePet = (pet) => {
    setSelectedPet(pet);
    setBooking({ ...booking, pet_id: pet?.petId, user_id: pet?.owner.userId });

    console.log(booking);
  };

  //   const [currentDate, setCurrentDate] = useState(new Date());

  //   const handleNextDay = () => {
  //     const nextDate = new Date(currentDate);
  //     nextDate.setDate(nextDate.getDate() + 1);
  //     setCurrentDate(nextDate);
  //   };
  //   const handlePrevDay = () => {
  //     const prevDate = new Date(currentDate);
  //     prevDate.setDate(prevDate.getDate() - 1);
  //     setCurrentDate(prevDate);
  //   };

  //   const filteredShifts = shifts?.filter((shift) => {
  //     const shiftDate = new Date(shift.date);
  //     return shiftDate.toDateString() === currentDate.toDateString();
  //   });

  //   const handleClickShift = (shift) => {
  //     setBooking({ ...booking, vs_id: shift?.vs_id, appointmentDate: shift?.date });
  //     console.log(booking);
  //   };

  //   const [schedule, setSchedule] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/shifts/all');
        setShifts(response.data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    // const fetchSchedule = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:8080/shifts/vet-shift', { withCredentials: true });
    //     setSchedule(response.data);
    //   } catch (error) {
    //     console.error('Error fetching schedule:', error);
    //   }
    // };

    const getWeekDates = (date) => {
      const firstDayOfWeek = date.getDate() - date.getDay() + 1; // Ngày đầu tiên của tuần (thứ 2)
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(firstDayOfWeek + i);
        return newDate;
      });
      setDates(weekDates);
    };

    fetchShifts();
    // fetchSchedule();
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
    return date.toLocaleDateString("en", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); // Định dạng ngày thành dd/mm/yyyy
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short' }); // Định dạng ngày thành Mon, Tue, Wed, ...
  };

  const [shifts, setShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const handleClickDay = (date) => {
    console.log(date.toLocaleDateString('en-CA'));
    setSelectedDate(date.toLocaleDateString('en-CA'));
    loadShiftsByDate();
  };

  const loadShiftsByDate = async () => {
    
    const response = await axios.get(`http://localhost:8080/shifts/shiftByDate/${selectedDate}`);
    console.log(response.data);
    setShifts(response.data);
    console.log(setShifts);
  };

  const [selectedVetShift, setSelectedVetShift] = useState()




  return (
    <div className="container">
      <div className="row">
        <Tabs className="col-8 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal">
          <TabList className="d-flex justify-content-between">
            <Tab>Services</Tab>
            <Tab isDisabled={selectedServices.length === 0}>Choose Pet</Tab>
            <Tab isDisabled={selectedPet === null || selectedServices.length === 0}>Reason</Tab>
            {/* isDisabled={booking?.description === '' || selectedServices.length === 0} */}
            <Tab isDisabled={selectedPet === null || selectedServices.length === 0}>Time</Tab>
            <Tab>Payment</Tab>
            <Tab>Get Ready</Tab>
            <Tab>Consult</Tab>
          </TabList>

          <TabPanels maxH="500px" overflowY="auto">
            <TabPanel>
              <b className="row mx-auto">Our Services</b>
              <div className="container">
                {services.map((service, index) => (
                  <div
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
            </TabPanel>

            <TabPanel className="mx-auto">
              Choose <b>Your Pet</b>
              <div className="container">
                {pets.map((pet, index) => (
                  <div
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
              {/* <ul className="list-group overflow-auto ">
                                {pets.map((pet, index) => (
                                    <li
                                        className="list-group-item btn btn-primary"
                                        key={index}
                                        onClick={() => handleOnClick(pet)}
                                        style={{ cursor: 'pointer' }}

                                    >
                                        <label>{pet.name}</label>
                                        {pet.petId === selectedPet?.petId ? <CheckIcon /> : ''}
                                    </li>
                                ))}
                            </ul> */}
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
            </TabPanel>
            {/* 
            <TabPanel>
              <button className="btn btn-primary mx-2 " onClick={handlePrevDay}>
                Previous Day
              </button>
              <button className="btn btn-primary mx-2 " onClick={handleNextDay}>
                Next Day
              </button>

              <h4>{currentDate.toDateString()}</h4>
              <table className="table py-4">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Date</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Vet</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {filteredShifts.map((shift, index) => (
                    <tr
                      key={index}
                      className="shadow-sm p-3 mb-5 bg-body rounded bg-primary"
                      onClick={() => handleClickShift(shift)}
                    >
                      <th scope="row" className="col-1">
                        {index + 1}
                      </th>
                      <td className="col-1">{shift.date}</td>
                      <td className="col-1">{shift.shift?.from_time}</td>
                      <td className="col-1">{shift.shift?.to_time}</td>
                      <td className="col-1">{shift.user?.fullName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
 */}

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
                    <table className="table ">
                      <thead>
                        <tr className='container'>
                          {dates.map((date, index) => (

                            <div className='btn btn-outline-primary col' onClick={() => handleClickDay(date)}>
                                {`${formatDate(date)}`}
                            </div>


                            // <th
                            //   key={index}
                            //   className="text-center shadow"
                            //   onClick={() => handleClickDay(date)}
                            // >{`${formatDate(date)} (${formatDay(date)})`}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>

                      {shifts?.map((shift, key) => (
                          <tr key={key}>
                            <td>{shift?.user?.fullName}</td>
                            <td onClick={() => setSelectedVetShift(shift?.vs_id) }>
                                {shift?.shift?.from_time} - {shift?.shift?.to_time}
                            </td>
                          </tr>
                            
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
