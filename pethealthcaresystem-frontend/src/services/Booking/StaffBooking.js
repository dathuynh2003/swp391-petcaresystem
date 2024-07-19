import React, { useState, useEffect, useRef } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button, WrapItem, Avatar, background, Select, Input } from '@chakra-ui/react';
import axios from 'axios';
import { CheckIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Box, Image, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { URL } from '../../utils/constant'


export default function Booking() {

    // ĐỂ BẮT SAU KHI LÀM XONG
    // let navigate = useNavigate()
    // useEffect(()=> {
    //   if (!localStorage.getItem('isLoggedIn')) {
    //     navigate('/login')
    //   }
    // },[])

    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [totalPages, setTotalPages] = useState(0)
    const location = useLocation();


    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const [booking, setBooking] = useState({
        description: '',
        type: false,
    });

    const [phone, setPhone] = useState('');
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);

    const data = location?.state;
    const isFirstRun = useRef(true);
    useEffect(() => {
        loadServices();
        loadShift();
        // Kiểm tra xem data có tồn tại không và không được trống
        // const data = location?.state;

    }, []);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (data) {
            setSelectedServices(prevSelected => [...prevSelected, data]);
        }

    }, [])

    const loadServices = async () => {
        try {
            let size = pageSize
            if (pageNo === 0 && data) {
                size = 4
            }
            const response = await axios.get(`${URL}/services?pageNo=${pageNo}&pageSize=${size}`)
            let list = response.data.content
            if (data) {
                list = list.filter(service => service.id !== data.id)
                if (pageNo === 0) {
                    list = [data, ...list]
                }
            }
            setServices(list)
            setTotalPages(response.data.totalPages)




        } catch (error) {
            console.log(error)
        }

    };
    useEffect(() => {
        loadServices()

    }, [pageNo])

    const loadPets = async () => {
        const phoneNumberFormat = /^((\+84|84|0)[3|5|7|8|9])+([0-9]{8})$/;

        if (!phone) {
            toast.warn('Please enter a phone number');
            return;
        }

        if (!phoneNumberFormat.test(phone)) {
            toast.warn('Invalid phone number format');
            return;
        }

        try {
            const response = await axios.get(`${URL}/pets/ownerPhone/${phone}`);
            const foundPets = response.data.filter(pet => !pet.isDeceased);
            if (foundPets.length === 0) {
                toast.info('No pets found for the entered phone number');
            }
            setPets(foundPets);
        } catch (error) {
            console.error('Error searching pets:', error);
            toast.error(error.message);
        }
    };

    const loadShift = async () => {
        try {
            const response = await axios.get(`${URL}/shifts/details`, { withCredentials: true });
            setShifts(response.data);
        } catch (error) {
            console.log(error)
        }
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

    useEffect(() => {
        console.log(booking);
    }, [booking]);

    //Selected pet nào thì tính tuổi cho pet đó luôn
    const [age, setAge] = useState()
    const choosePet = async (pet) => {
        const response = await axios.get(`${URL}/hospitalization/pet/${pet.petId}/status/admitted`, { withCredentials: true })
        if (response.data.message !== 'List hosp is empty') {
            toast.info("Pet is still being kept at the clinic, no more appointments can be made!")
            return
        }
        const response2 = await axios.get(`${URL}/hospitalization/pet/${pet.petId}/status/pending`, { withCredentials: true })
        if (response2.data.message !== 'List hosp is empty') {
            toast.info('You need to pay for the previous hospitalization before booking for ' + pet.name)
            return
        }
        setSelectedPet(pet);
        const today = new Date();
        const dob = new Date(pet.dob);
        const diffMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
        const age = diffMonths !== 0 ? diffMonths : 1;
        setAge(age)
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
        return date?.toLocaleDateString("en", { weekday: 'short', month: 'long', day: 'numeric' }); // Định dạng ngày thành dd/mm/yyyy
    };

    const [vets, setVets] = useState([]);
    const [activeDateIndex, setActiveDateIndex] = useState(null);
    const [shifts, setShifts] = useState([]);
    const handlePageClick = (data) => {
        setPageNo(data.selected)
    }


    const handleClickDay = async (date, index) => {
        setSelectedVetShift(null);
        setActiveShiftIndex(null);
        setDisplaySelectedDate(date.toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' }))
        setActiveDateIndex(index)
        const response = await axios.get(`${URL}/shifts/shiftByDate/${date.toLocaleDateString('en-CA')}`);
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
        const response = await axios.post(`${URL}/createBookingByStaff/pet/${selectedPet.petId}/vet-shift/${selectedVetShift}/services/${serviceIds}`, booking, { withCredentials: true });
        setCurrentBooking(response.data)
        console.log(response.data);

    }

    const updateBookingAfterPAID = async (booking) => {
        try {
            const response = await axios.put(`${URL}/booking/paid`, booking);
            return response.data;
        } catch (error) {
            console.error("There was an error updating the booking to PAID!", error);
            throw error;
        }
    };

    const updateBookingAfterCANCELLED = async (booking) => {
        try {
            const response = await axios.put(`${URL}/booking/cancelled`, booking);
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

    const handleClickAPI = (content) => {
        if (content !== null && content !== undefined && content !== '') {
            callAPI()
            setStep(step + 1)
        }
        else toast.warn('Please input required information!')
    }

    const handleConfirmClick = async () => {
        try {
            const updatedBooking = await updateBookingAfterPAID(curBooking);
            console.log('Booking updated to PAID:', updatedBooking);
            setBooking(updatedBooking); // Update state with the updated booking
        } catch (error) {
            console.error('Error updating booking to PAID:', error);
        }

        const payment = {
            paymentType: 'Cash',  // You can modify this as per your requirement
            amount: curBooking.totalAmount,
            paymentDate: new Date().toISOString(),
            status: 'PAID',
            description: curBooking.description,
            user: selectedPet.owner,
            booking: curBooking
        };

        try {
            const response = await axios.post(`${URL}/api/payment/create`, payment, { withCredentials: true });
        } catch (error) {
            toast.error('Payment failed!');
            console.error(error);
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

    const [vetList, setVetList] = useState([]);
    const handleGetVets = async () => {
        try {
            const respone = await axios.get(`${URL}/vets`, { withCredentials: true })
            if (respone.data.message === "Successfully") {
                setVetList(respone.data.vets);
            }
        } catch (e) {
            toast.error(e.message);
        }
    }
    const [selectedVet, setSelectedVet] = useState('');
    const [groupedVetShiftDetails, setGroupedVetShiftDetails] = useState({});
    // Hàm để nhóm các đối tượng theo ngày
    const groupByDate = (vetShiftDetails) => {
        return vetShiftDetails.reduce((acc, detail) => {
            if (!acc[detail.date]) {
                acc[detail.date] = []
            }
            acc[detail.date].push(detail)
            return acc;
        }, {})
    }

    const handleVetChange = (e) => {
        const userId = parseInt(e.target.value, 10)
        const vet = vetList.find(vet => vet.userId === userId);
        setSelectedVet(vet);
        if (vet) {
            const grouped = groupByDate(vet.vetShiftDetails)
            setGroupedVetShiftDetails(grouped)
        }
    }

    // Chuyển đổi đối tượng groupedVetShiftDetails thành mảng
    const groupedVetShiftDetailsArray = Object.keys(groupedVetShiftDetails).map(date => ({
        date,
        details: groupedVetShiftDetails[date]
    }));

    const [selectedDate, setSelectedDate] = useState()
    const handleClickDay2 = async (date, index) => {
        setSelectedVetShift(null);
        setActiveShiftIndex(null);
        setDisplaySelectedDate(date.toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' }))
        setActiveDateIndex(index)
        setSelectedDate(new Date(date).toLocaleDateString('en-CA'))
    };

    return (
        <div className="container">
            <div className="row">
                <ToastContainer />
                <Tabs className="col-11 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal" index={step}>
                    <TabList className="d-flex justify-content-between">
                        <Tab>Services</Tab>
                        <Tab >Choose Pet</Tab>
                        <Tab >Reason</Tab>
                        <Tab >Time</Tab>
                        <Tab>Payment</Tab>
                        {/* <Tab>Get Ready</Tab> */}
                        <Tab>Consult</Tab>
                    </TabList>

                    <TabPanels >
                        {/* maxH="500px" overflowY="auto" */}
                        <TabPanel>
                            <b className="row mx-auto">Our Services</b>
                            <div className="container">
                                {services?.map((service, index) => (
                                    <div
                                        key={index}
                                        className="row w-100 shadow m-3 rounded-3 service-item "
                                        style={{ height: '100px', cursor: 'pointer' }}
                                        onClick={() => chooseServices(service)}

                                    >
                                        <div className="service-info col-7 my-auto mx-3  h-100 d-flex gap-3 align-items-center">
                                            <WrapItem className='mt-2'>
                                                <Avatar size='lg' src={service?.img} />
                                            </WrapItem>
                                            <div className='mt-2 mb-3'>
                                                <h5>{service?.nameService}</h5>
                                                <div className="fs-6 fst-italic">{service?.description}</div>
                                            </div>
                                        </div>
                                        <div className="service-price col-3 my-auto  text-center">
                                            <div className="my-3 p-1 fw-bold">{service?.price?.toLocaleString('vi-VN') + " "}VND</div>
                                        </div>
                                        <div
                                            className="service-choose col-1 mx-3 my-auto  rounded-circle"
                                            style={{ width: '50px', height: '50px' }}
                                        >
                                            {selectedServices?.some((selectedService) => selectedService?.id === service?.id) ? (
                                                <CheckIcon boxSize={8}
                                                    className="rounded-circle"
                                                    style={{
                                                        backgroundColor: 'teal',
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
                            <div>
                                <ReactPaginate
                                    previousLabel={'Previous'}
                                    nextLabel={'Next'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={totalPages}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageClick}
                                    containerClassName={'pagination justify-content-center'}
                                    pageClassName={'page-item'}
                                    pageLinkClassName={'page-link'}
                                    previousClassName={'page-item'}
                                    previousLinkClassName={'page-link'}
                                    nextClassName={'page-item'}
                                    nextLinkClassName={'page-link'}
                                    activeClassName={'active'}
                                />
                            </div>
                            <div className='text-center'>
                                <Button style={{ background: 'teal', color: 'white' }} onClick={() => handleNextClick(selectedServices)}>Next</Button>
                            </div>
                        </TabPanel>

                        <TabPanel className="mx-auto">
                            <div className="container">
                                <div className="row">
                                    <Input
                                        className="col-6 mx-auto my-3"
                                        placeholder="Enter owner's phone number"
                                        value={phone}
                                        type='number'
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <Button className="col-3 mx-auto my-3" colorScheme="teal" onClick={loadPets}>
                                        Search Pets
                                    </Button>
                                </div>
                                <div className="container">
                                    {pets?.map((pet, index) => {
                                        //Tính tuổi của pet dựa vào dob (đơn vị month(s))
                                        const today = new Date();
                                        const dob = new Date(pet.dob);
                                        const diffMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
                                        const age = diffMonths !== 0 ? diffMonths : 1;
                                        return (
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
                                                    <img
                                                        className="rounded-circle"
                                                        src={pet.avatar === null ? '' : pet.avatar}
                                                        alt="PetAvatar"
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    ></img>
                                                </div>
                                                <div className="pet-info col-8  my-2 mx-2">
                                                    <h5>{pet.name}</h5>
                                                    <div className="fs-6">
                                                        {pet.petType}. {age} Months. {pet.breed}
                                                    </div>
                                                </div>
                                                <div
                                                    className="pet-choose col-1 my-auto mx-4  rounded-circle"
                                                    style={{ width: '50px', height: '50px' }}
                                                >
                                                    {pet.petId === selectedPet?.petId ? (
                                                        <CheckIcon boxSize={8}
                                                            className="rounded-circle"
                                                            style={{
                                                                backgroundColor: 'teal',
                                                                color: 'white',
                                                            }}
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center gap-3'>
                                <Button style={{ background: 'teal', color: 'white' }} onClick={() => handleBackClick()}>Back</Button>
                                <Button style={{ background: 'teal', color: 'white' }} onClick={() => handleNextClick(selectedPet)}>Next</Button>
                            </div>
                        </TabPanel>

                        <TabPanel>
                            What's the reason for your consult today?
                            <div className="form-floating">
                                <textarea
                                    className="form-control mt-3"
                                    style={{ height: '300px', resize: 'none' }}
                                    maxLength={100}
                                    placeholder="Leave a comment here"
                                    id="floatingTextarea2"
                                    onChange={(e) => setBooking((prev) => ({ ...prev, description: e.target.value }))}
                                ></textarea>
                                <label htmlFor="floatingTextarea2">Eg: My pet hasn't been eating the last few days</label>
                            </div>

                            <div className='d-flex justify-content-center gap-3 mt-3'>
                                <Button style={{ background: 'teal', color: 'white' }} onClick={() => handleBackClick()}>Back</Button>
                                <Button style={{ background: 'teal', color: 'white' }} onClick={() => handleNextClickDescription()}>Next</Button>

                            </div>

                        </TabPanel>

                        <TabPanel>
                            <Tabs variant='soft-rounded' colorScheme='teal'>
                                <TabList className='d-flex justify-content-center text-center'>
                                    <Tab
                                        className='col-4 mx-5 mt-3'
                                        _selected={{ bg: 'teal', color: 'white' }}
                                        _hover={{ bg: 'teal', color: 'white' }}
                                        onClick={() => {
                                            setSelectedVetShift(null);
                                            setActiveShiftIndex(null);
                                            setActiveDateIndex(null)
                                            setVets([])
                                            setVetName('');
                                            setTime('')
                                        }}
                                    >
                                        Choose Date First
                                    </Tab>
                                    <Tab
                                        className='col-4 mx-5 mt-3'
                                        _selected={{ bg: 'teal', color: 'white' }}
                                        _hover={{ bg: 'teal', color: 'white' }}
                                        onClick={() => {
                                            setSelectedVetShift(null)
                                            setActiveShiftIndex(null)
                                            setActiveDateIndex(null)
                                            setSelectedDate(null)
                                            setVetName('')
                                            setTime('')
                                            handleGetVets();
                                        }}
                                    >
                                        Choose Vet First
                                    </Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-md-12 border rounded p-4 mt-2 shadow">
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <Button onClick={handlePreviousWeek} style={{ background: 'teal', color: 'white' }}>
                                                            Previous Week
                                                        </Button>
                                                        <Button onClick={handleNextWeek} style={{ background: 'teal', color: 'white' }}>
                                                            Next Week
                                                        </Button>
                                                    </div>
                                                    <div className='choose-date row mt-3'>
                                                        {dates.map((date, index) => {
                                                            const today = new Date().setHours(0, 0, 0, 0);
                                                            const isPastDate = new Date(date).setHours(0, 0, 0, 0) < today;
                                                            return (
                                                                <Button
                                                                    key={index}
                                                                    className='mx-auto btn fw-normal'
                                                                    style={{
                                                                        width: '12%',
                                                                        color: activeDateIndex === index ? 'white' : '',
                                                                        background: activeDateIndex === index ? 'rgb(80, 200, 180)' : '',
                                                                        opacity: isPastDate ? 0.5 : 1
                                                                    }}
                                                                    onClick={() => handleClickDay(date, index)}
                                                                    isDisabled={isPastDate}
                                                                >
                                                                    {`${formatDate(date)}`} <br />
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className='choose-vetshift mt-3'>
                                                        {vets.map((vet, index) => (
                                                            <div className='text-center' key={index}>
                                                                <h1 className='fs-3'>{vet?.fullName}</h1>
                                                                <div className='row mr-3 mx-2'>
                                                                    {vet?.workSchedule?.map((workSchedule, workScheduleIndex) => {
                                                                        const isPastShift = new Date(workSchedule.date + ' ' + workSchedule.shift.from_time) < new Date();
                                                                        return (
                                                                            <button
                                                                                key={workScheduleIndex}
                                                                                className='col-2 mt-3 mx-3 my-2 btn'
                                                                                style={{
                                                                                    width: '12%',
                                                                                    color: activeShiftIndex === workSchedule?.vs_id ? 'white' : '',
                                                                                    background: activeShiftIndex === workSchedule?.vs_id ? 'rgb(80, 200, 180)' : '',
                                                                                    border: '1px solid #ccc',
                                                                                    opacity: isPastShift || workSchedule?.status !== "Available" ? 0.5 : 1
                                                                                }}
                                                                                disabled={isPastShift || workSchedule?.status !== "Available"}
                                                                                onClick={() => chooseShift(workSchedule?.vs_id, workSchedule?.vs_id, vet?.fullName, workSchedule?.shift.from_time + ' - ' + workSchedule?.shift.to_time)}
                                                                                _hover={{ background: 'teal', color: 'white' }}
                                                                            >
                                                                                {workSchedule?.shift?.from_time} - {workSchedule?.shift?.to_time}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-center mt-3 d-flex justify-content-center gap-3 text-center'>
                                            <Button onClick={() => handleBackClick()} style={{ background: 'teal', color: 'white' }}>Back</Button>
                                            <Button onClick={() => handleClickAPI(selectedVetShift)} style={{ background: 'teal', color: 'white' }}>Next</Button>
                                        </div>
                                    </TabPanel>

                                    <TabPanel>
                                        <div className="container">
                                            <div className="row border rounded p-4 mt-2 shadow">
                                                <div className='d-flex justify-content-center'>
                                                    <Select
                                                        placeholder='Select Vet'
                                                        width={'50%'}
                                                        onChange={handleVetChange}
                                                    >
                                                        {vetList?.map((vet, index) => (
                                                            <option value={vet?.userId} key={index}>{vet?.fullName}</option>
                                                        ))}
                                                    </Select>
                                                </div>
                                                {selectedVet !== '' &&
                                                    <div className='col-12 my-2'>
                                                        <div className="d-flex justify-content-between mb-3">
                                                            <Button onClick={handlePreviousWeek} style={{ background: 'teal', color: 'white' }}>
                                                                Previous Week
                                                            </Button>
                                                            <Button onClick={handleNextWeek} style={{ background: 'teal', color: 'white' }}>
                                                                Next Week
                                                            </Button>
                                                        </div>
                                                        <div className='choose-date row'>
                                                            {dates.map((date, index) => {
                                                                const today = new Date().setHours(0, 0, 0, 0);
                                                                const isPastDate = new Date(date).setHours(0, 0, 0, 0) < today;
                                                                return (
                                                                    <Button
                                                                        key={index}
                                                                        className='mx-auto btn fw-normal'
                                                                        style={{
                                                                            width: '12%',
                                                                            color: activeDateIndex === index ? 'white' : '',
                                                                            background: activeDateIndex === index ? 'rgb(80, 200, 180)' : '',
                                                                            opacity: isPastDate || !groupedVetShiftDetailsArray.some(detail => detail.date === new Date(date).toLocaleDateString('en-CA')) ? 0.5 : 1
                                                                        }}
                                                                        onClick={() => handleClickDay2(date, index)}
                                                                        isDisabled={isPastDate || !groupedVetShiftDetailsArray.some(detail => detail.date === new Date(date).toLocaleDateString('en-CA'))}
                                                                    >
                                                                        {`${formatDate(date)}`} <br />
                                                                    </Button>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className='choose-vetshift'>
                                                            {groupedVetShiftDetailsArray
                                                                .filter(detail => detail.date === selectedDate)
                                                                .map((vetShiftDetail, index) => (
                                                                    <div className='row' key={index}>
                                                                        {vetShiftDetail?.details?.map((detail, detailIndex) => {
                                                                            const isPastShift = new Date(detail.date + ' ' + detail.shift.to_time) < new Date();
                                                                            return (
                                                                                <button
                                                                                    key={detailIndex}
                                                                                    className='col-2 mt-3 mx-3 my-2 btn'
                                                                                    style={{
                                                                                        width: '12%',
                                                                                        color: activeShiftIndex === detail?.vs_id ? 'white' : '',
                                                                                        background: activeShiftIndex === detail?.vs_id ? 'rgb(80, 200, 180)' : '',
                                                                                        border: '1px solid #ccc',
                                                                                        opacity: isPastShift || detail?.status !== "Available" ? 0.5 : 1
                                                                                    }}
                                                                                    disabled={isPastShift || detail?.status !== "Available"}
                                                                                    onClick={() => chooseShift(detail?.vs_id, detail?.vs_id, selectedVet.fullName, detail?.shift.from_time + ' - ' + detail?.shift.to_time)}
                                                                                >
                                                                                    {detail?.shift?.from_time} - {detail?.shift?.to_time}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className='text-center mt-3 d-flex justify-content-center gap-3 text-center'>
                                            <Button onClick={() => handleBackClick()} style={{ background: 'teal', color: 'white' }}>Back</Button>
                                            <Button onClick={() => handleClickAPI(selectedVetShift)} style={{ background: 'teal', color: 'white' }}>Next</Button>
                                        </div>
                                    </TabPanel>

                                </TabPanels>
                            </Tabs>
                        </TabPanel>
                        <TabPanel>
                            <Box className='container row'>
                                <Box className='col border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded'>
                                    <Box display='flex' alignItems='center'>
                                        <Image src="logoApp.svg" alt="Logo" className="logo" /> Pet Health Care
                                    </Box>
                                    <Text as='h2' textAlign='center' mb={3}>
                                        Booking Information
                                    </Text>
                                    <div className="mb-3 d-flex justify-content-end">
                                        {/* <label className="w-50 "><b>Booking ID: </b>Chưa xử lí</label> */}
                                    </div>
                                    <div className='shadow p-3 mb-5 bg-body-tertiary rounded'>


                                        <div className="d-flex border-bottom mb-3">
                                            <label className="w-50 "><b>Date: </b>{new Date().toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' })} </label>
                                            <div className='w-50'>
                                                <label className="w-50"><b >Pet's name: </b> {selectedPet?.name}</label>
                                                <label className="w-50" ><b>Pet's type: </b> {selectedPet?.petType}</label>

                                            </div>

                                        </div>


                                        <div className="d-flex border-bottom mb-3 ">
                                            <label className="w-50"><b>Pet's owner: </b> {selectedPet?.owner?.fullName}</label>
                                            <div className='w-50'>
                                                <label className="w-50"><b>Pet's breed: </b> {selectedPet?.breed}</label>
                                                <label className='w-50'><b >Pet's sex: </b> {selectedPet?.gender}</label>

                                            </div>

                                        </div>
                                        <div className="border-bottom mb-3 ">

                                            <label className="w-50"><b>Phone number: </b>{selectedPet?.owner?.phoneNumber}</label>
                                            <label className='w-50'><b>Pet's age: </b> {age} month(s)</label>


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
                                <div className='d-flex justify-content-center gap-3 mt-3'>
                                    <Button style={{ background: 'gray', color: 'white' }} onClick={() => handleCancelClick()}>Cancel</Button>
                                    <Button style={{ background: 'teal', color: 'white' }} onClick={() => handleConfirmClick()}>Confirm PAID</Button>
                                </div>
                            </Box>
                        </TabPanel>

                        <TabPanel>
                            <div>
                                <div className="card-body">
                                    {booking.status === 'CANCELLED' && (
                                        <div>
                                            <h2 className="text-center text-danger">CANCELLED</h2>
                                        </div>
                                    )}
                                    {booking.status === 'PAID' && (
                                        <div>
                                            <h2 className="text-center text-success">PAID</h2>
                                        </div>
                                    )}
                                </div>
                                <Box className='col border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded'>
                                    <Box display='flex' alignItems='center'>
                                        <Image src="logoApp.svg" alt="Logo" className="logo" /> Pet Health Care
                                    </Box>
                                    <Text as='h2' textAlign='center' mb={3}>
                                        Booking Information
                                    </Text>
                                    <div className="mb-3 d-flex justify-content-end">
                                        {/* <label className="w-50 "><b>Booking ID: </b>Chưa xử lí</label> */}
                                    </div>
                                    <div className='shadow p-3 mb-5 bg-body-tertiary rounded'>


                                        <div className="d-flex border-bottom mb-3">
                                            <label className="w-50 "><b>Date: </b>{new Date().toLocaleDateString("en-Gb", { month: 'numeric', day: 'numeric', year: 'numeric' })} </label>
                                            <div className='w-50'>
                                                <label className="w-50"><b >Pet's name: </b> {selectedPet?.name}</label>
                                                <label className="w-50" ><b>Pet's type: </b> {selectedPet?.petType}</label>

                                            </div>

                                        </div>


                                        <div className="d-flex border-bottom mb-3 ">
                                            <label className="w-50"><b>Pet's owner: </b> {selectedPet?.owner?.fullName}</label>
                                            <div className='w-50'>
                                                <label className="w-50"><b>Pet's breed: </b> {selectedPet?.breed}</label>
                                                <label className='w-50'><b >Pet's sex: </b> {selectedPet?.gender}</label>

                                            </div>

                                        </div>
                                        <div className="border-bottom mb-3 ">

                                            <label className="w-50"><b>Phone number: </b>{selectedPet?.owner?.phoneNumber}</label>
                                            <label className='w-50'><b>Pet's age: </b> {age} month(s)</label>


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
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div >
    );
}