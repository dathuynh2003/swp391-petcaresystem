import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button } from '@chakra-ui/react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import {
    Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, useDisclosure, Input, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, FormLabel
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'


export default function ViewPet() {
    let navigate = useNavigate();

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
        const response = await axios.get(`http://localhost:8080/pet/${petId}`, { withCredentials: true })
        setPet(response.data)
        setMedicalRecord((prev) => ({ ...prev, pet: response.data }))
        setHospitalizations(response.data.hospitalizations)
        console.log(response.data)
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
        loadMedicalRecord()
    }, [])
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [isAddingMedicine, setIsAddingMedicine] = useState(false);
    const initialRef1 = React.useRef(null);

    const [listMedicineBySearch, setListMedicineBySearch] = useState([])
    const [keyword, setKeyWord] = useState()

    const loadMedicineBySearch = async () => {
        if (keyword) {
            const response = await axios.get(`http://localhost:8080/medicine/searchByName/${keyword}`, { withCredentials: true });
            setListMedicineBySearch(response.data.MEDICINES);

        }

    }

    useEffect(() => {

        loadMedicineBySearch()
        console.log(typeof (keyword));
        console.log(listMedicineBySearch);

    }, [keyword])

    const [listSelectedMedicines, setListSelectedMedicines] = useState([])
    const [prescription, setPrescription] = useState({
        dosage: 1,
        frequency: '',
        unit: '',
        price: 0,
        medicine: {},
        name: '',
        medicine_id: 0,
        vetNote: '',
        quantity: 0
    })
    console.log(prescription);
    console.log("list chọn");
    console.log(listSelectedMedicines);
    const [displayMapMedicine, setDisplayMapMedicine] = useState(false)
    const [medicalRecord, setMedicalRecord] = useState({
        pet: {},
        diagnosis: '',
        treatment: '',
        vet_note: '',
    })


    const handleAddPrescription = () => {
        setListSelectedMedicines((prev) => {
            const filteredList = prev.filter(item => item.medicine_id !== prescription.medicine_id);
            return [...filteredList, { ...prescription, dosage: Number(prescription.dosage) }];
        });

    };



    const medicalRecordRequest = {

        medicalRecord: medicalRecord,
        listPrescriptions: listSelectedMedicines
    };
    const callAPI = async () => {
        try {
            if (medicalRecord.diagnosis || medicalRecord.treatment){
                const response = await axios.post(`http://localhost:8080/medicalRecord/add/${petId}`, medicalRecordRequest, { withCredentials: true })
                console.log(response.data.MedicalRecord);
                if (response.data.MedicalRecord === null || response.data.MedicalRecord === undefined) {
                    toast.error("Add new medical record failed!")
                } else {
                    toast.success("Add new medical record successfully!")
                }
        
                loadMedicalRecord()
            }
            else{
                toast.error("Diagnosis and Treatment are required!")
            }
        
        } catch (error) {
            console.log(error);
        }
    }

    const [medicalRecords, setMedicalRecords] = useState([])
    const loadMedicalRecord = async () => {
        const response = await axios.get(`http://localhost:8080/medicalRecord/getById/${petId}`, { withCredentials: true })
        console.log(response.data);
        response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        setMedicalRecords(response.data)
    }


    const handleDeleteMedicine = (e) => {
        setListSelectedMedicines((prev) => (prev.filter(medicine => medicine.medicine_id !== e.medicine_id)))
    }
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
                            </div >


                        </div >
                    </TabPanel >


                    <TabPanel>
                        <div className='container'>
                            {roleId === '3' ? <Button onClick={onOpen} colorScheme='teal' className='mb-3'>Add new medical record</Button> : <></>}
                            <Modal size={'3xl'} className="mx-auto"
                                initialFocusRef={initialRef}
                                finalFocusRef={finalRef}
                                isOpen={isOpen}
                                onClose={onClose}
                            >
                                <ModalOverlay />
                                <ModalContent size={'xl'}>
                                    <ModalHeader>Create new Medical Record</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6} >
                                        <FormControl mt={4} className='d-flex'>
                                            <FormLabel className='w-50'>Pet's owner  <Input ref={initialRef} value={pet?.owner?.fullName} /></FormLabel>
                                            <FormLabel className='w-50'>Phone number <Input value={pet?.owner?.phoneNumber} /></FormLabel>
                                        </FormControl>
                                        <FormControl className='d-flex'>
                                            <FormLabel className='w-50'>Pet's name <Input ref={initialRef} value={pet.name} /></FormLabel>
                                            <FormLabel className='w-50'>Pet's type <Input value={pet.petType} /></FormLabel>
                                        </FormControl>
                                        <FormControl className='d-flex justify-content-between'>
                                            <FormLabel>Pet's breed <Input ref={initialRef} value={pet.breed} /></FormLabel>
                                            <FormLabel>Pet's sex <Input value={pet.gender} /></FormLabel>
                                            <FormLabel>Pet's age <Input value={pet.age} /></FormLabel>
                                        </FormControl>
                                        <FormControl  >
                                            <FormLabel>Diagnosis <Input ref={initialRef} placeholder='Diagnosis' onChange={(value) => (setMedicalRecord((prev) => ({ ...prev, diagnosis: value.target.value })))} /></FormLabel>
                                        </FormControl>
                                        <FormControl  >
                                            <FormLabel>Treatment <Input ref={initialRef} placeholder='Treatment' onChange={(value) => (setMedicalRecord((prev) => ({ ...prev, treatment: value.target.value })))} /></FormLabel>
                                        </FormControl>
                                        <Button className='btn border' colorScheme={'teal'} onClick={() => setIsAddingMedicine(true)}>Add medicine</Button>
                                        {isAddingMedicine && (
                                            <Modal
                                                initialFocusRef={initialRef1}
                                                isOpen={isAddingMedicine}
                                                onClose={() => setIsAddingMedicine(false)}
                                            >
                                                <ModalOverlay />
                                                <ModalContent>
                                                    <ModalHeader>Medicine</ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody pb={6}>
                                                        <FormControl>
                                                            <div className='d-flex gap-1'>  <Input placeholder='Search medicine' onChange={(e) => setKeyWord(e.target.value)} onClick={() => setDisplayMapMedicine(false)} /><SearchIcon boxSize={'1.5rem'} className='mt-2 ml-2' /></div>
                                                            {displayMapMedicine === false ?
                                                                <div style={{ maxHeight: '200px', overflow: "auto" }} >
                                                                    {listMedicineBySearch?.map((medicine, index) => (
                                                                        <p key={index} className="form-control " onClick={() => { setPrescription(prev => ({ ...prev, medicine: medicine, unit: medicine.unit, price: medicine.price, name: medicine.name, medicine_id: medicine.id, quantity: medicine.quantity })); setDisplayMapMedicine(true) }}>{medicine.name}</p>

                                                                    ))}
                                                                </div> : <></>}

                                                            <FormLabel>Name<Input value={prescription.name} readOnly /></FormLabel>
                                                        </FormControl>
                                                        <FormControl>

                                                        </FormControl>
                                                        <FormControl>
                                                            <FormLabel>Dosage</FormLabel>
                                                            <NumberInput defaultValue={1} min={1} max={prescription.medicine.quantity} onChange={(value) => setPrescription((prev) => ({ ...prev, dosage: value }))}>
                                                                <NumberInputField />
                                                                <NumberInputStepper>
                                                                    <NumberIncrementStepper />
                                                                    <NumberDecrementStepper />
                                                                </NumberInputStepper>
                                                            </NumberInput>
                                                        </FormControl>
                                                        <FormControl mt={4}>
                                                            <FormLabel>Frequency</FormLabel>
                                                            <Input placeholder='Frequency' onChange={(value) => setPrescription((prev) => ({ ...prev, frequency: value.target.value }))} />
                                                        </FormControl>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button colorScheme='teal' mr={3} onClick={handleAddPrescription}>
                                                            Add
                                                        </Button>
                                                        <Button onClick={() => setIsAddingMedicine(false)}>Cancel</Button>
                                                    </ModalFooter>
                                                </ModalContent>
                                            </Modal>
                                        )}
                                        {listSelectedMedicines.length !== 0 ?
                                            <table className='table'>
                                                <thead>
                                                    <tr className='fw-bold'>
                                                        <td className="col-1">No</td>
                                                        <td className="col-3">Medical Name</td>
                                                        <td className="col-1">Unit</td>
                                                        <td className="col-1">Dosage</td>
                                                        <td className="col-2">Price</td>
                                                        <td className="col-1">Action</td>
                                                    </tr>

                                                </thead>
                                                <tbody>
                                                    {listSelectedMedicines.map((medicine, index) => (<>
                                                        <tr key={index} >
                                                            <td >{index + 1}</td>
                                                            <td >{medicine.name}</td>
                                                            <td >{medicine.unit}</td>
                                                            <td >
                                                                <NumberInput maxW={20} min={1} value={medicine.dosage} max={medicine.quantity}
                                                                    onChange={(e) => {
                                                                        setListSelectedMedicines((prev) =>
                                                                            prev.map((item, idx) =>
                                                                                idx === index ? { ...item, dosage: e } : item
                                                                            )
                                                                        )
                                                                    }
                                                                    }
                                                                >
                                                                    <NumberInputField />
                                                                    <NumberInputStepper>
                                                                        <NumberIncrementStepper />
                                                                        <NumberDecrementStepper />
                                                                    </NumberInputStepper>
                                                                </NumberInput>
                                                            </td>
                                                            <td >{medicine.price.toLocaleString('vi-VN')}/{medicine.unit}</td>

                                                            <td className='text-center'>
                                                                <span className='icon-container'>
                                                                    <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick = {() => handleDeleteMedicine(medicine)}/>
                                                                    <span className="icon-text">Delete</span>
                                                                </span>
                                                            </td>

                                                        </tr>

                                                        <th colSpan="4" className='fst-italic'>{medicine.frequency}</th></>
                                                    ))}
                                                    <tr>
                                                        <td className="col-1"></td>
                                                        <td className="col-3"></td>
                                                        <td className="col-1"></td>
                                                        <td className="col-1 fw-bold">Total:</td>
                                                        <td className='col-2'> {listSelectedMedicines.reduce((total, medicine) => total + (medicine.dosage * medicine.price), 0).toLocaleString('vi-VN')} VND</td>

                                                    </tr>
                                                </tbody>


                                            </table> : <></>

                                        }
                                        <FormControl mt={4}>
                                            <FormLabel>Note</FormLabel>
                                            <Input placeholder='Note' className='fst-italic ' onChange={(value) => setMedicalRecord((prev) => ({ ...prev, vetNote: value.target.value }))} />
                                        </FormControl>

                                    </ModalBody>

                                    <ModalFooter>
                                        <Button colorScheme='teal' mr={3} onClick={callAPI}>
                                            Save
                                        </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>


                            <Accordion defaultIndex={[0]} allowMultiple>
                                {medicalRecords.map((medicalRecord, index) => (
                                    <AccordionItem key={index}>
                                        <h2>
                                            <AccordionButton className='rounded fst-italic fw-bold' _hover={{ background: '#95D2B3', color: '#F9F9F9' }}>
                                                <Box as='span' flex='1' textAlign='left'>
                                                    {new Date(medicalRecord.date).toLocaleString("en-GB", { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4} >
                                            <div pb={6} className='p-5 shadow' style={{background: ''}}>
                                        
                                            <div className='d-flex align-items-center'><img src="assets/logoPetCare.png" alt="Logo" className="logo rounded-circle" /> <b>Pet Health Care</b></div>

                                                <FormControl mt={4} className='d-flex'>
                                                    <FormLabel className='w-50'>Pet's owner  <Input ref={initialRef} value={pet?.owner?.fullName} /></FormLabel>
                                                    <FormLabel className='w-50'>Phone number <Input value={pet?.owner?.phoneNumber} /></FormLabel>
                                                    <FormLabel className='w-50'>Date <Input value={new Date(medicalRecord.date).toLocaleDateString("en-GB")} /></FormLabel>
                                                </FormControl>
                                                <FormControl className='d-flex'>
                                                    <FormLabel className='w-50'>Pet's name <Input ref={initialRef} value={pet.name} /></FormLabel>
                                                    <FormLabel className='w-50'>Pet's type <Input value={pet.petType} /></FormLabel>
                                                </FormControl>
                                                <FormControl className='d-flex justify-content-between'>
                                                    <FormLabel>Pet's breed <Input ref={initialRef} value={pet.breed} /></FormLabel>
                                                    <FormLabel>Pet's sex <Input value={pet.gender} /></FormLabel>
                                                    <FormLabel>Pet's age <Input value={pet.age + " month(s)"} /></FormLabel>
                                                </FormControl>
                                                <FormControl  >
                                                    <FormLabel>Diagnosis <Input ref={initialRef} placeholder='Diagnosis'className='fst-italic' value={medicalRecord.diagnosis} /></FormLabel>
                                                </FormControl>
                                                <FormControl  >
                                                    <FormLabel>Treatment <Input ref={initialRef} placeholder='Treatment' className='fst-italic' value={medicalRecord.treatment} /></FormLabel>
                                                </FormControl>
                                                {medicalRecord.prescriptions.length !== 0 ?
                                                    <table className='table'>
                                                        <thead>
                                                            <tr className='fw-bold'>
                                                                <td>No</td>
                                                                <td>Medical Name</td>
                                                                <td>Unit</td>
                                                                <td>Dosage</td>
                                                                <td>Price</td>

                                                            </tr>

                                                        </thead>
                                                        <tbody>
                                                            {medicalRecord.prescriptions.map((prescription, index) => (<>
                                                                <tr key={index} >
                                                                    <td className="col-1">{index + 1}</td>
                                                                    <td className="col-3">{prescription.medicine?.name}</td>
                                                                    <td className="col-1">{prescription.medicine?.unit}</td>
                                                                    <td className="col-1">{prescription.dosage}</td>
                                                                    <td className="col-1">{prescription.medicine?.price.toLocaleString('vi-VN')}/{prescription.medicine?.unit}</td>
                                                                </tr>

                                                                <th colSpan="4" className='fst-italic'>{prescription.frequency}</th></>
                                                            ))}
                                                            <tr>
                                                                <td className="col-1"></td>
                                                                <td className="col-3"></td>
                                                                <td className="col-1"></td>
                                                                <td className="col-1 fw-bold">Total:</td>
                                                                <td className='col-2'> {medicalRecord.totalAmount.toLocaleString('vi-VN')} VND</td>
                                                            </tr>
                                                        </tbody>


                                                    </table> : <></>}
                                                <FormControl mt={4}>
                                                    <FormLabel>Note</FormLabel>
                                                    <Input className='fst-italic' value={medicalRecord.vetNote} />
                                                </FormControl>


                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}

                            </Accordion>
                        </div >

                    </TabPanel >


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
                    </TabPanel >
                </TabPanels >

            </Tabs>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className=''>

            </div>
        </div >
    )
}
