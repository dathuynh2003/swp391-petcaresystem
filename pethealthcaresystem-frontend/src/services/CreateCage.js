import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

export default function CreateCage() {

    let navigate = useNavigate()

    const [cage, setCage] = useState({
        name: '',
        price: null,
        status: 'available',
        description: ''
    })

    const onInputChange = (e) => {
        setCage({ ...cage, [e.target.name]: e.target.value })
    }

    const handleCreateCage = async () => {
        if (cage?.name === '' || cage?.price === null || cage?.price === '') {
            toast.info("Please enter Cage's name and price")
            return
        }
        try {
            const respone = await axios.post('http://localhost:8080/createCage', cage, { withCredentials: true })
            if (respone.data.message === 'Cage created') {
                toast.success('Add new pet successfully!', 2000);
                navigate('/cages')
            } else {
                toast.warning(respone.data.message)
            }
        } catch (e) {
            navigate('/404page')
        }

    }

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
                <Link className='btn btn-danger col-3 mx-auto' to={'/cages'}>Cancel</Link>
                <Link className='btn btn-primary col-3 mx-auto' onClick={handleCreateCage}>Create</Link>
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
        </div>
    )
}
