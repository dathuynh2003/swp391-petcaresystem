import { Button, Select } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { URL } from '../utils/constant';
export default function CreateCage() {

    let navigate = useNavigate()

    const [cage, setCage] = useState({
        name: '',
        price: null,
        size: '',
        type: '',
        status: 'available',
        description: ''
    })

    const onInputChange = (e) => {
        setCage({ ...cage, [e.target.name]: e.target.value })
        console.log(cage);
    }

    const handleCreateCage = async () => {
        if (cage?.name === '' || cage?.price === null || cage?.price === '') {
            toast.info("Please enter Cage's name and price")
            return
        }
        if (cage?.size === '') {
            toast.info("Please select the cage's size");
            return
        }
        if (cage?.type === '') {
            toast.info("Please select the cage's type")
            return
        }
        try {
            const respone = await axios.post(`${URL}/createCage`, cage, { withCredentials: true })
            if (respone.data.message === 'Cage created') {
                toast.success('Add new cage successfully!');
                setTimeout(() => {
                    navigate('/cages');
                }, 2000);

            } else {
                toast.warning(respone.data.message)
            }
        } catch (e) {
            navigate('/404page')
        }

    }

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
        <div className='container my-3'>
            <div className='new-cage row w-100 mx-auto my-5'>
                <label htmlFor='name' className='w-75 mx-auto mt-3'>Cage Name: </label>
                <input
                    className='border border-dark mx-auto mb-3 fs-4 w-75 row'
                    type='text'
                    name='name' value={cage?.name}
                    placeholder="Enter the new cage's name...."
                    onChange={(e) => onInputChange(e)}
                />
                <label htmlFor='price' className='w-75 mx-auto mt-3'>Cage Price (VND/hour): </label>
                <input
                    className='border border-dark mx-auto mb-3 fs-4 w-75 row'
                    type='number'
                    name='price' value={cage?.price}
                    placeholder="Enter the new cage's price...."
                    onChange={(e) => onInputChange(e)}
                />
                <div className='d-flex justify-content-between w-75 mx-auto'>
                    <div className='w-50' style={{ marginRight: '5%' }}>
                        <label htmlFor='size' className='col-6 px-2'>Select Size: </label>
                        <Select
                            className='border border-dark col-5'
                            name='size'
                            onChange={onInputChange}
                            placeholder='Select Size'
                        >
                            <option className='fs-6' value="Small">Small</option>
                            <option className='fs-6' value="Medium">Medium</option>
                            <option className='fs-6' value="Large">Large</option>
                        </Select>
                    </div>
                    <div className='w-50' style={{ marginLeft: '5%' }}>
                        <label htmlFor='type' className='col-6 px-2'>Cage's Type: </label>
                        <Select
                            className='border border-dark col-6'
                            name='type'
                            onChange={onInputChange}
                            placeholder='Select Type'
                        >
                            {petTypes?.map((petType, index) => (
                                <option key={index} lassName='fs-6' value={petType.configValue}>{petType.configValue}</option>
                            ))}
                            {/* <option className='fs-6' value="">Select type</option>
                            <option className='fs-6' value="Dog">Dog</option>
                            <option className='fs-6' value="Cat">Cat</option>
                            <option className='fs-6' value="Bird">Bird</option> */}
                        </Select>
                    </div>
                </div>
                <label htmlFor='description' className='w-75 mx-auto mt-3'>Cage Description: </label>
                <textarea
                    className='border border-dark mx-auto mb-3 fs-4 w-75 row'
                    name='description'
                    value={cage?.description}
                    placeholder="Enter the new cage's description...."
                    onChange={(e) => onInputChange(e)}
                    rows='4'
                />
            </div>
            <div className='row w-50 mx-auto text-center'>
                <Button className='col-3 mx-auto' colorScheme='red' onClick={() => navigate('/cages')}>Cancel</Button>
                <Button className='col-3 mx-auto' colorScheme='teal' onClick={handleCreateCage}>Create</Button>
            </div>
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
        </div >
    )
}
