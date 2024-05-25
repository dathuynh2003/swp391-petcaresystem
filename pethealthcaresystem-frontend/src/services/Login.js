import React, { useState } from 'react'
import './login.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'



export default function Login() {

    let navigate = useNavigate()

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [message, setMessage] = useState()



    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await axios.post(`http://localhost:8080/login`, { email, password })
        if (response.data !== '') {
            navigate('/')
        } else {
            setMessage("Invalid username or password!")
        }
    }



    return (
        <div className="video-background">
            <video autoplay muted loop id="myVideo">
                <source src="assets/backgroundAnimate.mp4" type="video/mp4" />
            </video>

            <div class="bg-img">

                <div class="box-left">
                    <div class="imagelogin">
                        <img src="assets/dog.jpg" alt="" width="200px" height="300px" />
                        <img src="assets/cat.jpg" alt="" width="200px" height="400px" />
                        <img src="assets/hamster.jpg" alt="" width="200px" height="300px" />
                    </div>
                </div>
                <div class="box-right">
                    <div class="form-input-login">
                        <h2>Pet For Life</h2>
                        <form>
                            <div class="field">
                                <span class="fa fa-user"></span>
                                <input type="text" id="email" name="email" required placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div class="field space">
                                <span class="fa fa-lock"></span>
                                <input type="password" class="pass-key" id="password" name="password" required
                                    placeholder="Your Password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <h6 className='error'>{message}</h6>

                            <div class="pass">
                                <a href="#"><i>Forgot Password?</i></a>
                            </div>
                            <div class="fieldlogin">
                                <button className='btn btn-primary' style={{width:'30%'}} onClick={handleLogin}>Login</button>
                            </div>
                            <div class="or">OR</div>

                        </form>
                        <div class="google">
                            <div class="google">
                                <div class="flex items-center justify-center h-screen dark:bg-gray-100">
                                    <button
                                        class="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-100 dark:text-slate-100 hover:border-slate-100 dark:hover:border-slate-100 hover:text-slate-200 dark:hover:text-slate-100 hover:shadow transition duration-50">
                                        <img class="w-4 h-4" src="https://www.svgrepo.com/show/475656/google-color.svg"
                                            loading="lazy" alt="google logo" />
                                        <span class="text-base">Login with Google</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="signup">
                        <div class="signuptext">Don't have account?</div>
                        <Link className='btn btn-primary p-0 mt-2' style={{height:'70%'}} to={'/register'}>Sign-up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
