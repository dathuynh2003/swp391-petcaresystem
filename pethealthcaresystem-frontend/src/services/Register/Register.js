import { Button } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import { URL } from '../../utils/constant'
export default function Register() {
    let navigate = useNavigate()

    const [user, setUser] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        avatar: "",
        gender: "Male",
        dob: "",

    })

    const [messageEmail, setMessageEmail] = useState('')
    const [messagePass, setMessagePass] = useState("")
    const [messageConfirmPass, setMessageConfirmPass] = useState("")
    const [confirm_pass, setConfirmPass] = useState("")
    const [messagePhone, setMessagePhone] = useState("")
    const [messageDob, setMessageDob] = useState("")
    const { fullName, phoneNumber, address, gender, dob, email, password } = user;
    const onInputChange = (e) => {
        if (e.target.name === 'password') {
            if (e.target.value.length !== 0 && !isValidPassword(e.target.value)) {
                if (!/(?=.*[0-9])/.test(e.target.value)) {
                    setMessagePass("Password must include at least one Numeric digit");
                } else if (!/(?=.*[@.#$!%*?&^])/.test(e.target.value)) {
                    setMessagePass("Password must include at least one special character");
                } else if (e.target.value.length < 8 || e.target.value.length > 15) {
                    setMessagePass("Password total length must be in the range [8-15]");
                } else if (!/(?=.*[a-z])/.test(e.target.value)) {
                    setMessagePass("Password must include at least one lowercase letter");
                } else if (!/(?=.*[A-Z])/.test(e.target.value)) {
                    setMessagePass("Password must include at least one uppercase letter");
                } else {
                    setMessagePass("Invalid password format");
                }
            } else {
                setMessagePass("")
            }
        }
        setUser({ ...user, [e.target.name]: e.target.value })
        setConfirmPass(confirm_pass)
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessageEmail("")
        setMessageDob("")
        setMessagePhone("")
        if (calculateAge(user.dob) < 13) {
            setMessageDob("You need to be at least 13 years old to register")
        } else if (!isVietnamesePhoneNumberValid(user.phoneNumber)) {
            setMessagePhone("Phone number is invalid")
        } else if (!isValidPassword(password)) {
            return
        } else if (password === confirm_pass) {
            setMessageConfirmPass("")
            try {
                const result = await axios.post(`${URL}/register`, user)
                const responseData = result.data

                console.log(responseData)
                if (responseData.data === 'Verification email sent') {
                    //register success
                    // navigate(`/verify/${user.email}`)
                    navigate(`/verify`, { state: { email } })
                    // setMessage("Register success")
                } else if (responseData.data === 'Email is invalid') {
                    setMessageEmail("Email is invalid")
                } else if (responseData.data === 'Email is already in use')
                    setMessageEmail("Email is already in use")
                else if (responseData.data === 'Phone number is already associated with a different email')
                    setMessagePhone("Phone number is already in use")
            } catch (e) {
                console.log(e)
            }
        } else {
            setMessageConfirmPass("Confirm password does not match")
        }

    }

    const calculateAge = (dob) => {
        const [year, month, day] = dob.split('-').map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    // Các loại số điện thoại hợp lệ:
    // Các đầu số 03, 05, 07, 08, 09 (ví dụ: 0981234567)
    // Số có thể bắt đầu với +84 hoặc 84 (ví dụ +84981234567, 84981234567)
    function isVietnamesePhoneNumberValid(number) {
        return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
    }
    //Valid password là password có ít nhất 1 chữ cái thường, 1 chữ cái hoa, 1 ký tự đặc biệt trong [@.#$!%*?&], 1 chữ số và có độ dài từ 8-15
    function isValidPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(password);
    }

    return (
        <div className='App d-flex align-items-center' style={{ overflowY: 'hidden', backgroundImage: "url('SignUpBg.png')", backgroundSize: 'cover', paddingTop: '0px' }}>
            <div className='content sign-up mt-1 rounded' style={{ width: '450px', marginRight: '10px' }}>
                <form className='p-3' onSubmit={(e) => handleRegister(e)} method='post'>
                    <div className='header text-center mb-3'>
                        <h2 className='fw-bold ' style={{ color: 'teal' }}>Sign up</h2>
                    </div>
                    <div className='body'>
                        <div className="form-floating mb-2 ">
                            <input type="text" className="form-control inputSignUp" name='fullName' placeholder="name@example.com"
                                maxLength={25} value={fullName} onChange={(e) => onInputChange(e)} required />
                            <label htmlFor="floatingInput" id='label-input'>Full name</label>
                        </div>
                        <div className="form-floating mb-2 ">
                            <input type="date" className="form-control inputSignUp" placeholder="name@example.com" name='dob'
                                // Đúng định dạng YYYY-MM-DD mới set vào max được
                                max={new Date().toISOString().split('T')[0]}
                                value={dob} onChange={(e) => onInputChange(e)} required />
                            <label htmlFor="floatingInput" id='label-input'>Date of Birth</label>
                        </div>
                        <h6 style={{ color: 'red', textAlign: 'center' }}>{messageDob}</h6>
                        <div className='gender d-flex justify-content-space-around text-center m-3'>
                            <label htmlFor="gender">Gender</label>
                            <div className="form-group  row mx-auto w-100 h-50 d-flex aligh-items-center gap-3 text-center">
                                <div className="form-check col-md-4 text-center" style={{ marginLeft: '20px', height: '40px' }}>
                                    <input className="form-check-input" type="radio" id='male' name="gender" value="Male" onChange={(e) => onInputChange(e)} checked />
                                    <label className="form-check-label mx-1 w-100" htmlFor="male">Male</label>
                                </div>
                                <div className="form-check col-md-4 w-10" style={{ backgroundColor: 'transparent', height: '40px' }}>
                                    <input className="form-check-input" id='female' type="radio" name="gender" value="Female" onChange={(e) => onInputChange(e)} />
                                    <label className="form-check-label mx-1 w-100" htmlFor="female">Female</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-floating mb-2 ">
                            <input type="number" className="form-control inputSignUp" placeholder="name@example.com" name='phoneNumber' value={phoneNumber} onChange={(e) => onInputChange(e)} required />
                            <label htmlFor="floatingInput" id='label-input'>Phone number</label>
                        </div>
                        <h6 style={{ color: 'red', textAlign: 'center' }}>{messagePhone}</h6>
                        <div className="form-floating mb-2 ">
                            <input type="text" className="form-control inputSignUp" placeholder="name@example.com" name='address' value={address}
                                maxLength={50} onChange={(e) => onInputChange(e)} />
                            <label htmlFor="floatingInput" id='label-input'>Address</label>
                        </div>
                        <div className="form-floating mb-2 ">
                            <input type="email" className="form-control inputSignUp" placeholder="name@example.com" name='email' value={email} onChange={(e) => onInputChange(e)} required />
                            <label htmlFor="floatingInput" id='label-input'>Email</label>

                        </div>
                        <h6 style={{ color: 'red', textAlign: 'center' }}>{messageEmail}</h6>
                        <div className="form-floating mb-2 ">
                            <input type="password" className="form-control inputSignUp" placeholder="name@example.com" name='password' value={password} onChange={(e) => onInputChange(e)} required />
                            <label htmlFor="floatingInput" id='label-input'>Password</label>
                        </div>
                        <h6 style={{ color: 'red', textAlign: 'center' }}>{messagePass}</h6>
                        <div className="form-floating mb-2 ">
                            <input type="password" className="form-control inputSignUp" placeholder="name@example.com" name='confirm_pass' value={confirm_pass} onChange={(e) => setConfirmPass(e.target.value)} required />
                            <label htmlFor="floatingInput" id='label-input'>Repeat password</label>

                        </div>
                        <h6 style={{ color: 'red', textAlign: 'center' }}>{messageConfirmPass}</h6>
                        <div>
                            <input type="submit" value="Sign up" className='col-12 btn-sign-up btn' style={{ background: 'teal', color: 'white' }} />
                        </div>
                    </div>
                </form>
                <div>
                    <p className=" text-center">
                        <i className='fw-bold'>Have already an account ?</i> <Link to={'/login'}><Button className="btn-login" style={{ background: 'teal', color: 'white' }}>Login here</Button></Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
