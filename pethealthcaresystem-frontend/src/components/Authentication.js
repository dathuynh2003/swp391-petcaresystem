import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const Authentication = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const getUser = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/getuser`, { withCredentials: true });
            setUser(result.data);
            setIsLoading(true);
        } catch (error) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('roleId')
            navigate("/login")
        }
    };
    getUser()
    return (
        <Fragment>
            {user !== null && isLoading &&
                <div>{children}</div>
            }
        </Fragment>
    )
}
