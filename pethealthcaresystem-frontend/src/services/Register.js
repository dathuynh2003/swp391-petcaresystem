import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {


    let navigate = useNavigate()


    const [user, setUser] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        avatar: "",
        gender: "",
        dob: "",

    })

    const [messageEmail, setMessageEmail] = useState('')
    const [messagePass, setMessagePass] = useState()
    const [confirm_pass, setConfirmPass] = useState()
    const { fullName, phoneNumber, address, gender, dob, email, password } = user;
    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
        setConfirmPass(confirm_pass)
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessageEmail("")
        if (password === confirm_pass) {
            setMessagePass("")
            const result = await axios.post(`http://localhost:8080/register`, user)
            if (result.data === 'Verification email sent') {
                //register success
                // navigate(`/verify/${user.email}`)
                navigate(`/verify`, { state: { email } })
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
            <div class="container">
                <video autoPlay muted loop id="myVideo" style={{ position: 'absolute', minWidth: '100%', minHeight: '100%' }}>
                    <source src="assets/backgroundAnimate.mp4" type="video/mp4" />
                </video>
                <div class="signup-content row" style={{ position: 'relative' }}>
                    <div className='col-md-6 offset-md-3 border rounded p-4 my-5 shadow' style={{ backgroundColor: 'white' }}>
                        <form onSubmit={(e) => handleRegister(e)}>
                            <h2 className="form-title mb-3 text-center">Create account</h2>

                            <div className="form-group text-center mb-3 border w-75 mx-auto">
                                <input type="text" required className="form-input w-100" placeholder="Your Full Name" name='fullName' value={fullName} onChange={(e) => onInputChange(e)} />
                            </div>

                            <label for="dob" style={{ fontSize: '10px', marginLeft: '13%' }}>Date of Bird</label>
                            <div className="form-group text-center mb-3 border border w-75 mx-auto">
                                <input type="date" required className="form-input w-100" name='dob' value={dob} onChange={(e) => onInputChange(e)} />
                            </div>

                            <label for="gender" style={{ fontSize: '10px', marginLeft: '13%' }}>Gender</label>
                            <div className="form-group mb-3 row mx-auto w-75 mx-auto">
                                <div class="form-check col-md-4 border w-25" style={{ marginLeft: '12.5%', marginRight: '8%' }}>
                                    <input className="form-check-input" type="radio" id='male' name="gender" value="Male" onChange={(e) => onInputChange(e)} />
                                    <label class="form-check-label mx-1 w-100" for="male">Male</label>
                                </div>
                                <div class="form-check col-md-4 border w-25" style={{ backgroundColor: 'white' }}>
                                    <input className="form-check-input" id='female' type="radio" name="gender" value="Female" onChange={(e) => onInputChange(e)} />
                                    <label class="form-check-label mx-1 w-100" for="female">Female</label>
                                </div>
                            </div>

                            <div className="form-group text-center mb-3 border w-75 mx-auto">
                                <input type="address" required className="form-input w-100" placeholder="Your Address" name='address' value={address} onChange={(e) => onInputChange(e)} />
                            </div>
                            <div className="form-group text-center mb-3 border w-75 mx-auto">
                                <input type="phoneNumber" required className="form-input w-100" placeholder="Your Phone Number" name='phoneNumber' value={phoneNumber} onChange={(e) => onInputChange(e)} />
                            </div>
                            <div className="form-group text-center mb-3 border w-75 mx-auto">
                                <input type="email" required className="form-input w-100" placeholder="Your Email" name='email' value={email} onChange={(e) => onInputChange(e)} />
                                <h6 style={{ color: 'red', textAlign: 'center' }}>{messageEmail}</h6>
                            </div>
                            <div className="form-group text-center mb-3 border w-75 mx-auto">
                                <input type="password" required className="form-input w-100" placeholder="Password" name='password' value={password} onChange={(e) => onInputChange(e)} />
                            </div>
                            <div className="form-group text-center mb-3 border w-75 mx-auto">
                                <input type="password" required className="form-input w-100" placeholder="Repeat your password" name='confirm_pass' value={confirm_pass} onChange={(e) => setConfirmPass(e.target.value)} />
                            </div>
                            <h6 style={{ color: 'red', textAlign: 'center' }}>{messagePass}</h6>
                            <div className="form-group text-center">
                                <input type="submit" name="submit" id="submit" className="login-button btn btn-outline-primary mx-2" value="Sign up" />
                            </div>
                        </form>
                        <p className="loginhere text-center">
                            Have already an account ? <Link className="login-button btn btn-primary" to={'/login'}>Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
