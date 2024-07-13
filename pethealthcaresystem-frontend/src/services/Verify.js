import axios from 'axios';
import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    background
} from '@chakra-ui/react'
import { URL } from '../utils/constant';


export default function Verify() {

    const navigate = useNavigate()
    const [verifyCode, setVerifyCode] = useState()
    // const { email } = useParams()
    const [message, setMessage] = useState()


    const location = useLocation();
    const { email } = location.state || { email: '' } // Lấy email từ state register truyen qua


    const handleVerifyCode = async (e) => {
        e.preventDefault();
        const result = await axios.post(`${URL}/verify/${email}/${verifyCode}`)
        setMessage("")
        if (result.data === 'Email verify successfully') {
            toast.success('Register successfully')
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Trì hoãn 2 giây
        } else {
            setMessage("Verification code is invalid")
        }

    }

    return (

            <div className='App d-flex align-items-center' style={{ overflowY: 'hidden', backgroundImage: "url('SignUpBg.png')", backgroundSize: 'cover', paddingTop: '0px' }}>
                <Modal closeOnOverlayClick={false} isOpen={true} style={{ background: 'transparent' }}>
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader>Enter the Verification Code</ModalHeader>
                        <form onSubmit={(e) => handleVerifyCode(e)} novalidate>
                        <ModalBody pb={6}>
                            
                                <div class="form-floating mb-2 ">
                                    <input type="number" class="form-control" id="verifyCode" placeholder="name@example.com" required name='verifyCode' value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
                                    <label htmlFor="verifyCode" id='label-input'>Enter verify code</label>
                                </div>
                                <h6 className='text-danger'>{message}</h6>
                            

                        </ModalBody>

                        <ModalFooter>
                            <input type="submit" name="submit" id="submit" className="btn btn-outline mx-2" value="Verify" style={{ background: 'teal', color: 'white' }} />
                            <Link className='btn btn-danger mx-2' to={'/register'}>Cancel</Link>
                        </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    // pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
    )
}
