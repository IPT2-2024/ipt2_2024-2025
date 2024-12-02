import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout


const TermsManagementPageDashboard = () => {
    return (
        <Content>
            <h1>This is a Terms manager Page</h1>
        </Content>
    );
};
const TermsManagementPage = () => {
    return (
        <MainDashboard>
            <TermsManagementPageDashboard />
        </MainDashboard>
    );
};

export default TermsManagementPage;