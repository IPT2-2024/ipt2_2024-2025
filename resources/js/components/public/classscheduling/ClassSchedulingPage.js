import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout


const ClassSchedulingPageDashboard = () => {
    return (
        <Content>
            <h1>This is a ClassScheduling Page</h1>
        </Content>
    );
};
const ClassSchedulingPage = () => {
    return (
        <MainDashboard>
            <ClassSchedulingPageDashboard />
        </MainDashboard>
    );
};

export default ClassSchedulingPage;