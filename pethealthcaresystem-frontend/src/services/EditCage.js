import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

export default function EditCage() {
    let navigate = useNavigate()
    const { cageId } = useParams()
    const [cage, setCage] = useState()

    const loadCage = async () => {
        const response = await axios.get(`http://localhost:8080/cage/${cageId}`, { withCredentials: true })
        if (response.data.message === "Cage found") {
            setCage(response.data.cage)
            console.log(response.data.cage)
        } else {
            toast.warning(response.data.message)
        }
    }

    useEffect(() => {
        loadCage()
    }, [])

    const onInputChange = (e) => {
        setCage({ ...cage, [e.target.name]: e.target.value })
    }

    const handleEditCage = async () => {
        if (cage?.name === '' || cage?.price === null || cage?.price === '') {
            toast.info("Please enter Cage's name and price")
            return
        }
        try {
            const respone = await axios.put(`http://localhost:8080/updateCage/${cageId}`, cage, { withCredentials: true })
            if (respone.data.message === 'Cage updated') {
                toast.success('Updated Cage Successfully!', 2000);
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
                <Link className='btn btn-primary col-3 mx-auto' onClick={handleEditCage}>Save</Link>
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
