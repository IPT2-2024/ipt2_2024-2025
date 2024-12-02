import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout


const ProgramsManagerManagementPageDashboard = () => {
    return (
        <Content>
            <h1>This is a Programs manager Page</h1>
        </Content>
    );
};
const ProgramsManagerManagementPage = () => {
    return (
        <MainDashboard>
            <ProgramsManagerManagementPageDashboard />
        </MainDashboard>
    );
};

export default ProgramsManagerManagementPage;