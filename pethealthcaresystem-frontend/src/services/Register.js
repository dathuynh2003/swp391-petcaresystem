import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {


    let navigate = useNavigate()


    const [user, setUser] = useState({
        email: "",
        password: "",
        full_name: "",
        phone_number: "",
        address: "",
        avatar: "",
        gender: "",
        dob: "",

    })

    const [messageEmail, setMessageEmail] = useState('')
    const [messagePass, setMessagePass] = useState()
    const [confirm_pass, setConfirmPass] = useState()
    const { full_name, phone_number, address, gender, dob, email, password } = user;
    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessageEmail("")
        if (password === confirm_pass) {
            setMessagePass("")
            const result = await axios.post(`http://localhost:8080/register`, user)
            if (result.data === 'User created successfully') {
                //register success
                navigate("/login")
                // setMessage("Register success")
            } else if (result.data === 'Email is invalid') {
                setMessageEmail("Email is invalid")
            } else if (result.data === 'Email is already in use')
                setMessageEmail("Email is already in use")
        } else {
            setMessagePass("Confirm password does not match")
        }

    }

    return (
        <div>

            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                        <h2 className='text-center m-4'>Register User</h2>
                        <form onSubmit={(e) => handleRegister(e)}>
                            <div className='mb-3'>
                                <label htmlFor='FullName' className='form-label'>Full Name</label>
                                <input type='text' required className='form-control' placeholder='Enter your Fullname' name='full_name' value={full_name} onChange={(e) => onInputChange(e)}></input>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='PhoneNumber' className='form-label'>Phone Number</label>
                                <input type='text' className='form-control' placeholder='Enter your Phone Number' name='phone_number' value={phone_number} onChange={(e) => onInputChange(e)}></input>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='Address' className='form-label'>Address</label>
                                <input type='text' className='form-control' placeholder='Enter your Address' name='address' value={address} onChange={(e) => onInputChange(e)}></input>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='Gender' className='form-label'>Gender</label>
                                <input type='text' className='form-control' placeholder='Enter your Gender' name='gender' value={gender} onChange={(e) => onInputChange(e)}></input>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='dob' className='form-label'>Date of bird</label>
                                <input type='date' className='form-control' placeholder='Enter your dob' name='dob' value={dob} onChange={(e) => onInputChange(e)}></input>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='Email' className='form-label'>Email</label>
                                <input type='text' required className='form-control' placeholder='Enter your email address' name='email' value={email} onChange={(e) => onInputChange(e)}></input>
                                <h6 className='mx-2' style={{ color: 'red', textAlign: 'center' }}>{messageEmail}</h6>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='Password' className='form-label'>Password</label>
                                <input type='password' required className='form-control' placeholder='Enter your password' name='password' value={password} onChange={(e) => onInputChange(e)}></input>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='ConfirmPass' className='form-label'>Confirm Password</label>
                                <input type='password' required className='form-control' placeholder='Confirm your password' name='confirm_pass' value={confirm_pass} onChange={(e) => setConfirmPass(e.target.value)}></input>
                            </div>
                            <h6 style={{ color: 'red', textAlign: 'center' }}>{messagePass}</h6>
                            <div style={{ textAlign: 'center' }}>
                                <button type='submit' className='btn btn-outline-primary'>Register</button>
                                <Link className='btn btn-outline-danger mx-2' to={'/login'}>Cancel</Link>
                            </div>
                        </form>
                        <div className="login-account m-3" style={{ textAlign: 'center' }}>
                            <span className="question mx-3">Have an account?</span>
                            <Link className="login-button btn btn-primary" to={'/login'}>login</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
