import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/auth.context'
import { useNavigate } from "react-router-dom";

export const Permission = ({ roleId, children, redirect }) => {
    const { user } = useAuth();
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (user !== null) {

            if (user.data.roleId === 4) {
                setRole(user.data.roleId)
            }
            else {
                const isMatchRole = roleId.includes(user?.data.roleId.toString())
                if (isMatchRole) {
                    setRole(user.data.roleId)
                } else {
                    if (redirect) {
                        navigate('/not-found')
                    }
                }
            }
        }
    }, [user]);

    return (
        <div>
            {role && children}
        </div>
    )
}
