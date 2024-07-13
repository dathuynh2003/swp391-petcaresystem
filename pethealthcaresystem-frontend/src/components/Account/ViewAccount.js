import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Text, Spinner, Alert, AlertIcon, Heading, Flex, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { URL } from '../../utils/constant';
const ViewAccount = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${URL}/get-user-by-id/${userId}`);
                setUser(response.data.data);
            } catch (error) {
                setError('Error fetching user details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options); // en-GB ensures the format is DD/MM/YYYY
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box p={5} maxW="600px" mx="auto" boxShadow="lg" rounded="md" bg="white">
            <Flex alignItems="center" mb={4}>
                <Link to="/account">
                    <Button leftIcon={<ArrowBackIcon />} colorScheme="teal" variant="outline">
                        Back to Accounts
                    </Button>
                </Link>
                <Heading textAlign="center" as="h3" size="lg" ml={4}>
                    User Details
                </Heading>
            </Flex>

            {user ? (
                <Box>
                    <Flex mb={3}>
                        <Text fontWeight="bold" w="120px">
                            Full Name:
                        </Text>
                        <Text>{user.fullName}</Text>
                    </Flex>
                    <Flex mb={3}>
                        <Text fontWeight="bold" w="120px">
                            Address:
                        </Text>
                        <Text>{user.address}</Text>
                    </Flex>
                    <Flex mb={3}>
                        <Text fontWeight="bold" w="120px">
                            Email:
                        </Text>
                        <Text>{user.email}</Text>
                    </Flex>
                    <Flex mb={3}>
                        <Text fontWeight="bold" w="120px">
                            Role ID:
                        </Text>
                        <Text>{user.roleId}</Text>
                    </Flex>
                    <Flex mb={3}>
                        <Text fontWeight="bold" w="120px">
                            Status:
                        </Text>
                        <Text color={user.isActive ? 'green.500' : 'red.500'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                        </Text>
                    </Flex>
                    <Flex mb={3}>
                        <Text fontWeight="bold" w="120px">
                            Dob:
                        </Text>
                        <Text>{formatDate(user.dob)}</Text>
                    </Flex>
                </Box>
            ) : (
                <Text>No user found.</Text>
            )}
        </Box>
    );
};

export default ViewAccount;
