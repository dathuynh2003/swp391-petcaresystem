import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import { URL } from '../../utils/constant';
const CreateAccount = () => {
    let navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        avatar: "",
        gender: "",
        dob: "",
        roleId: 3,
    });

    const [messageEmail, setMessageEmail] = useState('');
    const [messagePass, setMessagePass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const { fullName, phoneNumber, address, gender, dob, email, password } = user;
    const toast = useToast();

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessageEmail("");
        if (password !== confirmPass) {
            setMessagePass("Confirm password does not match");
            return;
        }

        try {
            await axios.post(`${URL}/create-user-by-admin`, user);
            toast({
                title: "Account created.",
                description: "The user account has been created successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate('/account');
        } catch (error) {
            toast({
                title: "Error.",
                description: error?.response?.data?.errorMessage ?? error?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    const handleSubmit = () => {
        // Perform any submit actions here, e.g., form submission, API call

        // After successful submission, navigate back to '/list-account'
        navigate('/account');
    };

    return (
        <Container maxW="container.sm" py={4} px={2}>
            <Box p={4} boxShadow="md" bg="white" borderRadius="md">
                <Heading as="h1" size="md" mb={4} textAlign="center">
                    Registration Form
                </Heading>
                <form onSubmit={handleRegister}>
                    <Stack spacing={3}>
                        <FormControl id="fullName">
                            <FormLabel>Full Name</FormLabel>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                name="fullName"
                                value={fullName}
                                onChange={onInputChange}
                            />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={onInputChange}
                            />
                        </FormControl>
                        <FormControl id="address">
                            <FormLabel>Address</FormLabel>
                            <Textarea
                                placeholder="Address"
                                rows="2"
                                name="address"
                                value={address}
                                onChange={onInputChange}
                            />
                        </FormControl>
                        <Stack direction={['column', 'row']} spacing={3}>
                            <FormControl id="phoneNumber">
                                <FormLabel>Phone Number</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Phone Number"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={onInputChange}
                                />
                            </FormControl>
                            <FormControl id="dob">
                                <FormLabel>Date of Birth</FormLabel>
                                <Input
                                    type="date"
                                    name="dob"
                                    value={dob}
                                    onChange={onInputChange}
                                />
                            </FormControl>
                        </Stack>
                        <Stack direction={['column', 'row']} spacing={3}>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={onInputChange}
                                />
                            </FormControl>
                            <FormControl id="confirmPass">
                                <FormLabel>Confirm Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirmPass"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                />
                            </FormControl>
                        </Stack>
                        <FormControl id="gender">
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup value={gender} onChange={(value) => setUser({ ...user, gender: value })}>
                                <Stack direction="row" justify="space-between">
                                    <Radio value="Male">Male</Radio>
                                    <Radio value="Female">Female</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl id="roleId">
                            <FormLabel>Role</FormLabel>
                            <Select
                                name="roleId"
                                value={user.roleId}
                                onChange={onInputChange}
                            >
                                <option value="2">Staff</option>
                                <option value="3">Vet</option>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="md"
                            width="full"
                            // onClick={handleSubmit} // Call handleSubmit function on button click
                        >
                            Submit
                        </Button>
                        <Box textAlign="center">
                            {messagePass && <Text color="red.500">{messagePass}</Text>}
                            {messageEmail && <Text color="red.500">{messageEmail}</Text>}
                        </Box>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
};

export default CreateAccount;
