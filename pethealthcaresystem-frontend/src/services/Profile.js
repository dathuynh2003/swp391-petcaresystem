import React, { useEffect, useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import './profile.css';
import { Avatar, Button, FormControl } from '@chakra-ui/react';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Margin } from '@mui/icons-material';
import { width } from '@mui/system';
import { EditIcon } from '@chakra-ui/icons';
import { URL } from '../utils/constant';
const Profile = () => {
  const navigate = useNavigate();

  const roleId = localStorage.getItem("roleId")

  const [messagePhone, setMessagePhone] = useState("")
  const [messageDob, setMessageDob] = useState("")

  const [isEditing, setIsEditing] = useState({
    fullName: false,
    phoneNumber: false,
    address: false,
    // avatar: false,
    gender: false,
    dob: false,
  });

  const [profile, setProfile] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    avatar: '',
    gender: '',
    dob: '',
  });

  // const { fullName, phoneNumber, address, avatar, gender, dob } = isEditing;

  const onInputChange = (field, event) => {
    console.log(event.target.value)
    setProfile({ ...profile, [field]: event.target.value });
  };

  const handleUpdateProfile = async (e, field) => {
    if (field === 'phoneNumber' && !isVietnamesePhoneNumberValid(profile.phoneNumber)) {
      setMessagePhone("Phone Number is invalid")
      return;
    }
    if (field === 'dob' && calculateAge(profile.dob.split('T')[0]) < 13) {
      setMessageDob("You need to be at least 13 years old")
      return;
    }
    const response = await axios.put(`${URL}/updateuser`, profile, { withCredentials: true });
    if (response.data.message === 'Successfully') {
      toast.success('Update profile successfully');
      setIsEditing({ ...isEditing, [field]: false });
      navigate('/profile');
    } else {
      toast.info(response.data.message)
    }
  };

  const handleGetProfile = async () => {
    const response = await axios.get(`${URL}/getuser`, { withCredentials: true });
    if (response.data !== '') {
      setProfile(response.data);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    if (!file?.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image.');
      return;
    }

    if (file?.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    try {
      const response = await axios.post(`${URL}/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (response.data) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: response.data,
        }));
        toast.success('Avatar uploaded successfully');
        window.location.reload()
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      handleGetProfile();
    }
  }, []);

  const formatDate = (dateString, formatter) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return formatter
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year);
  };

  const dateOfBirth = formatDate(profile.dob, 'dd/MM/yyyy');

  // Các loại số điện thoại hợp lệ:
  // Các đầu số 03, 05, 07, 08, 09 (ví dụ: 0981234567)
  // Số có thể bắt đầu với +84 hoặc 84 (ví dụ +84981234567, 84981234567)
  function isVietnamesePhoneNumberValid(number) {
    return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
  }

  const calculateAge = (dob) => {
    const [year, month, day] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    console.log(year, month, day)
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className='container' style={{ marginLeft: '50px' }} >
      <div className=''>
        <div className='row  border-success w-75' style={{ height: '180px', position: 'absolute' }}>
          <img
            className=''
            src='https://nordic.allianzgi.com/-/media/allianzgi/eu/regional-content/images/pets/1920x980-tiergesundheit.jpg?rev=-1'
            alt='Mô tả hình ảnh'
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className='row m-4' style={{ position: 'relative' }}>
          <div className='avatar col-4 my-4'>

            <Avatar
              className='rounded-circle my-3 mx-5'
              src={profile?.avatar}
              alt=''
              key={profile?.avatar}
              style={{ height: '200px', width: '200px' }}
            />

            <h5 className='text-center fw-bold mb-0' style={{ width: '80%' }}>{profile.fullName}</h5>
            <p className='fw-light text-center mb-4' style={{ width: '80%' }}>{profile.email}</p>
            {roleId === '1' ?
              <div className=''>

                <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 rounded shadow text-center" to={`/listPets`}>My Pets</Link>
                <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 rounded shadow text-center" to={`/reservation`}>My Appointments</Link>

                {/* <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 shadow" to={`/`}>My Report</Link>
            <Link className="list-group-item py-1 px-2 text-decoration-none btn btn-light my-2 shadow" to={`/`}>My Vet</Link> */}
              </div> : ''
            }
          </div>
          <div className='profile col-8 my-5'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow bg-light'>
              <h2 className='text-center m-4'>My Profile</h2>
              <div>
                <form>
                  {isEditing.fullName ? (
                    <div>
                      <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Full Name</span>
                      <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                        <input className='col-8 mb-0 mt-2 fw-bold fs-6' name='fullName' value={profile.fullName} onChange={(e) => onInputChange('fullName', e)} />
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'fullName')}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Full Name</span>
                      <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                        <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{profile.fullName}</p>
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, fullName: true })}>Edit</Button>
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
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'phoneNumber')}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Phone Number</span>
                      <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                        <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{profile.phoneNumber}</p>
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, phoneNumber: true })}>Edit</Button>
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
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'address')}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Address</span>
                      <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                        <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{profile.address}</p>
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, address: true })}>Edit</Button>
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
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={(e) => handleUpdateProfile(e, 'dob')}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Date of birth</span>
                      <div className='row border border-top-0 border-end-0 border-start-0 align-middle'>
                        <p className='col-8 mb-0 mt-2 fw-bold fs-6'>{dateOfBirth}</p>
                        <Button colorScheme='teal' className='btn btn-outline-light h-50 w-25 col-4 my-1 fw-bold' onClick={() => setIsEditing({ ...isEditing, dob: true })}>Edit</Button>
                      </div>
                    </div>
                  )}
                </form>

                <form>
                  <div className='form-group'>
                    <span className='fw-bold text-secondary' style={{ fontSize: '10px' }}>Avatar</span>
                    <input type='file' className='form-control' onChange={handleFileChange} />
                  </div>
                </form>
              </div>
              <div className='row mt-3'>
                <Link to={"/"}><Button className='col-12 mx-auto' style={{ background: 'teal', color: 'white' }} >Back to home</Button></Link>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </div>
    </div >
  );
};

export default Profile;
