import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import RadioCard from '../components/Radio';
import { LIST_BREED } from '../utils/constant';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Button,
} from '@chakra-ui/react';

export default function CreatePet() {
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


  const callAPI = async () => {
    try {
      const request = { ...pet };
      if (request.name === '' || request.petType === '' || request.gender === '') {
        toast.info("Please enter Pet's name, type, gender required");
        return;
      }
      console.log(request);
      const response = await axios.post('http://localhost:8080/pet', request, { withCredentials: true });
      console.log(response.data);
      toast.success('Add new pet successfully!', 2000);

      setTimeout(() => {
        navigate('/listPets');
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        alert(error.response.data.message); // Hiển thị thông điệp lỗi từ phía backend
      } else {
        console.error('Error calling API:', error);
      }
    }
  };

  const [listBreed, setListBreed] = useState([]);

  const handleList = async (select) => {
    setListBreed(LIST_BREED[select]);
    setPet((prev) => ({ ...prev, petType: select }));
  };

  const handleSelect = (select) => {
    setPet((prev) => ({ ...prev, breed: select }));
  };

  useEffect(() => {
    console.log(pet);
  }, [pet]);

  return (
    <div>
      <div className="container">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Add new Pet</h2>
          {/* <form > */}

          <div className="form-floating mb-3">
            <input
              value={pet?.name}
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
            <RadioCard options={['Dog', 'Cat', 'Bird']} onChange={handleList} value={pet.petType}></RadioCard>

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
              <p className="">Gender</p>
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

          <div className="age mb-3 ">
            <label className="mt-2 ml-4 mb-3" htmlFor="age">
              Age(Month)
            </label>
            <NumberInput
              step={1}
              defaultValue={1}
              min={1}
              max={50}
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
          </div>

          <div className="form-floating mb-3">
            <input
              value={pet?.description}
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

          {/* </form> */}
        </div>
      </div>
    </div>
  );
}
