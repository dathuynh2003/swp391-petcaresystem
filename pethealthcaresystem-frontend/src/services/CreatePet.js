import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useRadioGroup, HStack} from '@chakra-ui/react'
import RadioCard from '../components/Radio'
import {LIST_BREED} from '../utils/constant'
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

   
    const [listBreed, setListBreed] = useState([''])
    const [breed, setBreed] = useState('')

    const handleList = (select ) => {
        setListBreed(LIST_BREED[select])
    }

    const handleSelect = (select) => {
        setBreed(select)
    }



  return (
    <div>
      <div className='container'>
      <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Add new Pet</h2>
                <form >
                <div className='mb-3'>
                    <label htmlFor='Name' className='form-label'>
                        Name
                    </label>
                    <input
                        type={"text"}
                        className="form-control"
                        placeholder="Enter Pet's name"
                        name="petname"
                      
             
                    />  

                    <div></div>

                    <RadioCard options={['Dog','Cat','Bird']} onChange={handleList}></RadioCard>
                 

                    <Menu closeOnSelect={false} >
                    <MenuButton as={Button} colorScheme='pink'>
                        Breed
                    </MenuButton>
                    <MenuList>
                        <MenuOptionGroup  value={breed} onChange = {handleSelect} type='radio'>
                            {listBreed.map((breed, index) => (
                                <MenuItemOption key={index} value={breed}>{breed}</MenuItemOption>
                            ))
                                
                            }
               
                        </MenuOptionGroup>
                    </MenuList>
                    </Menu>




                    {/* <div>Type</div>

                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                        
                        <input type="radio" class="btn-check" name="btnradio" id="dog" autocomplete="off"/>
                        <label class="btn btn-outline-primary" for="dog">Dog</label>

                        <input type="radio" class="btn-check" name="btnradio" id="cat" autocomplete="off"/>
                        <label class="btn btn-outline-primary" for="cat">Cat</label>

                        <input type="radio" class="btn-check" name="btnradio" id="bird" autocomplete="off"/>
                        <label class="btn btn-outline-primary" for="bird">Bird</label>
                    </div>

                    <input type="radio" className="btn-check" name="gender" id="gender-id" autocomplete="off"/>
                    <label className="btn btn-outline-success" for="gender-id">Male</label>
                    <input type="radio" className="btn-check" name="gender" id="gender-id" autocomplete="off"/>
                    <label className="btn btn-outline-success" for="gender-id">Female</label> */}





                    <label htmlFor='Name' className='form-label'>
                        Name
                    </label>
                    <input
                        type={"text"}
                        className="form-control"
                        placeholder="Enter Pet's name"
                        name="petname"
                      
             
                    />





                    <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                    <label class="form-check-label" for="flexSwitchCheckDefault">Neutered (Spayed) </label>
                    </div>

                </div>
                <div className='mb-3'>
                    <label htmlFor='Password' className='form-label'>
                        Password
                    </label>
                    <input
                        type={"text"}
                        className="form-control"
                        placeholder='Enter your password'
                        name="password"
                    
                    />

                </div>
                <div className='mb-3'>
                    <label htmlFor='Email' className='form-label'>
                        Email
                    </label>
                    <input
                        type={"text"}
                        className="form-control"
                        placeholder='Enter your email'
                        name="email"
                 
                    />

                </div>
                <button type='submit' className='btn btn-outline-primary'>Submit</button>
                <Link className='btn btn-outline-danger mx-2'
                to="/">Cancel</Link>
                </form>
            </div>

        
      </div>
    </div>
  )
}
