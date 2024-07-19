import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Tab, TabList, Tabs, TabPanel, TabPanels, Button, Textarea, Avatar, Image } from '@chakra-ui/react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import {
    Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box,
    useDisclosure, Input, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, FormLabel
} from '@chakra-ui/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckCircleIcon, SearchIcon } from '@chakra-ui/icons';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { URL } from '../utils/constant';

export default function ViewPet() {
    let navigate = useNavigate();
    //Nhận booking từ VetWorkSchedule gửi qua để khi bác sĩ cập nhật medicalRecord xong thì kết thúc quá trình khám
    const { booking } = useLocation().state || {};
    const [completedBooking, setCompletedBooking] = useState(booking);

    const roleId = localStorage.getItem('roleId')
    const [hospitalizations, setHospitalizations] = useState()

    const [pet, setPet] = useState(
        {
            name: "",
            gender: "",
            breed: "",
            dob: null,
            petType: "",
            avatar: "",
            isNeutered: "",
            description: ""
        }
    )

    const { petId } = useParams();
    const loadPet = async () => {
        const response = await axios.get(`${URL}/pet/${petId}`, { withCredentials: true })
        console.log(response.data)
        setPet(response.data)
        setMedicalRecord((prev) => ({ ...prev, pet: response.data }))
        setHospitalizations(response.data.hospitalizations)
    }

    const handleHospitalize = async () => {
        if (chooseCage === '') {
            toast.warning("Please select the cage for admission")
            return
        }
        try {
            const response = await axios.post(`${URL}/admit/pet/${petId}/cage/${chooseCage}`, {}, { withCredentials: true })
            if (response.data.message === 'Admitted pet successfully') {
                // setHospitalization(response.data.hospitalization)
                toast.success(response.data.message);
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                toast.warning(response.data.message)
                // console.log(response.data.message)
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
            const response = await axios.put(`${URL}/discharged/${hospitalizationId}`, {}, { withCredentials: true })
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

    const [isAddingMedicine, setIsAddingMedicine] = useState(false); //giao diện thêm thuốc
    const initialRef1 = React.useRef(null);

    const [listMedicineBySearch, setListMedicineBySearch] = useState([])
    const [keyword, setKeyWord] = useState()

    const loadMedicineBySearch = async () => {
        if (keyword) {
            const response = await axios.get(`${URL}/medicine/searchByName/${keyword}`, { withCredentials: true });
            setListMedicineBySearch(response.data.MEDICINES);

        }

    }

    useEffect(() => {

        loadMedicineBySearch()
        // console.log(typeof (keyword));
        // console.log(listMedicineBySearch);

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
    // console.log(prescription);
    // console.log("list chọn");
    // console.log(listSelectedMedicines);
    const [displayMapMedicine, setDisplayMapMedicine] = useState(false)
    const [medicalRecord, setMedicalRecord] = useState({
        pet: {},
        diagnosis: '',
        treatment: '',
        vetNote: ''
    })


    const handleAddPrescription = () => {
        //tìm coi có trùng không
        const isDuplicate = listSelectedMedicines.some(item => item.medicine_id === prescription.medicine_id)
        if (isDuplicate) {
            toast.error("Duplicate medicine!")
            return
        }
        setListSelectedMedicines(prev => [...prev, prescription]);

    };



    // const medicalRecordRequest = {

    //     medicalRecord: medicalRecord,
    //     listPrescriptions: listSelectedMedicines
    // };
    const medicalRecordRequest = {
        medicalRecord: {
            diagnosis: medicalRecord?.diagnosis,
            treatment: medicalRecord?.treatment,
            vetNote: medicalRecord?.vetNote
        },
        listPrescriptions: listSelectedMedicines.map(prescription => ({
            dosage: prescription?.dosage,
            frequency: prescription?.frequency,
            unit: prescription?.unit,
            price: prescription?.price,
            medicine: {
                id: prescription?.medicine_id
            }
        }))
    };

    const callAPI = async () => {
        if (new Date(completedBooking.reVisitDate) < new Date(minDate)) {
            toast.warn("Revist Date invalid")
            return
        }
        // console.log(medicalRecordRequest);
        // console.log(JSON.stringify(medicalRecordRequest, null, 2))
        try {
            setCompletedBooking({ ...completedBooking, status: "DONE" })
            // console.log(medicalRecordRequest)
            if (medicalRecord?.diagnosis || medicalRecord?.treatment) {
                // console.log(medicalRecordRequest)
                // console.log(petId)
                const response = await axios.post(`${URL}/medicalRecord/add/${petId}`, medicalRecordRequest, { withCredentials: true });
                // console.log(response.data.MedicalRecord);
                if (response.data.MedicalRecord === null || response.data.MedicalRecord === undefined) {
                    toast.error("Add new medical record failed!")

                } else {
                    console.log(completedBooking)
                    const result = await axios.put(`${URL}/finish-booking`, completedBooking, { withCredentials: true })
                    if (result.data.message === "successfully") {
                        onClose()
                        setMedicalRecord()
                        setListSelectedMedicines([])
                        setPrescription()
                        toast.success("Add new medical record successfully!")
                    } else {
                        toast.error(result.data.message)
                    }
                }

                loadMedicalRecord()
            }
            else {
                toast.error("Diagnosis and Treatment are required!")
            }

        } catch (error) {
            // console.log(error.message);
            navigate('/404page')
        }
    }

    const [medicalRecords, setMedicalRecords] = useState([])
    const loadMedicalRecord = async () => {
        const response = await axios.get(`${URL}/medicalRecord/getById/${petId}`, { withCredentials: true })
        // console.log(response.data);
        response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        setMedicalRecords(response.data)
    }

    const handleDeleteMedicine = (e) => {
        setListSelectedMedicines((prev) => (prev.filter(medicine => medicine.medicine_id !== e.medicine_id)))
        //lấy những thuốc mà có id khác thuốc đc chọn để xóa thui
    }
    const { isOpen: isOpenChooseCage, onOpen: onOpenChooseCage, onClose: onCloseChooseCage } = useDisclosure();
    const [chooseCage, setChooseCage] = useState('')
    const [cages, setCages] = useState()
    const loadAvailableCage = async () => {
        try {
            const response = await axios.get(`${URL}/cages/${pet?.petType}`, { withCredentials: true })
            if (response.data.message === 'Cage found') {
                setCages(response.data.cages)
                // console.log(response.data.cages)
            } else {
                // console.log(response.data.message)
            }
        }
        catch (e) {
            navigate('/404page')
        }
    }

    const { isOpen: isOpenUpdateHosp, onOpen: onOpenUpdateHosp, onClose: onCloseUpdateHosp } = useDisclosure();
    const hospitalizationDetail = {
        description: '',    //vet note
        dosage: 1,
        price: null,
        // hospitalization: 
        medicine: null
    }
    const [hospitalizationDetails, setHospitalizationDetails] = useState([])
    const addMedicine = (medicine) => {
        setHospitalizationDetails(prevHospDetails => {
            const medicineExists = prevHospDetails.some(hospDetail => hospDetail.medicine.id === medicine.id)
            if (!medicineExists) {
                const newHospDetail = {
                    ...hospitalizationDetail,
                    price: medicine.price,
                    medicine: medicine
                }
                return [...prevHospDetails, newHospDetail]
            }
            return prevHospDetails;
        })

    };
    const updateHospDetail = (index, field, value) => {
        setHospitalizationDetails(prevDetails =>
            prevDetails.map((detail, i) =>
                i === index ? { ...detail, dosage: value } : detail
            )
        )
    }
    const [vetNote, setVetNote] = useState('')
    const saveVetNoteToHospitalizationDetails = (e) => {
        setVetNote(e.target.value)
        const vetNote = e.target.value
        const hospDetails = hospitalizationDetails?.map(detail => ({
            ...detail, description: vetNote
        }))
        setHospitalizationDetails(hospDetails);
    }

    const updateAdmissionInfo = async (hospId) => {
        try {
            const respone = await axios.post(`${URL}/hospitalization/update/${hospId}`, hospitalizationDetails, { withCredentials: true })
            if (respone.data.message === "Successfully") {
                loadPet();
                setHospitalizationDetails([]);
                toast.success("Hospitalization information has been updated")
            } else {
                toast.warning(respone.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }
    const updateAdmissionInfoWithoutMedicine = async (hospId, vetNote) => {
        try {
            if (vetNote.length === 0) {
                toast.info("Please fill in care information")
                return
            }
            const respone = await axios.post(`${URL}/hospitalization/update/${hospId}/note/${vetNote}`, {}, { withCredentials: true })
            if (respone.data.message === "Successfully") {
                loadPet();
                setHospitalizationDetails([]);
                toast.success("Hospitalization information has been updated")
            } else {
                toast.warning(respone.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    // Nhóm các hospitalizationDetails theo thuộc tính time
    const groupByTime = (hospDetails) => {
        return hospDetails.reduce((time, hospDetail) => {
            if (!time[hospDetail.time]) {
                time[hospDetail.time] = [];
            }
            time[hospDetail.time].push(hospDetail);
            return time;
        }, {});
    };
    let amountHosp = null
    const handleHospPayment = async (hospitalization) => {
        const payment =
        {
            paymentType: "Credit Card",
            amount: amountHosp
        }

        try {
            const response = await axios.post(`${URL}/generate-payment/hospitalization/${hospitalization.id}`, payment, { withCredentials: true });
            if (response.data.result.desc === 'success') {
                const checkoutURL = response.data.result.data.checkoutUrl
                window.location.href = checkoutURL
            } else {
                toast.warning("Cannot generate payment")
            }
        } catch (e) {
            toast.error(e.message)
        }
    }
    function useQuery() {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }
    const location = useLocation();
    let query = useQuery();
    let status = query.get("status");
    let orderCode = query.get("orderCode");

    useEffect(() => {
        const handleHospPaymentUpdate = async () => {
            try {
                if (status === 'CANCELLED') {
                    const petId = location.pathname.split('/').pop(); //Lấy petId từ URL
                    navigate(`/viewPet/${petId}`)//Navigate lại để ẩn thông tin trả về của PayOs
                    toast.info("Payment failed");
                }
                if (status === "PAID") {
                    // console.log("status: " + status);
                    const paymentType = "Credit Card"
                    const response = await axios.put(`${URL}/update-payment/${orderCode}`, { paymentType, status }, { withCredentials: true });
                    if (response.data.message === 'Payment updated successfully') {
                        const petId = location.pathname.split('/').pop(); //Lấy petId từ URL
                        navigate(`/viewPet/${petId}`)//Navigate lại để ẩn thông tin trả về của PayOs
                        toast.success("Payment successfully");
                    }
                }
            } catch (error) {
                console.error('Error updating payment:', error);
                toast.error('Error updating payment');
            }
        };

        if (status && orderCode) {
            handleHospPaymentUpdate();
        }

    }, [status, orderCode]); // Đặt dependency là status để useEffect chạy lại khi status thay đổi


    const handleMedicalPayment = async (medicalRecord) => {
        try {
            const payment = {
                paymentType: 'Credit card',
                amount: medicalRecord.totalAmount
            }
            // console.log(payment);
            const response = await axios.post(`${URL}/generate-payment/medicalRecord/${medicalRecord.id}`, payment, { withCredentials: true });
            if (response.data.result.desc === 'success') {
                const checkoutURL = response.data.result.data.checkoutUrl
                // console.log(checkoutURL);
                window.location.href = checkoutURL
            } else {
                // console.log(response.data);
                toast.warning("Cannot generate payment")
            }
        } catch (error) {
            toast.error(error)
        }
    }

    //Tính tuổi của pet dựa vào dob (đơn vị month(s))
    const today = new Date();
    const dob = new Date(pet.dob);
    const diffMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
    const age = diffMonths !== 0 ? diffMonths : 1;

    //Tính ngày nhỏ nhất để tái khái
    const minDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0]
    //xử lí nút bấm xem tiền dự kiến
    const [isDisplayCost, setIsDisplayCost] = useState(false)

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
                                            value={age}
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
                                        <Link
                                            className='btn btn-warning col-md-12'
                                            onClick={() => {
                                                handleHospPayment(hospitalizations
                                                    .find(hospitalization => hospitalization.status === "pending"))
                                            }}
                                        >
                                            Payment
                                        </Link>
                                    ) : (
                                        <Link to="/listPets"><Button className='col-md-12' style={{ background: 'teal', color: 'white' }}>Back</Button></Link>
                                    )
                                )}
                                {roleId === '3' && (
                                    pet?.hospitalizations?.some(admitPet => admitPet?.status === "admitted") ? (
                                        <Link
                                            className='btn btn-danger col-md-12'
                                            onClick={() => handleDischarge(hospitalizations
                                                .find(hospitalization => hospitalization.status === "admitted").id)}
                                        >
                                            Discharge
                                        </Link>
                                    ) : (
                                        pet?.hospitalizations?.some(admitPet => admitPet?.status === "pending") ? (
                                            <Link
                                                className='btn btn-warning col-md-12'
                                            >
                                                Waiting Payment
                                            </Link>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => { onOpenChooseCage(); loadAvailableCage() }}
                                                    className='mb-3 btn btn-success col-12'
                                                >
                                                    Requires Hospitalization
                                                </button>
                                                <Modal isOpen={isOpenChooseCage} onClose={onCloseChooseCage} size={'3xl'} >
                                                    <ModalOverlay />
                                                    <ModalContent>
                                                        <ModalHeader className='text-center'>Pet's hospitalization requirements</ModalHeader>
                                                        <ModalCloseButton />
                                                        <ModalBody>
                                                            <FormControl mt={4} className='d-flex'>
                                                                <FormLabel className='w-50'>
                                                                    Pet's owner
                                                                    <Input readOnly ref={initialRef} value={pet?.owner?.fullName} />
                                                                </FormLabel>
                                                                <FormLabel className='w-50'>
                                                                    Phone number
                                                                    <Input readOnly value={pet?.owner?.phoneNumber} />
                                                                </FormLabel>
                                                            </FormControl>
                                                            <FormControl className='d-flex'>
                                                                <FormLabel className='w-50'>
                                                                    Pet's name
                                                                    <Input readOnly ref={initialRef} value={pet.name} />
                                                                </FormLabel>
                                                                <FormLabel className='w-50'>
                                                                    Pet's type
                                                                    <Input readOnly value={pet.petType} />
                                                                </FormLabel>
                                                            </FormControl>
                                                            <FormControl className='d-flex justify-content-between'>
                                                                <FormLabel>Pet's breed <Input readOnly ref={initialRef} value={pet.breed} /></FormLabel>
                                                                <FormLabel>Pet's sex <Input readOnly value={pet.gender} /></FormLabel>
                                                                <FormLabel>Pet's age <Input readOnly value={age + " Month(s)"} /></FormLabel>
                                                            </FormControl>
                                                            <FormControl className='d-flex'>
                                                                <FormLabel className='w-100'>
                                                                    <Input readOnly value="Cage Available" className='text-center fw-bold' />
                                                                </FormLabel>
                                                            </FormControl>
                                                            <FormControl className='row'>
                                                                {cages?.map((cage, index) => (
                                                                    <FormLabel className='w-75 mx-auto' onClick={() => setChooseCage(cage?.id)}>
                                                                        <div className='border d-flex justify-content-between align-items-center fw-normal rounded'>
                                                                            <div className='w-75'>
                                                                                <div className='d-flex justify-content-start mx-3'>
                                                                                    <span className='mx-3 w-25'>Cage: {cage?.name}</span>
                                                                                    <span className='text-warning mx-5 w-50'>{cage?.price.toLocaleString('vi-VN')} VND/hour</span>
                                                                                </div>
                                                                                <div className='d-flex justify-content-start mx-3'>
                                                                                    <span className='mx-3 w-25'>Size: {cage?.size}</span>
                                                                                    <span className='mx-5 w-50'>Reserved for: {cage?.type}</span>
                                                                                </div>
                                                                            </div>
                                                                            {cage?.id === chooseCage &&
                                                                                <CheckCircleIcon color={'green'} style={{ width: '40px', height: '40px' }} className='mx-4' />
                                                                            }
                                                                        </div>
                                                                    </FormLabel>
                                                                ))}
                                                            </FormControl>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button colorScheme="red" mr={3} onClick={() => onCloseChooseCage()}>
                                                                Close
                                                            </Button>
                                                            <Button colorScheme="green" onClick={() => { onCloseChooseCage(); handleHospitalize() }}>
                                                                Hospitalize
                                                            </Button>
                                                        </ModalFooter>
                                                    </ModalContent>

                                                </Modal>
                                            </>
                                        )
                                    )
                                )}
                            </div >


                        </div >
                    </TabPanel >


                    <TabPanel>
                        <div className='container'>
                            {(roleId === '3' && completedBooking.status !== "DONE") ?
                                <Button onClick={onOpen} colorScheme='teal' className='mb-3'>Add new medical record</Button> : <></>
                            }
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
                                            <FormLabel>Pet's age <Input value={age + " month(s)"} /></FormLabel>
                                        </FormControl>
                                        <FormControl  >
                                            <FormLabel>
                                                Diagnosis
                                                <Input
                                                    ref={initialRef}
                                                    placeholder='Diagnosis'
                                                    onChange={(value) => (setMedicalRecord((prev) => ({ ...prev, diagnosis: value.target.value })))}
                                                />
                                            </FormLabel>
                                        </FormControl>
                                        <FormControl  >
                                            <FormLabel>
                                                Treatment
                                                <Input
                                                    ref={initialRef}
                                                    placeholder='Treatment'
                                                    onChange={(value) => (setMedicalRecord((prev) => ({ ...prev, treatment: value.target.value })))}
                                                />
                                            </FormLabel>
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
                                                            <div className='d-flex gap-1'>
                                                                <Input placeholder='Search medicine'
                                                                    onChange={(e) => setKeyWord(e.target.value)}
                                                                    onClick={() => setDisplayMapMedicine(false)}
                                                                />
                                                                <SearchIcon boxSize={'1.5rem'} className='mt-2 ml-2' />
                                                            </div>
                                                            {displayMapMedicine === false ?
                                                                <div style={{ maxHeight: '200px', overflow: "auto" }} >
                                                                    {listMedicineBySearch?.map((medicine, index) => (
                                                                        <p
                                                                            key={index}
                                                                            className="form-control "
                                                                            onClick={() => {
                                                                                setPrescription(prev => ({
                                                                                    ...prev,
                                                                                    medicine: medicine, unit: medicine.unit, price: medicine.price,
                                                                                    name: medicine.name, medicine_id: medicine.id, quantity: medicine.quantity
                                                                                }));
                                                                                setDisplayMapMedicine(true)
                                                                            }
                                                                            }
                                                                        >
                                                                            {medicine.name}
                                                                        </p>

                                                                    ))}
                                                                </div> : <></>}

                                                            <FormLabel>Name<Input value={prescription?.name} readOnly /></FormLabel>
                                                        </FormControl>
                                                        <FormControl>

                                                        </FormControl>
                                                        <FormControl>
                                                            <FormLabel>Dosage</FormLabel>
                                                            <NumberInput
                                                                defaultValue={1}
                                                                min={1} max={prescription?.medicine.quantity}
                                                                onChange={(value) => setPrescription((prev) => ({ ...prev, dosage: value }))}
                                                            >
                                                                <NumberInputField />
                                                                <NumberInputStepper>
                                                                    <NumberIncrementStepper />
                                                                    <NumberDecrementStepper />
                                                                </NumberInputStepper>
                                                            </NumberInput>
                                                        </FormControl>
                                                        <FormControl mt={4}>
                                                            <FormLabel>Frequency</FormLabel>
                                                            <Input
                                                                placeholder='Frequency'
                                                                onChange={(value) => setPrescription((prev) => ({ ...prev, frequency: value.target.value }))}
                                                            />
                                                        </FormControl>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button colorScheme='teal' mr={3} onClick={handleAddPrescription}>
                                                            Add
                                                        </Button>
                                                        <Button onClick={() => setIsAddingMedicine(false)}>Cancel</Button>
                                                        {/* giao diện thêm thuốc */}
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
                                                        <td className="col-2">Price per unit</td>
                                                        <td className="col-1">Action</td>
                                                    </tr>

                                                </thead>
                                                <tbody>
                                                    {listSelectedMedicines?.map((medicine, index) => (<>
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
                                                            <td >{medicine.price.toLocaleString('vi-VN')} VND</td>

                                                            <td className='text-center'>
                                                                <span className='icon-container'>
                                                                    <DeleteIcon
                                                                        style={{ color: 'red', cursor: 'pointer' }}
                                                                        onClick={() => handleDeleteMedicine(medicine)}
                                                                    />
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
                                                        <td className='col-2'>
                                                            {listSelectedMedicines.reduce((total, medicine) => total + (medicine.dosage * medicine.price), 0)
                                                                .toLocaleString('vi-VN')} VND
                                                        </td>

                                                    </tr>
                                                </tbody>


                                            </table> : <></>

                                        }
                                        <FormControl mt={4}>
                                            <FormLabel>Revist Date</FormLabel>
                                            <Input type='date' min={minDate}
                                                onChange={(e) => setCompletedBooking((prev) => ({
                                                    ...prev, reVisitDate: e.target.value
                                                }))}
                                            />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Note</FormLabel>
                                            <Input
                                                placeholder='Note'
                                                className='fst-italic '
                                                onChange={(value) => setMedicalRecord((prev) => ({ ...prev, vetNote: value.target.value }))}
                                            />
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
                                                    {new Date(medicalRecord.date)
                                                        .toLocaleString("en-GB", { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4} >
                                            <div pb={6} className='p-5 shadow' style={{ background: '' }}>

                                                <div className=''>

                                                    <div className='d-flex align-items-center justify-content-between text-center'>
                                                        <div className='d-flex gap-1'>
                                                            <Image src="../logoApp.svg" alt="Logo" className='logo' /> Pet Health Care
                                                        </div>
                                                        <div>
                                                            {roleId === '1' ? (
                                                                <Button
                                                                    colorScheme={medicalRecord.isPaid === true ? 'teal' : 'pink'}
                                                                    onClick={medicalRecord.isPaid === false ? () => handleMedicalPayment(medicalRecord) : null}
                                                                    style={{
                                                                        color: 'white'
                                                                    }}

                                                                >
                                                                    {medicalRecord.isPaid === true ? 'Paid' : 'Payment'}
                                                                </Button>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <h4 className='d-flex justify-content-center align-items-center text-center gap-3' style={{ color: 'teal' }}><Avatar src={pet?.owner?.avatar}></Avatar>Customer's information</h4>
                                                <FormControl mt={4} mb={3} className='d-flex'>
                                                    <FormLabel className='w-50'>Pet's owner  <Input ref={initialRef} value={pet?.owner?.fullName} /></FormLabel>
                                                    <FormLabel className='w-50'>Phone number <Input value={pet?.owner?.phoneNumber} /></FormLabel>
                                                    <FormLabel className='w-50'>Date <Input value={new Date(medicalRecord.date).toLocaleDateString("en-GB")} /></FormLabel>
                                                </FormControl>
                                                <h4 className='d-flex justify-content-center align-items-center text-center gap-3' style={{ color: 'teal' }} ><Avatar src={pet.avatar}></Avatar>  Pet's information</h4>
                                                <FormControl className='d-flex'>
                                                    <FormLabel className='w-50'>Pet's name <Input ref={initialRef} value={pet.name} /></FormLabel>
                                                    <FormLabel className='w-50'>Pet's type <Input value={pet.petType} /></FormLabel>
                                                </FormControl>
                                                <FormControl className='d-flex justify-content-between'>
                                                    <FormLabel>Pet's breed <Input ref={initialRef} value={pet.breed} /></FormLabel>
                                                    <FormLabel>Pet's sex <Input value={pet.gender} /></FormLabel>
                                                    <FormLabel>Pet's age <Input value={age + " month(s)"} /></FormLabel>
                                                </FormControl>
                                                <FormControl  >
                                                    <FormLabel>
                                                        Diagnosis
                                                        <Input
                                                            ref={initialRef}
                                                            placeholder='Diagnosis'
                                                            className='fst-italic'
                                                            value={medicalRecord.diagnosis}
                                                        />
                                                    </FormLabel>
                                                </FormControl>
                                                <FormControl  >
                                                    <FormLabel>
                                                        Treatment
                                                        <Input
                                                            ref={initialRef}
                                                            placeholder='Treatment'
                                                            className='fst-italic'
                                                            value={medicalRecord.treatment}
                                                        />
                                                    </FormLabel>
                                                </FormControl>
                                                {medicalRecord.prescriptions.length !== 0 ?
                                                    <table className='table'>
                                                        <thead>
                                                            <tr className='fw-bold'>
                                                                <td>No</td>
                                                                <td>Medical Name</td>
                                                                <td>Unit</td>
                                                                <td>Dosage</td>
                                                                <td>Price per unit</td>

                                                            </tr>

                                                        </thead>
                                                        <tbody>
                                                            {medicalRecord.prescriptions.map((prescription, index) => (<>
                                                                <tr key={index} >
                                                                    <td className="col-1">{index + 1}</td>
                                                                    <td className="col-3">{prescription.medicine?.name}</td>
                                                                    <td className="col-1">{prescription.medicine?.unit}</td>
                                                                    <td className="col-1">{prescription.dosage}</td>
                                                                    <td className="col-1">
                                                                        {prescription.medicine?.price.toLocaleString('vi-VN')} VND
                                                                    </td>
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
                                                    <Input className='fst-italic' value={medicalRecord.vetNote} readOnly />
                                                </FormControl>


                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}

                            </Accordion>
                        </div >

                    </TabPanel >

                    <TabPanel>
                        <Accordion defaultIndex={[0]} allowMultiple>
                            {hospitalizations?.map((hospitalization, index) => {
                                const groupedHospDetails = groupByTime(hospitalization?.hospitalizationDetails);
                                // Chuyển Object groupedHospDetails thành mảng (Array) các nhóm hospDetails theo time
                                //Có dạng: groupedHospDetailsByTime[]: [ {time: '', details:[]} ]
                                const groupedHospDetailsByTime = Object.keys(groupedHospDetails).map(time => ({
                                    time,
                                    details: groupedHospDetails[time]
                                }));

                                // Chuyển đổi chuỗi thời gian thành đối tượng Date
                                const parseLocalDateTime = (localDateTime) => {
                                    if (!localDateTime) return null;  // Kiểm tra nếu localDateTime là null hoặc undefined
                                    const [day, month, yearAndTime] = localDateTime.split('/');
                                    const [year, time] = yearAndTime.split(' ');
                                    return new Date(`${year}-${month}-${day}T${time}`);
                                };


                                const admissionDate = parseLocalDateTime(hospitalization?.admissionTime);
                                const dischargeDate = parseLocalDateTime(hospitalization?.dischargeTime);


                                // Tính toán thời gian chênh lệch trong giờ
                                //Số ms chênh lệch / số ms trong 1h = số giờ
                                const timeDifference = Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60));
                                const hospFee = (timeDifference >= 0) ? timeDifference * hospitalization?.cage?.price : 0
                                const amount = (hospitalization?.hospitalizationDetails
                                    ?.reduce((accumulator, curDetail) => accumulator + (curDetail?.price * curDetail?.dosage), 0) + hospFee)
                                hospitalization?.status === 'pending' && (amountHosp = amount)

                                return (
                                    <AccordionItem key={index}>
                                        <h2>
                                            <AccordionButton className='rounded fst-italic fw-bold' _hover={{ background: '#95D2B3', color: '#F9F9F9' }}>
                                                <Box as='span' flex='1' textAlign='left'>
                                                    {hospitalization?.admissionTime}
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4} >
                                            <div className='px-5 pt-2 pb-5 shadow border border-dark'>
                                                {hospitalization?.status === 'admitted' &&
                                                    <FormControl className='d-flex justify-content-end'>
                                                        {roleId === '3' &&
                                                            <Button colorScheme="green" onClick={() => onOpenUpdateHosp()}>
                                                                Update
                                                            </Button>
                                                        }
                                                        <Modal isOpen={isOpenUpdateHosp} onClose={onCloseUpdateHosp} size={'3xl'}>
                                                            <ModalOverlay />
                                                            <ModalContent>
                                                                <ModalHeader className='text-center'>Update the hospitalization care process</ModalHeader>
                                                                <ModalCloseButton />
                                                                <ModalBody>
                                                                    <FormControl>
                                                                        <div className='d-flex gap-1'>
                                                                            <Input
                                                                                placeholder='Search medicine'
                                                                                onChange={(e) => setKeyWord(e.target.value)}
                                                                                onClick={() => setDisplayMapMedicine(false)}
                                                                            />
                                                                            <SearchIcon boxSize={'1.5rem'} className='mt-2 ml-2' />
                                                                        </div>
                                                                        {displayMapMedicine === false &&
                                                                            <div style={{ maxHeight: '200px', overflow: "auto" }} >
                                                                                {listMedicineBySearch?.map((medicine, index) => (
                                                                                    <p
                                                                                        key={index}
                                                                                        className="form-control "
                                                                                        onClick={() => {
                                                                                            addMedicine(medicine);
                                                                                            setDisplayMapMedicine(true)
                                                                                        }}>
                                                                                        {medicine.name}
                                                                                    </p>

                                                                                ))}
                                                                            </div>
                                                                        }
                                                                    </FormControl>
                                                                    {hospitalizationDetails?.length !== 0 &&
                                                                        <FormControl className='d-flex justify-content-between fw-bold mt-3 mb-1'>
                                                                            <div className='col-1'>No</div>
                                                                            <div className='col-4'>Medical Name</div>
                                                                            <div className='col-1 text-center'>Dosage</div>
                                                                            <div className='col-1'>Unit</div>
                                                                            <div className='col-2'>Amount</div>
                                                                        </FormControl>
                                                                    }
                                                                    {hospitalizationDetails?.map((hospitalizationDetail, index) => (
                                                                        <FormControl className='d-flex justify-content-between'>
                                                                            <div className='col-1'>{index + 1}</div>
                                                                            <div className='col-4'>{hospitalizationDetail?.medicine?.name}</div>
                                                                            <NumberInput
                                                                                defaultValue={1}
                                                                                min={1}
                                                                                max={hospitalizationDetail?.medicine?.quantity}
                                                                                value={hospitalizationDetail.dosage || 1}
                                                                                onChange={(value) => updateHospDetail(index, 'dossage', value)}
                                                                                className='col-1'
                                                                                width={'10%'}
                                                                            >
                                                                                <NumberInputField />
                                                                                <NumberInputStepper>
                                                                                    <NumberIncrementStepper />
                                                                                    <NumberDecrementStepper />
                                                                                </NumberInputStepper>
                                                                            </NumberInput>
                                                                            <div className='col-1'>{hospitalizationDetail?.medicine?.unit}</div>
                                                                            <div className='col-2'>
                                                                                {(hospitalizationDetail?.price * hospitalizationDetail.dosage)
                                                                                    .toLocaleString('vi-VN')} VND
                                                                            </div>
                                                                        </FormControl>
                                                                    ))}
                                                                    <FormControl className='d-flex justify-content-between my-3'>
                                                                        <div style={{ width: '13%' }}>
                                                                            Vet Note:
                                                                        </div>
                                                                        <Textarea
                                                                            onChange={saveVetNoteToHospitalizationDetails}
                                                                            placeholder="Enter vet note here"
                                                                            className='w-100'
                                                                        />
                                                                    </FormControl>
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                    <Button colorScheme="blue" mr={3} onClick={onCloseUpdateHosp}>
                                                                        Close
                                                                    </Button>
                                                                    <Button
                                                                        colorScheme="green"
                                                                        onClick={() => {
                                                                            onCloseUpdateHosp();
                                                                            hospitalizationDetails.length === 0 || hospitalizationDetails === null ?
                                                                                updateAdmissionInfoWithoutMedicine(hospitalization.id, vetNote)
                                                                                :
                                                                                updateAdmissionInfo(hospitalization.id)
                                                                        }}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </ModalFooter>
                                                            </ModalContent>
                                                        </Modal>
                                                    </FormControl>
                                                }
                                                {hospitalization.status === 'pending' &&
                                                    <FormControl className='d-flex justify-content-end'>
                                                        {roleId === '1' &&
                                                            <Button
                                                                colorScheme="yellow"
                                                                onClick={() => { handleHospPayment(hospitalization) }}
                                                            >
                                                                Payment
                                                            </Button>
                                                        }
                                                    </FormControl>
                                                }
                                                <FormControl mt={4} className='d-flex'>
                                                    <FormLabel className='w-50'>
                                                        Date
                                                        <Input
                                                            readOnly ref={initialRef}
                                                            value={hospitalization?.admissionTime
                                                                ?.split(' ')[0]}
                                                        />
                                                    </FormLabel>
                                                    <FormLabel className='w-50'>
                                                        Vet
                                                        <Input readOnly value={hospitalization?.user?.fullName} />
                                                    </FormLabel>
                                                </FormControl>
                                                <FormControl className='d-flex mt-0'>
                                                    <FormLabel className='w-50'>
                                                        Cage
                                                        <Input readOnly ref={initialRef} value={hospitalization?.cage?.name} />
                                                    </FormLabel>
                                                    <FormLabel className='w-50'>
                                                        Price(hour)
                                                        <Input readOnly value={hospitalization?.cage?.price.toLocaleString('vi-VN') + " VND"} />
                                                    </FormLabel>
                                                </FormControl>
                                                <FormControl className='d-flex mt-0'>
                                                    <FormLabel className='w-50'>
                                                        Admission Time
                                                        <Input
                                                            readOnly ref={initialRef}
                                                            value={hospitalization?.admissionTime
                                                                ?.split(' ')[1]}
                                                        />
                                                    </FormLabel>
                                                    <FormLabel className='w-50'>
                                                        Discharged Time
                                                        <Input
                                                            readOnly
                                                            value={hospitalization?.dischargeTime ? hospitalization.dischargeTime.split(' ')[1] : "N/A"}
                                                        />
                                                    </FormLabel>
                                                </FormControl>
                                                {(groupedHospDetailsByTime.length !== 0) &&
                                                    <FormControl
                                                        className='d-flex justify-content-between fw-bold mt-3 mb-1 border border-top-0 border-end-0 border-start-0'>
                                                        <div className='col-2'>Time</div>
                                                        <div className='col-3'>Medical Name</div>
                                                        <div className='col-1'>Unit</div>
                                                        <div className='col-1'>Price per unit</div>
                                                        <div className='col-1 text-center'>Dosage</div>
                                                        <div className='col-1'>Amount</div>
                                                    </FormControl>
                                                }
                                                {groupedHospDetailsByTime?.map((hospitalizationDetail) => (
                                                    <div className=''>
                                                        <FormControl className='d-flex justify-content-between mt-3 mb-1'>
                                                            <div className='col-2 fw-medium text-success'>{hospitalizationDetail.time.slice(0, -3)}</div>
                                                            <div className='col-3'>
                                                                {hospitalizationDetail?.details?.map((detail) => (
                                                                    <>
                                                                        {detail?.dosage !== 0 ?
                                                                            <div>{detail?.medicine?.name}</div> : ''
                                                                        }
                                                                    </>
                                                                ))}
                                                            </div>
                                                            <div className='col-1'>
                                                                {hospitalizationDetail?.details.map((detail, index) => (
                                                                    <>
                                                                        {detail?.dosage !== 0 ?
                                                                            <div>{detail?.medicine?.unit}</div> : ''
                                                                        }
                                                                    </>
                                                                ))}
                                                            </div>
                                                            <div className='col-1 text-center'>
                                                                {hospitalizationDetail?.details.map((detail, index) => (
                                                                    <>
                                                                        {detail?.dosage !== 0 ?
                                                                            <div>{detail?.price.toLocaleString('vi-VN')}</div> : ''
                                                                        }
                                                                    </>
                                                                ))}
                                                            </div>
                                                            <div className='col-1 text-center'>
                                                                {hospitalizationDetail?.details.map((detail, index) => (
                                                                    <>
                                                                        {detail?.dosage !== 0 ?
                                                                            <div>{detail?.dosage}</div> : ''
                                                                        }
                                                                    </>
                                                                ))}
                                                            </div>
                                                            <div className='col-1'>
                                                                {hospitalizationDetail?.details.map((detail, index) => (
                                                                    <>
                                                                        {detail?.dosage !== 0 ?
                                                                            <div>
                                                                                {(detail?.price * detail?.dosage).toLocaleString('vi-VN')}
                                                                            </div> : ''
                                                                        }

                                                                    </>
                                                                ))}
                                                            </div>
                                                        </FormControl>
                                                        <FormControl className='d-flex border border-top-0 border-end-0 border-start-0'>
                                                            <div
                                                                className='col-3 text-end fw-bold fst-italic text-decoration-underline'
                                                            >
                                                                Vet Note:
                                                            </div>
                                                            <div className='col-9 text-start mx-2 fw-medium fst-italic'>
                                                                {hospitalizationDetail?.details[0].description}
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                ))}
                                                <FormControl
                                                    className='d-flex mt-3 mb-1 rounded'
                                                    bg='gray.50'
                                                >
                                                    <div className='col-4'>
                                                        <div className='row'>
                                                            <span className='fw-bold col-6'>Admission Time:</span>
                                                            <span className='col-6'>{hospitalization?.admissionTime}</span>
                                                        </div>
                                                        <div className='row'>
                                                            <span className='fw-bold col-6'>Discharged Time:</span>
                                                            <span className='col-6'>
                                                                {hospitalization?.dischargeTime ? hospitalization?.dischargeTime : "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='col-1'></div>
                                                    <div className='fw-bold col-1 text-end my-auto'>Total Time: </div>
                                                    <div className='col-1 my-auto text-center'>{timeDifference > 0 ? timeDifference + " hour(s)" : "N/A"}</div>
                                                    <div className='col-1'></div>
                                                    <div className='col-2 fw-bold text-end my-auto'>Hospitalization fee: </div>
                                                    <div className='col-2 text-center my-auto mx-4'>
                                                        {hospFee > 0 ? hospFee.toLocaleString('vi-VN') : "Hospitalizing..."}
                                                    </div>
                                                </FormControl>
                                                <FormControl
                                                    className='d-flex fw-bold mt-3 mb-1 border border-top-0 border-end-0 border-start-0'
                                                >
                                                    <div className='col-2'></div>
                                                    <div className='col-3'></div>
                                                    <div className='col-1'></div>
                                                    <div className='col-1'></div>
                                                    <div className='col-1'></div>


                                                </FormControl>
                                                <div className='text-end mt-3'>
                                                    {
                                                        hospitalization.status !== 'Discharged' ? <Button colorScheme='pink' onClick={() => setIsDisplayCost(prev => !prev)}>Estimated Cost</Button> : ''

                                                    }
                                                    {
                                                        isDisplayCost || hospitalization.status === 'Discharged' ? <div className='mt-2'><b>Total: {' ' + amount.toLocaleString('vi-Vn')} VND </b><i>{hospitalization.status !== 'Discharged' ? '(Excuding hospitalization fee)' : ''}</i></div> : ''
                                                    }

                                                </div>

                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                )

                            })}
                        </Accordion>
                    </TabPanel >
                </TabPanels >

            </Tabs >
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
