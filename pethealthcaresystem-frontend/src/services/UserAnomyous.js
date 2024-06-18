// UserAnonymous.js
import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import CreateAccountByStaff from './CreateAccountByStaff';
import CreatePetByStaff from './CreatePetByStaff';

export default function UserAnonymous() {
    return (
        <div className="container">
            <Tabs className="col-11 mt-3 mx-auto shadow p-3 mb-5 bg-body rounded h-100" colorScheme="teal">
                <TabList className="d-flex justify-content-between">
                    <Tab>Create User</Tab>
                    <Tab>Create Pet</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <CreateAccountByStaff />
                    </TabPanel>
                    <TabPanel>
                        <CreatePetByStaff />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}
