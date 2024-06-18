

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthProvider from '../context/auth.context'
import ListAccount from '../components/Account/ListAccount'
import CreateAccount from '../components/Account/CreateAccount'
import EditAccount from '../components/Account/EditAccount'
import { Permission } from '../components/Permission'

const AccountPage = () => {
    return (
        <AuthProvider>
            {/* <Permission roleId={['4']}> */}
            <Routes>
                <Route path="/account" element={<ListAccount />} />
                <Route path='/account/create' element={<CreateAccount />} />
                <Route path="/account/edit/:userId" element={<EditAccount />} />
            </Routes>
            {/* </Permission> */}
        </AuthProvider>
    )
}

export default AccountPage