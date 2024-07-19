import React, { useEffect, useState } from 'react'
import './login.css'
import axios from 'axios'
import { Link, useNavigate, } from 'react-router-dom'

import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from '../firebase';
import { Button } from '@chakra-ui/react';
import { URL } from '../utils/constant';


export default function Login() {

    let navigate = useNavigate()

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [message, setMessage] = useState()

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate('/')
        }
    }, [navigate])

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (!validateEmail(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/login`, { email, password }, { withCredentials: true });
            if (response.data.isSuccess === 'true') {
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('roleId', response.data.user.roleId)
                localStorage.setItem('email', response.data.user.email)
                navigate('/')
            } else {
                setMessage(response.data.message); // Use the message from the backend
            }
        } catch (error) {
            setMessage("Invalid username, password, or account is inactive."); // Fallback message
        }
    }

    const provider = new GoogleAuthProvider();

    const auth = getAuth(app);

    const handleLoginGoogle = async (e) => {
        e.preventDefault();

        try {
            const result = await signInWithPopup(auth, provider)
            await axios.post(`${URL}/register-gg`, {
                email: result.user.email,
                fullName: result.user.displayName,
                password: result.user.email
            }, { withCredentials: true });


            localStorage.setItem('isLoggedIn', true);
            navigate('/');

        } catch (error) {
            alert(error?.response?.data?.errorMessage ?? error?.message);
        }
    };




    return (
        // <div className="video-background">
        //     <video autoPlay muted loop id="myVideo">
        //         <source src="assets/backgroundAnimate.mp4" type="video/mp4" />
        //     </video>

        //     <div className="bg-img">

        //         <div className="box-left container">
        //             <div className="imagelogin row">
        //                 <img className='h-50 my-5' src="assets/dog.jpg" alt="" />
        //                 <img style={{ height: '60%' }} src="assets/cat.jpg" alt="" />
        //                 <img className='h-50 my-5' src="assets/hamster.jpg" alt="" />
        //             </div>
        //         </div>
        //         <div className="box-right">
        //             <div className="form-input-login">
        //                 <h2>Pet For Life</h2>
        //                 <form>
        //                     <div className="field">
        //                         <span className="fa fa-user"></span>
        //                         <input type="text" id="email" name="email" required placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} />
        //                     </div>
        //                     <div className="field space">
        //                         <span className="fa fa-lock"></span>
        //                         <input type="password" className="pass-key" id="password" name="password" required
        //                             placeholder="Your Password" value={password} onChange={e => setPassword(e.target.value)} />
        //                     </div>
        //                     <h6 className='error'>{message}</h6>

        //                     <div className="pass">
        //                         <a href="#"><i>Forgot Password?</i></a>
        //                     </div>
        //                     <div className="fieldlogin">
        //                         <button className='btn btn-primary' style={{ width: '30%' }} onClick={handleLogin}>Login</button>
        //                     </div>
        //                     <div className="or">OR</div>

        //                 </form>
        //                 <div className="google">
        //                     <button className='btn btn-light row mx-5 w-50' onClick={handleLoginGoogle}>
        //                         <img className="row" style={{ width: '30%' }} src="https://www.svgrepo.com/show/475656/google-color.svg"
        //                             loading="lazy" alt="google logo" />
        //                         Login with Google
        //                     </button>
        //                 </div>

        //             </div>
        //             <div className="signup row">
        //                 <div className="signuptext col-6">Don't have account?</div>
        //                 <Link className='btn btn-primary col-3 m-2' style={{ height: '70%' }} to={'/register'}>Sign-up</Link>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className='App d-flex align-items-center justify-content-center' style={{ overflowY: 'hidden', backgroundImage: "url('Bg.png')", backgroundSize: 'cover', paddingTop: '0px' }}>
            <div className='mx-auto  '  >

                <div className='content login text-center rounded shadow' style={{ width: '350px', marginLeft: '-100%' }}>
                    {/* , marginLeft: '-200px' */}
                    <form className='form-login mx-3 mb-3 mt-3'>
                        <div className='header m-4 mt-3'>
                            <h2 className='fw-bold' style={{ color: 'white' }}>Login</h2>
                        </div>
                        <div className='login-body mb-3'>
                            <div class="form-floating mb-2 ">
                                <input type="email" class="form-control" id="floatingInputLogin" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                <label htmlFor="floatingInput" id='label-input'>Enter email</label>
                            </div>
                            <div class="form-floating mb-2">
                                <input style={{ height: '20px' }} type="password" class="form-control" id="floatingInputLogin" placeholder="name@example.com" value={password} onChange={e => setPassword(e.target.value)} />
                                <label htmlFor="floatingInput" id='label-input'>Enter password</label>
                            </div>
                            <div><h6 className='warning' style={{ color: 'red' }}>{message}</h6></div>
                            <div className='mx-text-center mb-2'>
                                <a href="#"><i>Forgot Password?</i></a>
                            </div>
                            <div>
                                <button className='col-12 btn-login rounded fw-bold' style={{ background: 'teal', color: 'white', height: '40px' }} onClick={handleLogin}>Login</button>
                            </div>
                            <div className='d-flex justify-content-center gap-2 mb-1 mt-2'>
                                <p>Don't have an account?</p><Link to={'/register'} className='fw-bold'>Sign up</Link>
                            </div>
                            <div className='mb-3 text-center col-12 mx-auto d-flex justify-content-center' style={{ width: '100%' }}>
                                <button className='gg-login d-flex gap-2 p-2 rounded mb-3 ' style={{ background: 'transparent' }} onClick={handleLoginGoogle}>
                                    <img className="" style={{ width: '30px', height: '30px' }} src="https://www.svgrepo.com/show/475656/google-color.svg"
                                        loading="lazy" alt="google logo" />
                                    Login with Google
                                </button>
                            </div>

                        </div>
                        <div></div>
                    </form>
                </div>
            </div>
        </div>
    )
}
