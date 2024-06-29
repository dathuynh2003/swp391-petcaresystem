import React, { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthProvider from '../context/auth.context'
import ListAccount from '../components/Account/ListAccount'
import CreateAccount from '../components/Account/CreateAccount'
import EditAccount from '../components/Account/EditAccount'
import { Permission } from '../components/Permission'
import ViewAccount from '../components/Account/ViewAccount'
import PaymentResult from '../services/Booking/PaymentResult'

const AccountPage = () => {
    return (

        <AuthProvider>
            <Permission roleId={['4']} redirect={true}>
                <Routes>
                    <Route path="/" element={<ListAccount />} />
                    <Route path="/viewAccount/:userId" element={<ViewAccount />} />
                    <Route path='/create' element={<CreateAccount />} />
                    <Route path="/edit/:userId" element={<EditAccount />} />
                </Routes>
            </Permission>
        </AuthProvider>
    )
}

export default AccountPage