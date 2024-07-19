import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
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
  IconButton,
  Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SearchIcon, ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { URL } from '../../utils/constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState(0); // Default role filter value is 0 for All

  useEffect(() => {
    fetchAccounts();
  }, [page, roleFilter]); // Trigger fetchAccounts() when page or roleFilter changes

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      let url = `${URL}/get-users-by-id/${roleFilter}?pageNo=${page}&pageSize=5`;
      const response = await axios.get(url);
      const data = response.data.data;
      setAccounts(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching accounts:", error);
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
      const response = await axios.get(`${URL}/find-user-with-email`, {
        params: { email: searchQuery }
      });
      setAccounts([response.data.data]);
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Error searching for user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`${URL}/delete-user-by-admin/${id}`);

      toast.success("The account has been successfully deleted.")
      setAccounts(accounts.filter(account => account.userId !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("There was an error deleting the account.");
    }
  };

  const handleEdit = (account) => {
    setSelectedUser(account);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/update-user-by-admin/${selectedUser.userId}`, {
        roleId: selectedUser.roleId,
        isActive: selectedUser.isActive
      });
      toast.success("The user has been successfully updated.");
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("There was an error updating the user.");
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

  return (
    <div className='container'>
      <div className='row'>
        <div className='mt-3 d-flex justify-content-between'>
          <Box className="container">
            <Link to="/account/create">
              <Button colorScheme="teal" ml={0} >Add New Account</Button>
            </Link>
            <Flex mb={4} justify="space-between" align="center">
              <Box>
                <FormControl>
                  <Select
                    id="roleFilter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(parseInt(e.target.value))}
                  >
                    <option value={0}>All</option>
                    <option value={1}>Customer</option>
                    <option value={2}>Staff</option>
                    <option value={3}>Vet</option>
                  </Select>
                </FormControl>
              </Box>
              <InputGroup width="300px">
                <Input
                  placeholder="Search by email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    icon={<SearchIcon />}
                    onClick={handleSearch}
                  />
                </InputRightElement>
              </InputGroup>
            </Flex>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Full Name</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accounts.map((account, index) => (
                  <Tr key={index}>
                    <Td><b>{index + 1 + page * 5}</b></Td>
                    <Td><b>{account.fullName}</b></Td>
                    <Td>
                      <b>
                        {account.roleId === 1 && "Customer"}
                        {account.roleId === 2 && "Staff"}
                        {account.roleId === 3 && "Vet"}
                        {account.roleId === 4 && "Admin"}
                      </b>
                    </Td>
                    <Td>
                      <Button
                        colorScheme={account.isActive ? 'green' : 'red'}
                        variant="outline"
                        borderColor={account.isActive ? 'green.500' : 'red.500'}
                        bg={account.isActive ? 'green.100' : 'red.100'}
                        size="sm"
                      >
                        {account.isActive ? "Active" : "Inactive"}
                      </Button>
                    </Td>
                    <Td className='col-2 text-center p-2'>
                      <Link to={`/account/viewAccount/${account.userId}`}>
                        <span style={{ marginRight: '20px' }} className='icon-container'>
                          <ViewIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} />
                          <span className="icon-text">View</span>
                        </span>
                      </Link>
                      <span style={{ marginRight: '20px' }} className='icon-container'>
                        <EditIcon style={{ color: 'teal', cursor: 'pointer' }} boxSize={'5'} onClick={() => handleEdit(account)} />
                        <span className="icon-text">Edit</span>
                      </span>
                      <span className='icon-container'>
                        <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} boxSize={'5'} onClick={() => handleDelete(account.userId)} />
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

            {/* Modal for editing account */}
            {selectedUser && (
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Edit Account</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl id="roleId" mb={4}>
                      <FormLabel>Role</FormLabel>
                      <Select name="roleId" value={selectedUser.roleId} onChange={onInputChange}>
                        <option value="1">Customer</option>
                        <option value="2">Vet</option>
                        <option value="3">Staff</option>
                      </Select>
                    </FormControl>
                    <FormControl id="isActive" display="flex" alignItems="center" mb={4}>
                      <Switch
                        id="isActiveSwitch"
                        name="isActive"
                        isChecked={selectedUser.isActive}
                        onChange={onInputChange}
                        mr={2}
                      />
                      <FormLabel htmlFor="isActiveSwitch" mb="0">Active Status</FormLabel>
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleUpdate}>Update</Button>
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
          </Box>

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
    </div >
  );
};

export default ListAccount;
