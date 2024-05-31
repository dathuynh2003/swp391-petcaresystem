import axios from 'axios';
import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';


export default function Verify() {

    const navigate = useNavigate()
    const [verifyCode, setVerifyCode] = useState()
    // const { email } = useParams()
    const [message, setMessage] = useState()


    const location = useLocation();
    const { email } = location.state || { email: '' } // Lấy email từ state register truyen qua


    const handleVerifyCode = async (e) => {
        e.preventDefault();
        const result = await axios.post(`http://localhost:8080/verify/${email}/${verifyCode}`)
        setMessage("")
        if (result.data === 'Email verify successfully') {
            navigate('/login')
        } else {
            setMessage("Verification code is invalid")
        }

    }

    return (
        <div className='container'>
            <video autoPlay muted loop id="myVideo" style={{ position: 'absolute', minWidth: '100%', minHeight: '100%' }}>
                <source src="assets/backgroundAnimate.mp4" type="video/mp4" />
            </video>
            <div className='row d-flex justify-content-center align-items-center vh-100' style={{ position: 'relative' }}>
                <form className='needs-validation' onSubmit={(e) => handleVerifyCode(e)} novalidate>
                    <div className='col-md-6 offset-md-3 border rounded mx-auto shadow text-center py-4' style={{ backgroundColor: 'white' }}>
                        <label htmlFor="verifyCode" className='text-primary '>Enter the Verification Code</label>
                        <div className="form-group text-center m-2">
                            <input className='form-input w-50' type="text" required name='verifyCode' value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
                        </div>
                        <h6 className='text-danger'>{message}</h6>
                        <div className="form- text-center col-12">
                            <Link className='btn btn-danger mx-2' to={'/register'}>Cancel</Link>
                            <input type="submit" name="submit" id="submit" className="verify-button btn btn-outline-primary mx-2" value="Verify" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
