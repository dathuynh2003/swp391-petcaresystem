import React, { useEffect, useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import './profile.css'
import { Button, FormControl } from '@chakra-ui/react';
import axios from 'axios';
const Profile = () => {

  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState({
    fullName: false,
    phoneNumber: false,
    address: false,
    avatar: false,
    gender: false,
    dob: false
  });

  const [profile, setProfile] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    avatar: '',
    gender: '',
    dob: ''
  });

  const { fullName, phoneNumber, address, avatar, gender, dob } = isEditing

  // const handleEditClick = (field) => {
  //   setIsEditing({ ...isEditing, [field]: true });
  // };

  const onInputChange = (field, event) => {
    setProfile({ ...profile, [field]: event.target.value });
  };

  // const onInputChange = (e) => {
  //   setProfile({ ...profile, [e.target.name]: e.target.value });
  // };

  // const handleBlur = (field) => {
  //   setIsEditing({ ...isEditing, [field]: false });
  // };

  const handleUpdateProfile = async (e, field) => {
    const response = await axios.put(`http://localhost:8080/updateuser`, profile, { withCredentials: true })
    if (response.data !== '') {
      alert("Update profile success");
      setIsEditing({ ...isEditing, [field]: false })
      navigate('/profile')
    }
  }

  const handleGetProfile = async () => {
    const response = await axios.get(`http://localhost:8080/getuser`, { withCredentials: true })
    if (response.data !== '') {
      setProfile(response.data);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      handleGetProfile();
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dateOfBirth = formatDate(profile.dob);

  return (
    <div className='container'>
      <div className='row border border-success w-75' style={{ height: '180px', position: 'absolute' }}>
        <img className=''
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVoTj8eKTZj9LixAF9l5tqIBYPnLGQZ5dHvQ&s'
          alt='Mô tả hình ảnh'
          style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width:'auto' }}
        />
      </div>
      <div className='row m-4' style={{ position: 'relative' }}>
        <div className='avatar col-4 my-4'>
          <img className='rounded-circle my-3 mx-5' src='https://tse1.mm.bing.net/th?id=OIP.KTq5K5E3QeLVrm71FR0w8gHaHa&pid=Api&P=0&h=220' alt=''></img>

          <h5 className='text-center fw-bold mb-0' style={{ width: '80%' }}>{profile.fullName}</h5>
          <p class="fw-light text-center mb-4" style={{ width: '80%' }}>{profile.email}</p>
          <div className=''>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 shadow" to={`/listPets`}>My Pets</Link>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 shadow" to={`/`}>My Appointments</Link>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 shadow" to={`/`}>My Report</Link>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 shadow" to={`/`}>My Vet</Link>
          </div>


        </div>
        <div className='profile col-8 my-5'>
          <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow bg-light'>
            <h2 className='text-center m-4'>My Profile</h2>
            <div>
              <form >
                {isEditing.fullName ? (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Full Name</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <input className='col-8 mb-0 mt-2 fw-bold fs-6' name='fullName' value={profile.fullName} onChange={(e) => onInputChange('fullName', e)} />
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'fullName')} >Save</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Full Name</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{profile.fullName}</p>
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, ['fullName']: true })} >Edit</Button>
                    </div>
                  </div>
                )}
              </form>

              <form>
                {isEditing.phoneNumber ? (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Phone Number</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <input className='col-8 mb-0 mt-2 fw-bold fs-6' name='phoneNumber' value={profile.phoneNumber} onChange={(e) => onInputChange('phoneNumber', e)} />
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'phoneNumber')} >Save</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Phone Number</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{profile.phoneNumber}</p>
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, ['phoneNumber']: true })} >Edit</Button>
                    </div>
                  </div>
                )}
              </form>

              <form>
                {isEditing.address ? (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Address</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <input className='col-8 mb-0 mt-2 fw-bold fs-6' name='address' value={profile.address} onChange={(e) => onInputChange('address', e)} />
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'address')} >Save</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Address</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{profile.address}</p>
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, ['address']: true })} >Edit</Button>
                    </div>
                  </div>
                )}
              </form>

              <form>
                {isEditing.dob ? (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Date of birth</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <input type='date' className='col-8 mb-0 mt-2 fw-bold fs-6' name='dob' value={profile.dob} onChange={(e) => onInputChange('dob', e)} />
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'dob')} >Save</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Date of birth</span>
                    <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                      <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{dateOfBirth}</p>
                      <Button className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, ['dob']: true })} >Edit</Button>
                    </div>
                  </div>
                )}
              </form>

            </div>
            <div className='row'>
              <Link className='btn btn-primary my-4 col-12 mx-auto' to={"/"}>Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
