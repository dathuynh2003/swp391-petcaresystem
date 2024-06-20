import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, Spinner, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Select, Switch } from '@chakra-ui/react';

const ListAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/get-users-by-id", {
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
                console.error("Error fetching accounts:", error);
                setError("Error fetching accounts. Please try again later.");
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [page]);

    const handleDelete = async (id) => {
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
            // Refresh the accounts list
            const response = await axios.get("http://localhost:8080/get-users-by-id", {
                params: {
                    pageNo: page,
                    pageSize: 5,
                }
            });
            setAccounts(response.data.data.content);
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

    return (
        <Box className="container">
            <Link to="/account/create">
                <Button colorScheme="blue" mb={3}>Add New Account</Button>
            </Link>
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Full Name</Th>
                        <Th>Role ID</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {accounts.map((account, index) => (
                        <Tr key={index}>
                            <Td><b>{index + 1}</b></Td>
                            <Td><b>{account.fullName}</b></Td>
                            <Td><b>{account.roleId}</b></Td>
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
                            <Td>
                                <Button colorScheme="blue" size="sm" mr={2} onClick={() => handleEdit(account)}>Edit</Button>
                                <Button colorScheme="red" size="sm" onClick={() => handleDelete(account.userId)}>Delete</Button>
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
    );
};

export default ListAccount;
