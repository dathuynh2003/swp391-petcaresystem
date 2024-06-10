import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import RadioCard from '../components/Radio';
import { LIST_BREED, URL } from '../utils/constant';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Menu, MenuButton, MenuList, MenuItemOption, MenuOptionGroup, Button } from '@chakra-ui/react';
export default function EditPet() {
  const { petId } = useParams();
  let navigate = useNavigate();

  const [pet, setPet] = useState({
    name: '',
    gender: '',
    breed: '',
    age: 1,
    petType: '',
    avatar: '',
    isNeutered: '',
    description: '',
  });

  const { name, gender, breed, age, petType, avatar, isNeutered, description } = pet;

  const loadPet = async () => {
    const response = await axios.get(`${URL}/pet/${petId}`);
    console.log(response.data);
    setPet(response.data);
  };
  useEffect(() => {
    loadPet();
  }, []);

  const callAPI = async () => {
    try {
      const request = { ...pet };

      console.log(request);
      const response = await axios.put(`${URL}/pet/${petId}`, request);

      console.log(response.data);
      toast.success('Edit Pet successfully', 2000);
      setTimeout(() => {
        navigate('/listPets');
      }, 2000);
      setPet(response.data);

      // navigate('/listPets');
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const [listBreed, setListBreed] = useState([]);

  const handleList = (select) => {
    setListBreed(LIST_BREED[select]);
    setPet((prev) => ({ ...prev, petType: select }));
  };

  const handleSelect = (select) => {
    setPet((prev) => ({ ...prev, breed: select }));
  };

  return (
    <div>
      <div className="container">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit Pet's Information</h2>
          {/* <form > */}

          <div className="form-floating mb-3">
            <input
              value={name}
              onChange={(e) => {
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
            <RadioCard options={['Dog', 'Cat', 'Bird']} onChange={handleList} value={petType}></RadioCard>

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

          <div className="age mb-3 ">
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
          </div>

          <div className="form-floating mb-3">
            <input
              value={description}
              onChange={(e) => {
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
            <button className="btn btn-outline-primary" onClick={() => callAPI()}>
              Save
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/listpets">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
