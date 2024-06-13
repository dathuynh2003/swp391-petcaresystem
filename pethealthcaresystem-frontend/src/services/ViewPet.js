import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import { TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Tab } from 'bootstrap';
import { toast } from 'react-toastify';

export default function ViewPet() {

    const navigate = useNavigate()

    const roleId = localStorage.getItem('roleId')

    const [pet, setPet] = useState(
        {
            name: "",
            gender: "",
            breed: "",
            age: "",
            petType: "",
            avatar: "",
            isNeutered: "",
            description: ""

        }
    )

    const { petId } = useParams();
    const loadPet = async () => {
        const response = await axios.get(`http://localhost:8080/pet/${petId}`)
        setPet(response.data)
    }

    const handleHospitalize = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/admit/pet/${petId}`, {}, { withCredentials: true })
            if (response.data.message === 'Admitted pet successfully') {
                // setHospitalization(response.data.hospitalization)
                toast.success(response.data.message);
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                toast.warning(response.data.message)
                console.log(response.data.message)
            }
        } catch (e) {
            toast.error("An unexpected error occurred")
            // console.error(e); // This helps to debug in case of an unexpected error
            setTimeout(() => {
                navigate('/404page')
            }, 2000);
        }
    }

    const handleDischarge = async (hospitalizationId) => {
        try {
            const response = await axios.put(`http://localhost:8080/discharged/${hospitalizationId}`, {}, { withCredentials: true })
            if (response.data.message === 'Discharged pet successfully') {
                toast.success(response.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                toast.warning(response.data.message)
            }
        } catch (e) {
            toast.error(e.message)
            setTimeout(() => {
                navigate('/404page')
            }, 2000);
        }
    }

    useEffect(() => {
        loadPet()
    }, [])

    return (
        <div>
            <div className='container'>
                <div className='col-md-5 offset-md-4 border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded'>

                    <h2 className='text-center m-4'> Pet's Information</h2>
                    <Tabs className="col-11 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal" >
                        <TabList className="d-flex justify-content-between">
                            <Tab>Pet's Information</Tab>
                            <Tab >Medical Record</Tab>
                            <Tab >Hopitalization history</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <div className='container'>
                                    <div className='col-md-6 mx-auto offset-md-4 border rounded-lg p-4 mt-2 shadow p-3 mb-5 bg-body-tertiary rounded'>

                                        <h2 className='text-center m-4'> Pet's Information</h2>

                                        <div className='row row-cols-2'>
                                            <div className="form-floating mb-3 col">
                                                <input
                                                    value={pet.name}
                                                    type="text" className="form-control" id="name" readOnly />
                                                <label htmlFor="name">Pet's name</label>
                                            </div>
                                            <div className="form-floating mb-3 col">
                                                <input
                                                    value={pet.petType}
                                                    type="text" className="form-control" id="type" readOnly />
                                                <label htmlFor="type">Pet's type</label>
                                            </div>
                                            <div className="form-floating mb-3 col">
                                                <input
                                                    value={pet.breed}
                                                    type="text" className="form-control" id="breed" readOnly />
                                                <label htmlFor="breed">Pet's breed</label>
                                            </div>
                                            <div className="form-floating mb-3 col">
                                                <input
                                                    value={pet.gender}
                                                    type="text" className="form-control" id="gender" readOnly />
                                                <label htmlFor="gender">Sex</label>
                                            </div>


                                            <div className="form-floating mb-3 col">
                                                <input
                                                    value={pet.isNeutered ? 'Yes' : 'No'}
                                                    type="text" className="form-control" id="neutered" readOnly />
                                                <label htmlFor="neutered">Neutered</label>
                                            </div>

                                            <div className="form-floating mb-3 col">
                                                <input
                                                    value={pet.age}
                                                    type="text" className="form-control" id="age" readOnly />
                                                <label htmlFor="age">Age (month(s))</label>
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3 col">
                                            <input
                                                value={pet.description}
                                                type="text" className="form-control" id="description" readOnly />
                                            <label htmlFor="description">Description</label>
                                        </div>

                                        {roleId !== '3' && (<Link className='btn btn-primary col-md-12' to="/listPets">Back</Link>)}
                                        {roleId === '3' && (
                                            pet?.hospitalizations?.some(admitPet => admitPet?.status === "admitted") ? (
                                                <Link className='btn btn-danger col-md-12' onClick={() => handleDischarge(pet?.hospitalizations.find(hospitalization => hospitalization.status === "admitted").id)} >Discharge</Link>
                                            ) : (
                                                <Link className='btn btn-success col-md-12' onClick={() => handleHospitalize()} >Hospitalize</Link>
                                            )
                                        )}
                                    </div>


                                </div>
                            </TabPanel>


                            <TabPanel>
                                <div className='container'>

                                </div>

                            </TabPanel>


                            <TabPanel>

                            </TabPanel>
                        </TabPanels>

                    </Tabs>
                    <div>
                    </div>
                    <div className="form-floating mb-3 col">
                        <input
                            value={pet.breed}
                            type="text" className="form-control" id="breed" readOnly />
                        <label for="breed">Pet's breed</label>
                    </div>
                    <div className="form-floating mb-3 col">
                        <input
                            value={pet.gender}
                            type="text" className="form-control" id="gender" readOnly />
                        <label for="gender">Gender</label>
                    </div>


                    <div className="form-floating mb-3 col">
                        <input
                            value={pet.isNeutered ? 'Yes' : 'No'}
                            type="text" className="form-control" id="neutered" readOnly />
                        <label for="neutered">Neutered</label>
                    </div>

                    <div className="form-floating mb-3 col">
                        <input
                            value={pet.age}
                            type="text" className="form-control" id="age" readOnly />
                        <label for="age">Age</label>
                    </div>
                </div>
                <div className="form-floating mb-3 col">
                    <input
                        value={pet.description}
                        type="text" className="form-control" id="description" readOnly />
                    <label for="description">Description</label>
                </div>

                <Link className='btn btn-primary col-md-12' to="/listPets">Back</Link>

            </div>
        </div >
    )
}
