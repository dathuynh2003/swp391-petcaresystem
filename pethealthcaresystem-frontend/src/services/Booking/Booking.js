import React, { useState, useEffect } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels } from '@chakra-ui/react';
import axios from 'axios';
import { CheckIcon } from '@chakra-ui/icons';
export default function Booking() {
    const [step, setStep] = useState(2);

    const [booking, setBooking] = useState({
        bookingDate: '',
        appointmentDate: '',
        status: '',
        description: '',
        user_id: '',
        pet_id: '',
        vs_id: ''
    });

    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);

    const loadPets = async () => {
        const response = await axios.get('http://localhost:8080/pet', { withCredentials: true });
        setPets(response.data);
    };

    useEffect(() => {
        loadPets();

    }, []);

    const handleOnClick = ((pet) => {
        setSelectedPet(pet)
        setBooking({ ...booking, pet_id: pet?.petId, user_id: pet?.owner.userId })

        console.log(booking);
    })

    return (
        <div className='container'>
            <div className="row">
                <Tabs className="col-8 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal">
                    <TabList className="d-flex justify-content-between">
                        <Tab>Choose Pet</Tab>
                        <Tab isDisabled={selectedPet === null}>Reason</Tab>
                        <Tab isDisabled={booking?.description === ''}>Time</Tab>
                        <Tab>Payment</Tab>
                        <Tab>Get Ready</Tab>
                        <Tab>Consult</Tab>
                    </TabList>

                    <TabPanels maxH="500px" overflowY="auto">
                        <TabPanel className="mx-auto">
                            Choose <b>Your Pet</b>
                            <div className='container'>
                                {pets.map((pet, index) => (
                                    <div className='row w-100 shadow m-3 rounded-3' style={{ height: '85px' }} onClick={() => handleOnClick(pet)} >
                                        <div className='pet-avatar border my-auto mx-4 rounded-circle col-4' style={{ height: '65px', width: '65px', overflow: 'hidden', position: 'relative' }}>
                                            {/* Pet Image */}
                                            {pet.petType === 'Dog' &&
                                                <img
                                                    className='rounded-circle'
                                                    src="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474119iJl/hinh-anh-cho-chibi_101024338.jpg" alt="DogImg"
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} >
                                                </img>
                                            }
                                            {pet.petType === 'Cat' &&
                                                <img
                                                    className='rounded-circle'
                                                    src="https://img.lovepik.com/original_origin_pic/18/10/29/2414824166a8f412b7d7c42da4b7d505.png_wh860.png" alt="CatImg"
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} >
                                                </img>
                                            }
                                            {pet.petType === 'Bird' &&
                                                <img
                                                    className='rounded-circle'
                                                    src="https://static.vecteezy.com/system/resources/previews/023/137/964/original/cute-kawaii-chicken-chibi-mascot-cartoon-style-vector.jpg" alt="BirdImg"
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} >
                                                </img>
                                            }
                                        </div>
                                        <div className='pet-info col-8 border my-2 mx-2'>
                                            <h4>{pet.name}</h4>
                                            <div className='fs-6'>
                                                {pet.petType}. {pet.age} Months. {pet.breed}
                                            </div>
                                        </div>
                                        <div className='pet-choose col-1 my-auto mx-4 border rounded-circle' style={{ width: '50px', height: '50px' }}>
                                            {pet.petId === selectedPet?.petId ?
                                                <CheckIcon
                                                    className='rounded-circle border'
                                                    style={{ backgroundColor: '#007DDE', width: '49px', height: '49px', marginLeft: '-12px', color: 'white' }}
                                                /> : ''}
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
                        <TabPanel>
                            <p>three!</p>
                        </TabPanel>
                        <TabPanel>
                            <p>three!</p>
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
