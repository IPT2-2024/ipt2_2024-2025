import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard
import { Calendar } from 'antd'; // Import Calendar from antd

const { Content } = Layout; // Destructure Content from Layout


const StudentISPageDashboard = () => {
    return (
        <Content>
            <h1>This is a Student</h1>
        </Content>
    );
};
const StudentISPage = () => {
    return (
        <MainDashboard>
            <StudentISPageDashboard />
        </MainDashboard>
    );
};

export default StudentISPage;