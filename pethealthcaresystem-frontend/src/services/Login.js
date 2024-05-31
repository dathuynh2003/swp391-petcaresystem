import React, { useEffect, useState } from 'react'
import './login.css'
import axios from 'axios'
import { Link, useNavigate, } from 'react-router-dom'



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



    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await axios.post(`http://localhost:8080/login`, { email, password }, {withCredentials: true})  
        if (response.data.isSuccess === 'true') {
            localStorage.setItem('isLoggedIn', true);
            // localStorage.setItem('roleId', response.data.user.roleId)
            // localStorage.setItem('email', response.data.user.email)
            navigate('/')
        } else {
     //       localStorage.setItem('isLoggedIn', false);
            // localStorage.setItem('roleId', 0)
            // localStorage.setItem('email', null)
            setMessage("Invalid username or password!")
        }
    }



    return (
        <div className="video-background">
            <video autoPlay muted loop id="myVideo">
                <source src="assets/backgroundAnimate.mp4" type="video/mp4" />
            </video>

            <div className="bg-img">

                <div className="box-left">
                    <div className="imagelogin">
                        <img src="assets/dog.jpg" alt="" width="200px" height="300px" />
                        <img src="assets/cat.jpg" alt="" width="200px" height="400px" />
                        <img src="assets/hamster.jpg" alt="" width="200px" height="300px" />
                    </div>
                </div>
                <div className="box-right">
                    <div className="form-input-login">
                        <h2>Pet For Life</h2>
                        <form>
                            <div className="field">
                                <span className="fa fa-user"></span>
                                <input type="text" id="email" name="email" required placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="field space">
                                <span className="fa fa-lock"></span>
                                <input type="password" className="pass-key" id="password" name="password" required
                                    placeholder="Your Password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <h6 className='error'>{message}</h6>

                            <div className="pass">
                                <a href="#"><i>Forgot Password?</i></a>
                            </div>
                            <div className="fieldlogin">
                                <button className='btn btn-primary' style={{ width: '30%' }} onClick={handleLogin}>Login</button>
                            </div>
                            <div className="or">OR</div>

                        </form>
                        <div className="google">
                            <div className="google">
                                <div className="flex items-center justify-center h-screen dark:bg-gray-100">
                                    <button
                                        className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-100 dark:text-slate-100 hover:border-slate-100 dark:hover:border-slate-100 hover:text-slate-200 dark:hover:text-slate-100 hover:shadow transition duration-50">
                                        <img className="w-4 h-4" src="https://www.svgrepo.com/show/475656/google-color.svg"
                                            loading="lazy" alt="google logo" />
                                        <span className="text-base">Login with Google</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="signup row">
                        <div className="signuptext col-6">Don't have account?</div>
                        <Link className='btn btn-primary col-3 m-2' style={{height:'70%'}} to={'/register'}>Sign-up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
