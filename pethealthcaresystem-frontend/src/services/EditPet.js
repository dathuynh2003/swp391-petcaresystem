import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import RadioCard from '../components/Radio';
import { LIST_BREED, URL } from '../utils/constant';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Menu, MenuButton, MenuList, MenuItemOption, MenuOptionGroup, Button } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

export default function EditPet() {
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    }
    const roleId = localStorage.getItem('roleId');
    if (roleId === 3 || roleId === 4) {
      navigate('/404page');
    }
  }, []);

  const { petId } = useParams();

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
  });

  const [avatarFile, setAvatarFile] = useState(null);

  const { name, gender, breed, age, petType, avatar, isNeutered, description } = pet;

  const loadPet = async () => {
    const response = await axios.get(`${URL}/pet/${petId}`);
    //hospitalizations, bookings, medicalRecords là những dữ liệu getPet trả về nhưng k cần thiết trong trường hợp này
    //set về rỗng để tránh bị lỗi k cần thiết
    response.data.hospitalizations = []
    response.data.bookings = []
    response.data.medicalRecords = []
    // console.log(response.data);
    setPet(response.data);
  };

  useEffect(() => {
    loadPet();
    fetchPetType();
  }, []);

  const callAPI = async () => {
    try {
      const request = { ...pet };
      console.log("request:", request);
      const response = await axios.put(`${URL}/pet/${petId}`, request);

      console.log("response:", response.data);
      toast.success('Edit Pet successfully', 2000);
      setTimeout(() => {
        navigate('/listPets');
      }, 2000);
      setPet(response.data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please upload an image.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size exceeds the 10MB limit.');
        return;
      }

      try {
        const uploadResponse = await axios.put(`${URL}/pet/${petId}/upload-avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPet((prev) => ({ ...prev, avatar: uploadResponse.data.avatar }));
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error('Error uploading avatar.');
      }
    }
  };

  const [listBreed, setListBreed] = useState([]);

  const handleList = (select) => {
    const breedList = LIST_BREED[select] || LIST_BREED.Other; // Lấy danh sách breed, nếu không có thì trả về danh sách 'Other'
    setListBreed(breedList);
    setPet((prev) => ({ ...prev, petType: select }));
  };

  const handleSelect = (select) => {
    setPet((prev) => ({ ...prev, breed: select }));
  };

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

  return (
    <div>
      <div className="container">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <div className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', position: 'relative' }}>
            {avatar && (
              <div style={{ position: 'relative' }}>
                <img src={pet.avatar} alt={pet.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '0', right: '0', cursor: 'pointer', backgroundColor: 'white', borderRadius: '50%', padding: '5px' }}>
                  <label htmlFor="avatar" style={{ cursor: 'pointer', color: '#000' }}>
                    <EditIcon />
                  </label>
                </div>
              </div>
            )}
            <input type="file" id="avatar" style={{ display: 'none' }} onChange={handleFileChange} />
            <h2 className="text-center m-4">Edit Pet's Information</h2>
          </div>

          <div className="form-floating mb-3">
            <input
              value={name}
              onChange={(e) => {
                const inputName = e.target.value

                if (inputName > 25) {
                  toast.info("Maximum 25 characters.");
                  return;
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
            {/* <RadioCard options={['Dog', 'Cat', 'Bird']} onChange={handleList} value={petType}></RadioCard> */}
            <div className='w-50'>
              <Select placeholder='Choose pet type' onChange={(e) => handleList(e.target.value)} value={pet.petType}>
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
                  <MenuOptionGroup value={breed} onChange={handleSelect} type="radio">
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
              <p className="">Sex</p>
              <RadioCard
                options={['Male', 'Female']}
                bg={'green'}
                value={gender}
                onChange={(value) => {
                  setPet((prev) => ({ ...prev, gender: value }));
                }}
              ></RadioCard>
            </div>

            <div className="form-check form-switch">
              <input
                checked={pet.isNeutered}
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
              defaultValue={pet?.dob}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const currentDate = new Date();

                // Kiểm tra xem ngày được chọn có lớn hơn ngày hiện tại không
                if (selectedDate > currentDate) {
                  toast.info("Please select a valid date of birth.");
                  return; // Ngăn người dùng tiếp tục
                }

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
              value={age}
              onChange={(value) => setPet((prev) => ({ ...prev, age: value }))}
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
              value={description}
              onChange={(e) => {
                const inputDescription = e.target.value

                if (inputDescription > 255) {
                  toast.info("Maximum 255 characters.");
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
            <Button style={{ background: 'teal', color: 'white' }} onClick={() => callAPI()}>
              Save
            </Button>
            <Link className="btn btn-outline-danger mx-2" to="/listpets">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
