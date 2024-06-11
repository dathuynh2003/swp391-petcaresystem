import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button } from '@chakra-ui/react';
import axios from 'axios'

export default function ViewPet() {

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
    useEffect(() => {
        loadPet()
    }, [])

    return (
        <div>


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
                                        <label for="name">Pet's name</label>
                                    </div>
                                    <div className="form-floating mb-3 col">
                                        <input
                                            value={pet.petType}
                                            type="text" className="form-control" id="type" readOnly />
                                        <label for="type">Pet's type</label>
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
                                        <label for="gender">Sex</label>
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
                                        <label for="age">Age (month(s))</label>
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




        </div>
    )
}
