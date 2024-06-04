import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './createAccount.css'; // Ensure to link your CSS file

const CreateAccount = () => {
    let navigate = useNavigate();

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
    });

    const [messageEmail, setMessageEmail] = useState('');
    const [messagePass, setMessagePass] = useState('');
    const [confirm_pass, setConfirmPass] = useState('');
    const { fullName, phoneNumber, address, gender, dob, email, password } = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setConfirmPass(confirm_pass);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessageEmail("");
        if (password !== confirm_pass) {
            setMessagePass("Confirm password does not match");
            return;
        }

        try {
            const result = await axios.post(`http://localhost:8080/create-user-by-admin`, user);
            alert("Create user successful");
            navigate('/list-account'); // Navigate to the desired route after success
        } catch (error) {
            alert(error?.response?.data?.errorMessage ?? error?.message);
        }
    };

    return (
        <div className="container">
            <h1 className="well">Registration Form</h1>
            <div className="col-lg-12 well">
                <div className="row">
                    <form onSubmit={handleRegister}>
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-6 form-group">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Full Name Here.." 
                                        className="form-control" 
                                        name="fullName"
                                        value={fullName}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="col-sm-6 form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        placeholder="Enter Email Here.." 
                                        className="form-control" 
                                        name="email"
                                        value={email}
                                        onChange={onInputChange}
                                    />
                                </div>
                            </div>					
                            <div className="form-group">
                                <label>Address</label>
                                <textarea 
                                    placeholder="Enter Address Here.." 
                                    rows="3" 
                                    className="form-control" 
                                    name="address"
                                    value={address}
                                    onChange={onInputChange}
                                ></textarea>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Phone Number Here.." 
                                        className="form-control" 
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={onInputChange}
                                    />
                                </div>		
                                <div className="col-sm-6 form-group">
                                    <label>Date of Birth</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        name="dob"
                                        value={dob}
                                        onChange={onInputChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 form-group">
                                    <label>Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Enter Password Here.." 
                                        className="form-control" 
                                        name="password"
                                        value={password}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="col-sm-6 form-group">
                                    <label>Confirm Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Repeat your password" 
                                        className="form-control" 
                                        name="confirm_pass"
                                        value={confirm_pass}
                                        onChange={(e) => setConfirmPass(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <div className="row mx-auto">
                                    <div className="form-check col-md-4 border" style={{ backgroundColor: 'white', marginLeft: '12.5%', marginRight: '8%' }}>
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="gender" 
                                            value="Male" 
                                            onChange={onInputChange} 
                                        />
                                        <label className="form-check-label mx-4" htmlFor="Male">Male</label>
                                    </div>
                                    <div className="form-check col-md-4 border" style={{ backgroundColor: 'white' }}>
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="gender" 
                                            value="Female" 
                                            onChange={onInputChange} 
                                        />
                                        <label className="form-check-label mx-4" htmlFor="Female">Female</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select 
                                    className="form-control" 
                                    name="roleId" 
                                    value={user.roleId} 
                                    onChange={onInputChange}
                                >
                                    <option value="2">Vet</option>
                                    <option value="3">Staff</option>
                                </select>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-lg btn-info">Submit</button>
                            </div>
                            <div className="text-center">
                                <h6 style={{ color: 'red' }}>{messagePass}</h6>
                                <h6 style={{ color: 'red' }}>{messageEmail}</h6>
                            </div>
                        </div>
                    </form> 
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
