import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Switch,
  InputGroup,
  Input,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { SearchIcon, ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

const ListAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchAccounts();
  }, [page, filterRole]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/get-users-by-id/${filterRole || ''}`, {
        params: {
          pageNo: page,
          pageSize: 5,
        }
      });
      const data = response.data.data;
      setAccounts(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accounts:", error); // Log the error for debugging
      setError("Error fetching accounts. Please try again later.");
      setLoading(false);
    }
  };


  const handleSearch = async () => {
    if (!searchQuery) {
      fetchAccounts();
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/find-user-with-email", {
        params: { email: searchQuery }
      });
      setAccounts([response.data.data]);
    } catch (error) {
      console.error("Error searching for user:", error);
      toast({
        title: "Error",
        description: "User not found or there was an error.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this account?");
    if (!confirmed) return;

    try {
      await axios.put(`http://localhost:8080/delete-user-by-admin/${id}`);

      toast({
        title: "Account deleted.",
        description: "The account has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setAccounts(accounts.filter(account => account.userId !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the account.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (account) => {
    setSelectedUser(account);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/update-user-by-admin/${selectedUser.userId}`, {
        roleId: selectedUser.roleId,
        isActive: selectedUser.isActive
      });
      toast({
        title: "User updated.",
        description: "The user has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "There was an error updating the user.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setSelectedUser({
      ...selectedUser,
      [name]: newValue
    });
  };

  if (loading) {
    return <Box className="container"><Spinner /></Box>;
  }

  if (error) {
    return (
      <Box className="container">
        <Box className="alert alert-danger" role="alert">
          {error}
        </Box>
      </Box>
    );
  }

    <div className='container'>
      <ToastContainer />
      <Link to={'/createPet'}><Button className='mt-4' colorScheme='teal'>Add new Pet</Button></Link>
      <table className="table py-4 border-2 shadow  table-hover ">
        <thead className='p-4'>
          <tr >
            <th scope="col" className='p-3 text-center'>No</th>
            <th scope="col" className='p-3'>Avatar</th>
            <th scope="col" className='p-3'>Name</th>
            <th scope="col" className='p-3'>Type</th>
            <th scope="col" className='p-3'>Breed</th>
            <th scope="col" className='p-3'>Sex</th>
            <th scope="col" className='p-3'>Age</th>
            <th scope="col" className='p-3'>Neutered</th>
            <th scope="col" className='p-3'>Description</th>
            <th scope="col" className='col-2 text-center'>Action</th>
          </tr>
        </thead>
        <tbody className="table-group-divider p-4">
          {

            pets.map((pet, index) => (
              <tr key={index} >
                <td className='pl-4 text-center'>{index + 1}</td>
                <td className="col-1 p-2">
                  <img src={pet.avatar} alt={pet.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                </td>
                <td className="col-1 p-2">{pet.name}</td>
                <td className="col-1 p-2">{pet.petType}</td>
                <td className="col-1 p-2">{pet.breed}</td>
                <td className="col-1 p-2">{pet.gender}</td>
                <td className="col-1 p-2">{pet.age}</td>
                <td className="col-1 p-2">{pet.isNeutered ? 'Yes' : 'No'}</td>
                <td className="col-2 p-2">{pet.description}</td>
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
                </Link>
                <span style={{ marginRight: '20px' }} className='icon-container'>
                  <EditIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} onClick={() => handleEdit(account)} />
                  <span className="icon-text">Edit</span>
                </span>
                <span className='icon-container'>
                  <DeleteIcon
                    style={{ color: 'red', cursor: 'pointer' }}
                    boxSize={'5'}
                    onClick={() => {
                      setSelectedUser(account.userId);  // Assuming `account` is defined somewhere
                      setIsModalOpen(true);      // Open the modal
                    }}
                  />
                  <span className="icon-text">Delete</span>
                </span>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={4}>
        <Button onClick={() => setPage(page - 1)} isDisabled={page <= 0}>Previous</Button>
        <Button onClick={() => setPage(page + 1)} isDisabled={page >= totalPages - 1} ml={2}>Next</Button>
      </Box>

      {selectedUser && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this account?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ListAccount;
