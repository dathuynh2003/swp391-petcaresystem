import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const CreateAccount = () => {
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
        roleId: 3
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
        if(password !== confirm_pass){
            setMessagePass("Confirm password does not match")
            return;
        }

        try {
            const result = await axios.post(`http://localhost:8080/create-user-by-admin`, user)
            alert("Create user successful")
        } catch (error) {
            alert(error?.response?.data?.errorMessage??error?.message)
        }
    }
  return (
    <form onSubmit={(e) => handleRegister(e)}>
    <h2 className="form-title mb-3 text-center">Create account</h2>

    <div className="form-group text-center mb-3">
        <input type="text" required className="form-input w-75" placeholder="Your Full Name" name='fullName' value={fullName} onChange={(e) => onInputChange(e)} />
    </div>

    <label for="dob" style={{ fontSize: '10px', marginLeft: '13%' }}>Date of Bird</label>
    <div className="form-group text-center mb-3">
        <input type="date" required className="form-input w-75" name='dob' value={dob} onChange={(e) => onInputChange(e)} />
    </div>

    <label for="gender" style={{ fontSize: '10px', marginLeft: '13%' }}>Gender</label>
    <div className="form-group mb-3 row mx-auto">
        <div class="form-check col-md-4 border" style={{ backgroundColor: 'white', marginLeft: '12.5%', marginRight: '8%' }}>
            <input class="form-check-input" type="radio" name="gender" value="Male" onChange={(e) => onInputChange(e)} />
            <label class="form-check-label mx-4" for="Male">Male</label>
        </div>
        <div class="form-check col-md-4 border" style={{ backgroundColor: 'white' }}>
            <input className="form-check-input" type="radio" name="gender" value="Female" onChange={(e) => onInputChange(e)} />
            <label class="form-check-label mx-4" for="female">Female</label>
        </div>
    </div>

    <div className="form-group text-center mb-3">
        <input type="address" required className="form-input w-75" placeholder="Your Address" name='address' value={address} onChange={(e) => onInputChange(e)} />
    </div>
    <div className="form-group text-center mb-3">
        <input type="phoneNumber" required className="form-input w-75" placeholder="Your Phone Number" name='phoneNumber' value={phoneNumber} onChange={(e) => onInputChange(e)} />
    </div>
    <div className="form-group text-center mb-3">
        <input type="email" required className="form-input w-75" placeholder="Your Email" name='email' value={email} onChange={(e) => onInputChange(e)} />
        <h6 style={{ color: 'red', textAlign: 'center' }}>{messageEmail}</h6>
    </div>
    <div className="form-group text-center mb-3">
        <input type="password" required className="form-input w-75" placeholder="Password" name='password' value={password} onChange={(e) => onInputChange(e)} />
    </div>
    <div className="form-group text-center mb-3">
        <input type="password" required className="form-input w-75" placeholder="Repeat your password" name='confirm_pass' value={confirm_pass} onChange={(e) => setConfirmPass(e.target.value)} />
    </div>
    <h6 style={{ color: 'red', textAlign: 'center' }}>{messagePass}</h6>
    <div className="form-group text-center">
        <input type="submit" name="submit" id="submit" className="login-button btn btn-outline-primary mx-2" value="Sign up" />
    </div>
    <div className='drop-down'>
    <label for="role">Choose a role:</label>
        <select defaultValue={user.roleId} name="roleId" id="roleId" onChange={(e) => onInputChange(e)}>
            <option value="2">Vet</option>
            <option value="3">Staff</option>
        </select>
    </div>
</form>
  )
}

export default CreateAccount
