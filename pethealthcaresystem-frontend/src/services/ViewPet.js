import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';

export default function ViewPet() {

    const navigate = useNavigate()

    const roleId = localStorage.getItem('roleId')
    const [hospitalizations, setHospitalizations] = useState()

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
        setHospitalizations(response.data.hospitalizations)
    }

    const handleViewHospitalization = async (id) => {
        navigate(`/hospitalization-detail/${id}`)
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
            toast.error(e.message)
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
    //Tuần 7 làm!
    const handlePayment = async (hospitalizationId) => {
        try {
            const response = await axios.put(`http://localhost:8080/hospitalization/payment/${hospitalizationId}`, {}, { withCredentials: true })
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

            <Tabs className="col-11 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal" >
                <TabList className="d-flex justify-content-between">
                    <Tab>Pet's Information</Tab>
                    <Tab >Medical Record</Tab>
                    <Tab >Hopitalization History</Tab>
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

                                {roleId === '1' && (
                                    // <Link className='btn btn-primary col-md-12' to="/listPets">Back</Link>
                                    pet?.hospitalizations?.some(admitPet => admitPet?.status === "pending") ? (
                                        <Link className='btn btn-warning col-md-12'>Waiting Payment</Link>
                                    ) : (
                                        <Link className='btn btn-primary col-md-12' to="/listPets">Back</Link>
                                    )
                                )}
                                {roleId === '3' && (
                                    pet?.hospitalizations?.some(admitPet => admitPet?.status === "admitted") ? (
                                        <Link className='btn btn-danger col-md-12' onClick={() => handleDischarge(hospitalizations.find(hospitalization => hospitalization.status === "admitted").id)} >Discharge</Link>
                                    ) : (
                                        // <Link className='btn btn-success col-md-12' onClick={() => handleHospitalize()} >Hospitalize</Link>
                                        pet?.hospitalizations?.some(admitPet => admitPet?.status === "pending") ? (
                                            <Link className='btn btn-warning col-md-12' onClick={() => handlePayment(hospitalizations.find(hospitalization => hospitalization.status === "admitted").id)} >Waiting Payment</Link>
                                        ) : (
                                            <Link className='btn btn-success col-md-12' onClick={() => handleHospitalize()} >Hospitalize</Link>
                                        )
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
                        <div className='container'>
                            {hospitalizations?.map((hospitalization, index) => {
                                const formattedId = String(hospitalization?.id).padStart(6, '0');
                                // Chuyển đổi chuỗi thời gian thành đối tượng Date
                                const parseLocalDateTime = (localDateTime) => {
                                    if (!localDateTime) return null;  // Kiểm tra nếu localDateTime là null hoặc undefined
                                    const [day, month, yearAndTime] = localDateTime.split('/');
                                    const [year, time] = yearAndTime.split(' ');
                                    return new Date(`${year}-${month}-${day}T${time}:00`);
                                };

                                const admissionDate = parseLocalDateTime(hospitalization?.admissionTime);
                                const dischargeDate = parseLocalDateTime(hospitalization?.dischargeTime);

                                // Tính toán thời gian chênh lệch trong giờ
                                const timeDifference = Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60)); //Số ms chênh lệch / số ms trong 1h = số giờ
                                const totalCost = timeDifference * hospitalization?.cage?.price;

                                return (
                                    <div className='hospitalization row border border-dark shadow my-3' onClick={() => handleViewHospitalization(formattedId)}>
                                        <div className='col-4'>
                                            Hopitalization ID: {formattedId}
                                        </div>
                                        <div className='col-4'>
                                            Admisstion Time: {hospitalization?.admissionTime}
                                        </div>
                                        <div className='col-4'>
                                            Discharge Time: {hospitalization?.dischargeTime}
                                        </div>
                                        <div className='col-2'>
                                            Cage: {hospitalization?.cage?.name}
                                        </div>
                                        <div className='col-2 mx-auto'>
                                            {hospitalization?.status === "discharged" ?
                                                (
                                                    <div className='text-center text-danger fw-bold'>
                                                        Discharged
                                                    </div>
                                                ) : (
                                                    hospitalization?.status === "admitted" ? (
                                                        <div className='text-center text-success fw-bold'>
                                                            Admitted
                                                        </div>
                                                    ) : (
                                                        <div className='text-center text-warning fw-bold'>
                                                            Waiting Payment
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                        <div className='col-4'>
                                            {totalCost >= 0 ?
                                                <div>
                                                    Total Amount: {totalCost.toLocaleString('vi-VN') + " VND"}
                                                </div>
                                                :
                                                <div className='text-warning'>
                                                    Pet is being hospitalized and cared for...
                                                </div>
                                            }
                                            {/* Total Amount: {totalCost >= 0 ? totalCost.toLocaleString('vi-VN') + " VND" : "Waiting discharge from cage..."} */}
                                        </div>
                                    </div>
                                )
                            })}

                        </div>

                    </TabPanel>
                </TabPanels>

            </Tabs>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                // pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
