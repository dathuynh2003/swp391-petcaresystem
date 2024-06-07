import React, { useState, useEffect } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button } from '@chakra-ui/react';
import axios from 'axios';
import { CheckIcon } from '@chakra-ui/icons';
export default function Booking() {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [booking, setBooking] = useState({
    description: '',
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
  };

  // useEffect(() => {
  //   console.log('Mảng có: ' + selectedServices.length + ' phần tử');
  //   console.log(selectedServices);
  // }, [selectedServices]);

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
    return date.toLocaleDateString('en-GB'); // Định dạng ngày thành dd/mm/yyyy
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short' }); // Định dạng ngày thành Mon, Tue, Wed, ...
  };

  const [activeDateIndex, setActiveDateIndex] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const handleClickDay = (date, index) => {
    // console.log(date.toLocaleDateString('en-CA'));
    setSelectedDate(date.toLocaleDateString('en-CA'));
    setActiveDateIndex(index)
  };


  const [vets, setVets] = useState([]);
  const loadShiftsByDate = async () => {
    const response = await axios.get(`http://localhost:8080/shifts/shiftByDate/${selectedDate}`);
    const shifts = response.data;

    const updateVets = []
    shifts.forEach((shift) => {
      const vetId = shift?.user?.userId
      let vet = updateVets.find((vet) => vet?.vetId === vetId)

      if (!vet) {
        vet = {
          vetId: vetId,
          fullName: shift?.user?.fullName,
          workSchedule: [],
          // shifts: []
        }
        updateVets.push(vet)
      }
      vet.workSchedule.push(shift)
      // vet.shifts.push(shift?.shift)
    })
    setVets(updateVets)
  };

  useEffect(() => {
    if (selectedDate) {
      loadShiftsByDate();
    }
  }, [selectedDate])

  const [activeShiftIndex, setActiveShiftIndex] = useState()
  const [selectedVetShift, setSelectedVetShift] = useState()
  const chooseShift = (vs_id, index) => {
    setSelectedVetShift(vs_id);
    setActiveShiftIndex(index);
  }

  useEffect(() => {
    console.log("vs_id: " + selectedVetShift)
  }, [selectedVetShift])


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
                          className={`mx-auto btn btn-outline-primary ${activeDateIndex === index ? 'active' : ''}`}
                          style={{ width: '12%' }}
                          onClick={() => handleClickDay(date, index)}
                        >{`${formatDate(date)}`} <br /> {`(${formatDay(date)})`}</Button>
                      ))}
                    </div>
                    <div className='choose-vetshift'>
                      {vets.map((vet, index) => (
                        <div className=''>
                          <h1 className='fs-3'>{vet?.fullName}</h1>
                          <div className='row'>
                            {vet?.workSchedule?.map((workSchedule, workScheduleIndex) => (
                              <Button
                                className={`col-2 mx-4 my-2 btn btn-outline-primary ${activeShiftIndex === vet?.vetId + '-' + workScheduleIndex ? 'active' : ''}`}
                                onClick={() => chooseShift(workSchedule?.vs_id, vet?.vetId + '-' + workScheduleIndex)}
                              >{workSchedule?.shift?.from_time} - {workSchedule?.shift?.to_time}</Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
    </div >
  );
}
