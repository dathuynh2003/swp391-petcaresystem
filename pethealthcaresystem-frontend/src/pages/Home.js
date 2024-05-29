import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

nfc

export default function Home() {

    let navigate = useNavigate()

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    const [user, setUser] = useState()

    const getUser = async () => {
        const result = await axios.get(`http://localhost:8080/getuser`, { withCredentials: true })
        setUser(result.data)

    }

    const handleLogout = async (e) => {
        e.preventDefault();
        await axios.post(`http://localhost:8080/logout`, { withCredentials: true })
        localStorage.setItem('isLoggedIn', false);
        navigate('/login')
    }

    useEffect(() => {
        if (isLoggedIn === 'true') {
            getUser();
        } else {
            setUser(null)
        }
    }, [isLoggedIn]);

    return (
        <div>

            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to={'/'}>This is Home Page</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className='row'>
                        {isLoggedIn === 'true' && <button className='btn btn-outline-light col mx-2' onClick={handleLogout}>Logout</button>}
                        {isLoggedIn !== 'true' && <Link className='btn btn-outline-light col mx-2' to={'/login'} >Login</Link>}
                        {isLoggedIn !== 'true' && <Link className='btn btn-outline-light col mx-2' to={'/Register'} >Register</Link>}
                    </div>
                </div>

            </nav>
            {user && <h1>Hello {user.full_name}</h1>}

        </div>
    )
}
