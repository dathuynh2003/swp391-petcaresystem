import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/auth.context'
import { useNavigate } from "react-router-dom";

export const Permission = ({ roleId, children, redirect }) => {
    const { user } = useAuth();
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (user !== null) {
            const isMatchRole = roleId.includes(user?.data.roleId.toString())
            console.log(roleId)
            console.log(user.data.roleId)
            console.log(isMatchRole)
            if (isMatchRole) {
                setRole(user.data.roleId)
            } else {
                if (redirect) {
                    navigate('/not-found')
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
