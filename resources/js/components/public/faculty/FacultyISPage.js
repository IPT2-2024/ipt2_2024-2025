import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard
import { Calendar } from 'antd'; // Import Calendar from antd

const { Content } = Layout; // Destructure Content from Layout


const FacultyPageDashboard = () => {
    return (
        <Content>
            <h1>This is a Faculty Page</h1>
        </Content>
    );
};
const FacultyPage = () => {
    return (
        <MainDashboard>
            <FacultyPageDashboard />
        </MainDashboard>
    );
};

export default FacultyPage;