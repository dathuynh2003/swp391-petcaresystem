import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { URL } from '../../utils/constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        roleId: 3,
        isActive: false
    });

    const [messageEmail, setMessageEmail] = useState('');
    const [messagePass, setMessagePass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const result = await axios.get(`${URL}/get-user-by-id/${userId}`);
                console.log('Fetched user data:', result.data?.data); // Log fetched user data
                setUser(result.data?.data); // Accessing the nested data property
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        console.log(`Input change - ${name}:`, newValue); // Log input changes
        setUser({
            ...user,
            [name]: newValue
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessageEmail("");
        setMessagePass("");

        console.log('Updating user with data:', {
            roleId: user.roleId,
            isActive: user.isActive
        }); // Log data being sent to the backend

        try {
            await axios.put(`${URL}/update-user-by-admin/${userId}`, {
                roleId: user.roleId,
                isActive: user.isActive
            });
            toast.success("User updated successfully");
            navigate('/list-account'); // Navigate to the desired route after success
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(error?.response?.data?.errorMessage ?? error?.message);
        }
    };

    return (
        <div className="container">
            <h1 className="well">Edit Account</h1>
            <div className="col-lg-12 well">
                <div className="row">
                    <form onSubmit={handleUpdate}>
                        <div className="col-sm-12">
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
                            <div className="form-group form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isActive"
                                    id="isActiveSwitch"
                                    checked={user.isActive}
                                    onChange={onInputChange}
                                />
                                <label className="form-check-label" htmlFor="isActiveSwitch">Active Status</label>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-lg btn-info">Update</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default EditAccount;
