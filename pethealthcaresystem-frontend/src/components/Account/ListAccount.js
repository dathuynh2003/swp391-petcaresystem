import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Spinner, useToast } from '@chakra-ui/react';

const ListAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
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
            // Reload accounts after successful deletion
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
                <Button colorScheme="blue" mb={3} size="sm">Add New Account</Button>
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
                                    size="sm" // Make the isActive button smaller
                                >
                                    {account.isActive ? "Active" : "Inactive"}
                                </Button>
                            </Td>
                            <Td>
                                <Link to={`/edit-account/${account.userId}`}>
                                    <Button colorScheme="blue" size="sm" mr={2}>Edit</Button>
                                </Link>
                                <Button colorScheme="red" size="sm" onClick={() => handleDelete(account.userId)}>Delete</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <Box mt={4}>
                <Button 
                    onClick={() => setPage(page - 1)} 
                    isDisabled={page <= 0}
                    size="sm" // Make the pagination buttons smaller
                >
                    Previous
                </Button>
                <Button 
                    onClick={() => setPage(page + 1)} 
                    isDisabled={page >= totalPages - 1}
                    ml={2}
                    size="sm" // Make the pagination buttons smaller
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default ListAccount;
