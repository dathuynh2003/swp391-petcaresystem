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

  const handleOnClick = ((pet)=>{
    setSelectedPet(pet)
    setBooking({ ...booking, pet_id: pet?.petId, user_id: pet?.owner.userId })
    
    console.log(booking);
  })

  return (
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
            <ul className="list-group overflow-auto ">
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
            </ul>
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
  );
}
