import React, { useEffect } from 'react'
import { useAuth } from '../context/auth.context'

export const Permission = ({ roleId }) => {
    const { user } = useAuth();

    console.log(roleId.includes(user?.roleId))
    console.log(user?.roleId)
    useEffect(() => {

    });

    return (
        <div>Per</div>
    )
}
