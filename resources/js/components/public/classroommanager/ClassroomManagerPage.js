import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout


const ClassroomManagerPageDashboard = () => {
    return (
        <Content>
            <h1>This is a Classroom Manager page</h1>
        </Content>
    );
};
const ClassroomManagerPage = () => {
    return (
        <MainDashboard>
            <ClassroomManagerPageDashboard />
        </MainDashboard>
    );
};

export default ClassroomManagerPage;