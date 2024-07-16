import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Avatar,
  Box,
  Tooltip
} from '@chakra-ui/react'
import { ToastContainer, toast } from 'react-toastify'
import { URL } from '../utils/constant';
export default function ListPets() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [pets, setPets] = useState([])

  const loadPets = async () => {
    const response = await axios.get(`${URL}/pet`, { withCredentials: true })
    setPets(response.data)
  }

  useEffect(() => {
    loadPets()
  }, [])

  const deletePet = async (petId) => {
    try {
      const response = await axios.put(`${URL}/deletePet/${petId}`)
      toast.success(response.data)
      onClose()
    } catch (error) {
      toast.error(error)
    }

    loadPets()
  }

  return (
    <div className='container'>
      <ToastContainer />
      <Link to={'/createPet'}><Button className='mt-4 mb-3' colorScheme='teal'>Add new Pet</Button></Link>
      <table className="table py-4 border-2 shadow  table-hover ">
        <thead className='p-4'>
          <tr >
            <th scope="col" className='p-3 text-center'>No</th>
            <th scope="col" className='p-3'>Avatar</th>
            <th scope="col" className='p-3'>Name</th>
            <th scope="col" className='p-3'>Type</th>
            <th scope="col" className='p-3'>Breed</th>
            <th scope="col" className='p-3'>Sex</th>
            <th scope="col" className='py-3 px-4'>Age</th>
            <th scope="col" className='p-3'>Neutered</th>
            <th scope="col" className='p-3'>Description</th>
            <th scope="col" className='col-2 text-center p-3'>Action</th>
          </tr>
        </thead>
        <tbody className="table-group-divider p-4">
          {
            pets.map((pet, index) => {
              const today = new Date();
              const dob = new Date(pet.dob);
              // console.log(dob);
              // Tính số tháng chênh lệch giữa hai ngày
              const diffMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
              const age = diffMonths !== 0 ? diffMonths : 1;
              // const age = 0
              return (
                <tr key={index}  >
                  <td className='pl-4 text-center'>{index + 1}</td>
                  <td className="col-1 ">
                    <Avatar src={pet.avatar} alt={pet.name} />
                  </td>
                  <td className="col-1 p-2">{pet.name}</td>
                  <td className="col-1 p-2 px-3">{pet.petType}</td>
                  <td className="col-1 p-2 px-3">{pet.breed ? pet.breed : 'N/A'}</td>
                  <td className="col-1 p-2">{pet.gender}</td>
                  <td className="col-1 py-2">{age} month(s)</td>
                  <td className="col-1 py-2 px-4">{pet.isNeutered ? 'Yes' : 'No'}</td>
                  <td className="col-2 p-2">
                    <Tooltip label={pet.description ? pet.description : 'N/A'} placement="top" hasArrow>
                      <Box
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        maxWidth="150px"
                      >
                        {pet.description ? pet.description : 'N/A'}
                      </Box>
                    </Tooltip>
                  </td>
                  <td className='col-2 text-center p-2'>
                    <Link to={`/viewPet/${pet.petId}`}>
                      <span style={{ marginRight: '20px' }} className='icon-container'>
                        <ViewIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} />
                        <span className="icon-text">View</span>
                      </span>
                    </Link>
                    <Link to={`/editPet/${pet.petId}`}>
                      <span style={{ marginRight: '20px' }} className='icon-container'>
                        <EditIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} />
                        <span className="icon-text">Edit</span>
                      </span>
                    </Link>
                    <span className='icon-container'>
                      <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} boxSize={'5'} onClick={onOpen} />
                      <span className="icon-text">Delete</span>
                    </span>
                    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Delete pet</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                          Are you sure delete this pet?
                        </ModalBody>
                        <ModalFooter>
                          <Button colorScheme='red' mr={3} onClick={() => deletePet(pet.petId)}>
                            Delete
                          </Button>
                          <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}


