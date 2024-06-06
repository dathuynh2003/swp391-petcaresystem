import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditAccount = () => {
    let navigate = useNavigate();
    let { userId } = useParams(); // Assuming you're passing the user ID as a route parameter

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
    const [confirmPass, setConfirmPass] = useState('');

    const { fullName, phoneNumber, address, gender, dob, email, password } = user;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const result = await axios.get(`http://localhost:8080/get-user-by-id/${userId}`);
                setUser(result.data?.data); // Accessing the nested data property
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessageEmail("");
        setMessagePass("");

        if (password && password !== confirmPass) {
            setMessagePass("Confirm password does not match");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/update-user-by-admin/${userId}`, user);
            alert("User updated successfully");
            navigate('/list-account'); // Navigate to the desired route after success
        } catch (error) {
            alert(error?.response?.data?.errorMessage ?? error?.message);
        }
    };

    return (
        <div className="container">
            <h1 className="well">Edit Account</h1>
            <div className="col-lg-12 well">
                <div className="row">
                    <form onSubmit={handleUpdate}>
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
                            <div className="form-group">
                                <label>Gender</label>
                                <div className="gender-selection">
                                    <label className="gender-option">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Male" 
                                            checked={gender === "Male"}
                                            onChange={onInputChange} 
                                        />
                                        Male
                                    </label>
                                    <label className="gender-option">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Female" 
                                            checked={gender === "Female"}
                                            onChange={onInputChange} 
                                        />
                                        Female
                                    </label>
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
                                    <option value="1">Customer</option>
                                    <option value="2">Vet</option>
                                    <option value="3">Staff</option>
                                </select>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-lg btn-info">Update</button>
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

export default EditAccount;
