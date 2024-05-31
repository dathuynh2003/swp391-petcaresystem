import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useRadioGroup, HStack,NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Avatar } from '@chakra-ui/react'
import RadioCard from '../components/Radio'
import {LIST_BREED} from '../utils/constant'
import axios from 'axios'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
    MenuItemOption,MenuOptionGroup, Button

  } from '@chakra-ui/react'
export default function CreatePet() {

    let navigate = useNavigate()

    const [pet, setPet] = useState(
        {
           name: "", 
           gender:"",
           breed:"",
           age:"",
           petType:"",
           avatar:"",
           isNeutered:"",
           description:""

        }
    )

    const [message, setMessage] = useState('');
   

    const callAPI = async () =>{
        try {
            const request = {...pet};
            if (request.name ==='' || request.petType ==='' || request.gender===''){
                alert('THIEU FIELD')    
                return
            }
            console.log(request);
            const response = await axios.post("http://localhost:8080/pet", request, {withCredentials: true});
            console.log(response.data);

            setMessage(response.data); 
            alert(message)
            navigate('/listPets')
        } catch (error) {
            console.error("Error calling API:", error);
        }
    }


    const [listBreed, setListBreed] = useState([])
  

    const handleList = async (select ) => {
        setListBreed(LIST_BREED[select])
        setPet(prev => ({...prev, petType:select}))
    }

    const handleSelect = (select) => {
        setPet(prev=>({...prev,breed:select}))
        
    }

    useEffect(()=>{
        console.log(pet);
    },[pet])

   

  return (
    <div>
      <div className='container'>
      <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Add new Pet</h2>
             {/* <form > */}

                <div className="form-floating mb-3">
                        <input 
                            value={pet?.name}
                            onChange={(e)=>{
                                setPet(prev=>({...prev,name:e.target.value}))
                            }}
                            type="text" className="form-control" id="name" placeholder="Enter Pet's name" required/>
                        <label for="name">Enter Pet's name</label>
                </div>

                    <div className='mb-3' style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>

                    <RadioCard options={['Dog','Cat','Bird']} onChange={handleList} value={pet.petType}></RadioCard>
               
                    {
                     listBreed.length === 0 ? <></>:                    
                                                    <Menu  closeOnSelect={false}  >
                                                        <MenuButton  as={Button} colorScheme='pink'>
                                                            {pet.breed === ''? 'Choose Breed' : pet.breed}
                                                        </MenuButton>
                                                        <MenuList maxH='200px' overflowY='auto' >
                                                            <MenuOptionGroup  value={pet.breed} onChange = {handleSelect} type='radio'>
                                                                {listBreed.map((breed, index) => (
                                                                    <MenuItemOption key={index} value={breed}>{breed}</MenuItemOption>
                                                                ))
                                                                    
                                                                }
                                                    
                                                            </MenuOptionGroup>
                                                        </MenuList>
                                                    </Menu> 
                     }
              
                    </div>

                     <div className='mb-3' style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                        <div >
                            <p className=''>Gender</p>
                            <RadioCard options={['Male','Female']} bg={'green'}  onChange={(value)=>{
                                setPet(prev => ({...prev, gender: value}))
                            }} ></RadioCard>
                        </div>



                        <div className="form-check form-switch">
                            <input
                                value={pet.isNeutered}
                                onChange={(e)=> (setPet(prev=> ({...prev,isNeutered:e.target.checked})))} 
                                className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" required/>
                            <label className="form-check-label" for="flexSwitchCheckDefault">Neutered (Spayed) </label>
                        </div>

                    </div>

                    <div className="age mb-3 ">
                        <label className="mt-2 ml-4 mb-3" for="age">Age</label>
                        <NumberInput 
                            step={1} defaultValue={1} min={1} max={50}
                            onChange={(value)=> (setPet(prev=>({...prev, age:value})))} >
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
                            onChange={(e)=>{
                                setPet(prev=>({...prev,description:e.target.value}))
                            }}
                            type="text" className="form-control" id="description" placeholder="Enter Pet's description"/>
                        <label for="description">Enter Pet's description</label>
                    </div>



                            
            
                <div className='text-center'>
                    <button className='btn btn-outline-primary' onClick={()=> callAPI()}>Save</button>
                    <Link className='btn btn-outline-danger mx-2'
                    to="/listpets">Cancel</Link>
                </div>     

                {/* </form> */}
            </div>

        
      </div>
    </div>
  )
}
