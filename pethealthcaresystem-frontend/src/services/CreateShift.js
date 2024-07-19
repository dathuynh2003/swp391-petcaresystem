import { Link, useNavigate } from "react-router-dom";
import { URL } from '../utils/constant';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateShift = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shifts, setShifts] = useState([]);
  const [newShift, setNewShift] = useState({
    from_time: '',
    to_time: '',
  });

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${URL}/shifts/all`, { withCredentials: true });
      if (response.data) {
        setShifts(response.data);
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Failed to fetch shifts');
    }
  };

  const addShift = async () => {
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!newShift.from_time || !newShift.to_time) {
      toast.error('Please fill in both fields');
      return;
    }

    if (!timeFormat.test(newShift.from_time) || !timeFormat.test(newShift.to_time)) {
      toast.error('Invalid time format. Please use HH:mm format.');
      return;
    }

    const fromTime = new Date(`1970-01-01T${newShift.from_time}:00`);
    const toTime = new Date(`1970-01-01T${newShift.to_time}:00`);

    if (fromTime >= toTime) {
      toast.error('From Time must be before To Time');
      return;
    }

    // Check for overlap with existing shifts
    const isExisted = shifts.some((shift) => {
      const existingFromTime = new Date(`1970-01-01T${shift.from_time}:00`);
      const existingToTime = new Date(`1970-01-01T${shift.to_time}:00`);

      return (fromTime < existingToTime && toTime > existingFromTime);
    });


    if (isExisted) {
      toast.error('This shift is existed.');
      return;
    }
    try {
      const response = await axios.post(`${URL}/shifts/add`, newShift, { withCredentials: true });
      if (response.data) {
        toast.success('Shift added successfully');
        fetchShifts();
        onClose();
      }
    } catch (error) {
      console.error('Error adding shift:', error);
      toast.error('Failed to add shift');
    }
  };

  const deleteShift = async (shiftId) => {
    try {
      const response = await axios.delete(`${URL}/shifts/delete/${shiftId}`, { withCredentials: true });
      if (response.data) {
        toast.success('Shift deleted successfully');
        fetchShifts();
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
      toast.error('Failed to delete shift');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShift({ ...newShift, [name]: value });
  };

  return (
    <div className='container'>
      <Button colorScheme="teal" onClick={onOpen} mt={4}>
        Add New Shift
      </Button>

      <table className="table table-hover shadow mt-5">
        <thead >
          <tr className='text-center '>
            <th className="col-1"> No</th>
            <th className="col-2">From Time</th>
            <th className="col-3">To Time</th>
            <th className='col-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {shifts?.map((shift, index) => (
            <tr key={index} className='text-center item'>
              <td>{index + 1}</td>
              <td>{shift.from_time}</td>
              <td>{shift.to_time}</td>
              <td className=''>
                <span className='icon-container'>
                  <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteShift(shift.shiftId)} />
                  <span className="icon-text">Delete</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Shift</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <label>
                From Time:
                <input type="text" name="from_time" value={newShift.from_time} placeholder='HH:mm' onChange={handleChange} />
              </label>
              <br />
              <label>
                To Time:
                <input type="text" name="to_time" value={newShift.to_time} placeholder='HH:mm' onChange={handleChange} />
              </label>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={addShift}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
        theme="light"
      />
    </div>
  );
};

export default CreateShift;
