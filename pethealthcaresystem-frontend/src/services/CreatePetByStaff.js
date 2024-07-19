import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    Input,
} from '@chakra-ui/react';
import RadioCard from '../components/Radio';
import { LIST_BREED } from '../utils/constant';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { URL } from '../utils/constant';
import { Menu, MenuButton, MenuList, MenuItemOption, MenuOptionGroup, Button } from '@chakra-ui/react';

export default function CreatePetByStaff() {
    let navigate = useNavigate();

    const [pet, setPet] = useState({
        name: '',
        gender: '',
        breed: '',
        // age: 1,
        dob: null,
        petType: '',
        avatar: '',
        isNeutered: '',
        description: '',
        owner: {
            phoneNumber: '',
            fullName: '',
            gender: ''
        }
    });

    const callAPI = async () => {
        try {
            const petRequest = { ...pet };
            if (petRequest.owner.fullName === '' || petRequest.name === '' || petRequest.petType === '' || petRequest.gender === '') {
                toast.info("Please enter required fields for both account and pet.");
                return;
            }
            // Kiểm tra xem ngày được chọn có lớn hơn ngày hiện tại không
            if (pet.dob > new Date().toISOString().split('T')[0]) {
                toast.info("Please select a valid date of birth.");
                return; // Ngăn người dùng tiếp tục
            }
            const response = await axios.post(`${URL}/createForAnonymous`, petRequest, { withCredentials: true });
            toast.success('Add new pet and account successfully!', 2000);

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            if (error.response) {
                console.error('Error response from server:', error.response.data);
                alert(error.response.data.message); // Display error message from backend
            } else {
                console.error('Error calling API:', error);
            }
        }
    };

    const [listBreed, setListBreed] = useState([]);

    const handleList = async (select) => {
        const breedList = LIST_BREED[select] || LIST_BREED.Other; // Lấy danh sách breed, nếu không có thì trả về danh sách 'Other'
        setListBreed(breedList);
        setPet((prev) => ({ ...prev, petType: select }));
    };

    const handleSelect = (select) => {
        setPet((prev) => ({ ...prev, breed: select }));
    };

    const handlePetInputChange = (e) => {
        const { name, value } = e.target;

        // Validation for customer's name
        if (name === 'fullName' && value.length > 25) {
            toast.info("Maximum 25 characters.");
            return;
        }

        if (name === 'phoneNumber') {
            const phoneRegex = /^((\+84|84|0)[3|5|7|8|9])+([0-9]{8})$/;
            if (value.length === 10 && !phoneRegex.test(value)) {
                toast.info("Please enter a valid Vietnamese phone number.");
                return;
            }
            // if (value.length === 11 && phoneRegex.index(0).test('0') && (phoneRegex.index(1).test('3') || phoneRegex.index(1).test('5') ||
            //     phoneRegex.index(1).test('7') || phoneRegex.index(1).test('8') || phoneRegex.index(1).test('9'))) {
            //     toast.info("Vietnamese phone number must be exactly 10 digits.");
            //     return;
            // }
        }

        setPet((prev) => ({
            ...prev,
            [name]: value,
            owner: {
                ...prev.owner,
                [name]: value
            }
        }));
    };

    useEffect(() => {
        console.log(pet);
    }, [pet]);

    const [petTypes, setPetTypes] = useState([])
    const fetchPetType = async () => {
        const configKey = "petType"
        try {
            const respone = await axios.get(`${URL}/configurations/${configKey}`, { withCredentials: true })
            if (respone.data.message === 'Successfully') {
                setPetTypes(respone.data.configurations)
            }
        } catch (e) {
            // console.log(e)
            navigate('/404page')
        }
    }

    useEffect(() => {
        fetchPetType()
    }, [])
    return (
        <div>
            <div className="container">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add new Pet for Customer</h2>

                    <div className="form-floating mb-3">
                        <input
                            value={pet.owner.fullName}
                            onChange={handlePetInputChange}
                            type="text"
                            className="form-control"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter Full Name"
                            required
                        />
                        <label htmlFor="fullName">Enter Customer's name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            value={pet.owner.phoneNumber}
                            onChange={handlePetInputChange}
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Enter Owner's Phone Number"
                            required
                        />
                        <label htmlFor="fullName">Enter Customer's phone number</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            value={pet?.name}
                            onChange={(e) => {
                                const inputName = e.target.value;

                                if (inputName.length > 25) {
                                    toast.info("Maximum 25 characters");
                                    return; // Ngăn người dùng tiếp tục
                                }

                                setPet((prev) => ({ ...prev, name: e.target.value }));
                            }}
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter Pet's name"
                            required
                        />
                        <label htmlFor="name">Enter Pet's name</label>
                    </div>

                    <div className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* <RadioCard options={['Dog', 'Cat', 'Bird']} onChange={handleList} value={pet.petType}></RadioCard> */}
                        <div className='w-50'>
                            <Select placeholder='Choose pet type' onChange={(e) => handleList(e.target.value)}>
                                {petTypes?.map((petType, index) => (
                                    <option key={index} value={petType.configValue}>{petType.configValue}</option>
                                ))}
                            </Select>
                        </div>
                        {listBreed.length === 0 ? (
                            <></>
                        ) : (
                            <Menu closeOnSelect={false}>
                                <MenuButton as={Button} colorScheme="pink">
                                    {pet.breed === '' ? 'Choose Breed' : pet.breed}
                                </MenuButton>
                                <MenuList maxH="200px" overflowY="auto">
                                    <MenuOptionGroup value={pet.breed} onChange={handleSelect} type="radio">
                                        {listBreed.map((breed, index) => (
                                            <MenuItemOption key={index} value={breed}>
                                                {breed}
                                            </MenuItemOption>
                                        ))}
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                        )}
                    </div>

                    <div className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            {/* <p className="">Sex</p> */}
                            <RadioCard
                                options={['Male', 'Female']}
                                bg={'green'}
                                onChange={(value) => {
                                    setPet((prev) => ({ ...prev, gender: value }));
                                }}
                            ></RadioCard>
                        </div>

                        <div className="form-check form-switch">
                            <input
                                value={pet.isNeutered}
                                onChange={(e) => setPet((prev) => ({ ...prev, isNeutered: e.target.checked }))}
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                required
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                Neutered (Spayed){' '}
                            </label>
                        </div>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="date"
                            className="form-control"
                            id="dob"
                            max={new Date().toISOString().split('T')[0]}
                            value={pet?.dob}
                            onChange={(e) => {
                                setPet((prev) => ({ ...prev, dob: e.target.value }));
                            }}
                        />
                        <label htmlFor="dob">Date of birth</label>
                    </div>
                    {/* <div className="age mb-3 ">
                        <label className="mt-2 ml-4 mb-3" htmlFor="age">
                            Age (month(s))
                        </label>
                        <NumberInput
                            step={1}
                            defaultValue={1}
                            min={1}
                            max={500}
                            onChange={(value) => {
                                setPet((prev) => ({ ...prev, age: value }));
                            }}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </div> */}

                    <div className="form-floating mb-3">
                        <input
                            value={pet?.description}
                            onChange={(e) => {
                                const inputDescription = e.target.value

                                if (inputDescription.length > 100) {
                                    toast.info("Maximum 100 characters.");
                                    return;
                                }

                                setPet((prev) => ({ ...prev, description: e.target.value }));
                            }}
                            type="text"
                            className="form-control"
                            id="description"
                            placeholder="Enter Pet's description"
                        />
                        <label htmlFor="description">Enter Pet's description</label>
                    </div>
                    <ToastContainer />
                    <div className="text-center">
                        <button className="btn btn-outline-primary" onClick={callAPI}>
                            Save
                        </button>

                        <Link className="btn btn-outline-danger mx-2" to="/create-anomyous-user">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
