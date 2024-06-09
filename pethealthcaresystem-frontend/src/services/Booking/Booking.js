import React, { useState, useEffect } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button } from '@chakra-ui/react';
import axios from 'axios';
import { CheckIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';



export default function Booking() {

  const location = useLocation();
  const data = location?.state;
  console.log("gui qua");
  console.log(data);

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
    const response = await axios.get('http://localhost:8080/shifts/details', { withCredentials: true });
    setShifts(response.data);
  };

  useEffect(() => {
    loadServices();
    loadPets();
    loadShift();

  }, []);




  useEffect(() => {
    // Kiểm tra xem data có tồn tại không và không được trống
    if (data) {
      setSelectedServices(prevServices => [...prevServices, data]);
    }
  }, [data]); // useEffect sẽ chạy mỗi khi data thay đổi






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
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(currentWeek.getDate() - 7);
    setActiveDateIndex(null)
    setActiveShiftIndex(null)
    // setVets([])
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setActiveDateIndex(null)
    setActiveShiftIndex(null)
    // setVets([])
    setCurrentWeek(nextWeek);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en", { weekday: 'short', month: 'long', day: 'numeric' }); // Định dạng ngày thành dd/mm/yyyy
  };

  const [activeDateIndex, setActiveDateIndex] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const handleClickDay = (date, index) => {
    setSelectedDate(date.toLocaleDateString('en-CA'));
    setDisplaySelectedDate(date.toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' }))
    setActiveDateIndex(index)
  };

  const [selectedDisplayDate, setDisplaySelectedDate] = useState()


  const [vets, setVets] = useState([]);
  const loadShiftsByDate = async () => {
    const response = await axios.get(`http://localhost:8080/shifts/shiftByDate/${selectedDate}`);
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

  useEffect(() => {
    if (selectedDate) {
      loadShiftsByDate();
    }
  }, [selectedDate])

  const [activeShiftIndex, setActiveShiftIndex] = useState()
  const [selectedVetShift, setSelectedVetShift] = useState()

  const [time, setTime] = useState()
  const chooseShift = (vs_id, index, vetName, time) => {
    setSelectedVetShift(vs_id);
    setActiveShiftIndex(index);
    setVetName(vetName)
    setTime(time)
  }

  const [vetName, setVetName] = useState()
  useEffect(() => {
    console.log("vs_id: " + selectedVetShift)
  }, [selectedVetShift])

  const serviceIds = selectedServices.map(service => service.id);//dùng để gửi mảng id đi
  const callAPI = async () => {
    console.log('gui ve');
    console.log(selectedPet.petId);
    console.log(selectedVetShift);
    console.log(serviceIds);
    const response = await axios.post(`http://localhost:8080/createBooking/pet/${selectedPet.petId}/vet-shift/${selectedVetShift}/services/${serviceIds}`, booking, { withCredentials: true })
    console.log(response.data);
  }

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

  const handleClickAPI = (content) => {
    if (content !== null && content !== undefined && content !== '') {
      callAPI()
      setStep(step + 1)
    }
    else toast.warn('Please input required information!')
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
                              <Button
                                className={`col-2 mx-4 my-2 btn btn-outline-primary ${activeShiftIndex === vet?.vetId + '-' + workScheduleIndex ? 'active' : ''}`}
                                onClick={() => chooseShift(workSchedule?.vs_id, vet?.vetId + '-' + workScheduleIndex, vet?.fullName, workSchedule?.shift.from_time + ' - ' + workSchedule?.shift.to_time)}
                              >{workSchedule?.shift?.from_time} - {workSchedule?.shift?.to_time}</Button>
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
              <div className='container row'>
                <div className='col border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded '>
                  <div className='d-flex align-items-center'><img src="assets/logoPetCare.png" alt="Logo" className="logo" /> Pet Health Care</div>
                  <h2 className='text-center mb-3'>
                    Booking Information
                  </h2>
                  <div className='shadow p-3 mb-5 bg-body-tertiary rounded'>
                    <div className="border-bottom mb-3">
                      <label className="w-50 "><b>Booking ID: </b>Chưa xử lí</label>
                      <label className="w-50 "><b>Date: </b>{new Date().toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' })} </label>
                    </div>

                    <div className="border-bottom mb-3">
                      <label className="w-50"><b>Pet's owner: </b> {selectedPet?.owner?.fullName}</label>
                      <label className="w-50"><b>Phone number: </b>{selectedPet?.owner?.phone}</label>
                    </div>


                    <div className="border-bottom mb-3 ">
                      <label className="w-50"><b >Pet's name: </b> {selectedPet?.name}</label>
                      <label className="w-50" ><b>Pet's type: </b> {selectedPet?.petType}</label>
                    </div>
                    <div className="d-flex justify-content-between">
                      <label ><b>Pet's breed: </b> {selectedPet?.breed}</label>
                      <label ><b >Pet's sex: </b> {selectedPet?.gender}</label>
                      <label ><b>Pet's age: </b> {selectedPet?.age} month(s)</label>
                    </div>

                  </div>
                  <h4 className='text-center mb-3 mt-3 font-weight-bold fw-normal'>
                    My appoinment date
                  </h4>

                  <div className='shadow p-3 mb-5 bg-body-tertiary rounded'>
                    <div className="mb-1 d-flex justify-content-between">
                      <label ><b>Appointment date: </b> {selectedDisplayDate}</label>
                      <label ><b>Time: </b> {time}</label>
                      <label ><b>Vet: </b>{vetName}</label>
                    </div>
                    <div className="border-top mt-2">
                      <label ><b>Description:  </b>{booking?.description}</label>
                    </div>
                  </div>



                  <h4 className='text-center mb-1 mt-3 font-weight-bold fw-normal'>
                    Services's Information
                  </h4>
                  <div className='shadow  mb-5 bg-body-tertiary rounded'>
                    <table className="table">
                      <thead className="table-light">
                        <tr className='text-center'>
                          <th scope="col">No</th>
                          <th scope="col">Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Price</th>
                        </tr>
                      </thead>

                      {selectedServices.map((service, index) => (

                        <tbody>
                          <tr className='text-center'>
                            <td>{index + 1}</td>
                            <td>{service?.nameService}</td>
                            <td>{service?.description}</td>
                            <td>{service?.price.toLocaleString('vi-VN')}</td>
                          </tr>
                        </tbody>
                      ))

                      }
                    </table>
                  </div>
                  <div className="form-control mb-3 rounded shadow">
                    <label className="w-50 mb-3 mt-3 mr-3 ml-3"><b >Total amount: </b>{selectedServices.map(service => service.price).reduce((total, price) => total + price, 0).toLocaleString('vi-VN')} VND </label>
                    <label className="w-50 "><b>Status: </b>{!(booking?.type) ? 'Pending' : 'Paid'}</label>
                  </div>
                </div>
                <div className='text-center mt-0'>
                  {
                    booking?.type ? null : <Link className='btn btn-outline-primary' >Payment</Link>
                  }
                </div>
              </div>
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
