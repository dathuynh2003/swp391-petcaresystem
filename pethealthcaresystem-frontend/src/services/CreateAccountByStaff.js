import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateAccountByStaff = () => {
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
        roleId: 1
    });

    const { fullName, phoneNumber, gender } = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const result = await axios.post(`http://localhost:8080/createAnonymousUserByStaff`, user, { withCredentials: true });
            alert("Create user successful");
            // navigate('/list-account'); // Navigate to the desired route after success
        } catch (error) {
            alert(error?.response?.data?.errorMessage ?? error?.message);
        }
    };

    return (
        <div className="container">
            <Link className='btn btn-primary m-3' to={'/create-pet-by-staff'}>Add new Pet</Link>
            <h1 className="well">Registration Customer Form</h1>
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
                                        required
                                    />
                                </div>
                                <div className="col-sm-6 form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Phone Number Here.."
                                        className="form-control"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={onInputChange}
                                        required
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
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Add New Customer Account</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAccountByStaff;
