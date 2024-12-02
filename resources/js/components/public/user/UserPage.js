import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard
import { Calendar } from 'antd'; // Import Calendar from antd

const { Content } = Layout; // Destructure Content from Layout


const UserPageDashboard = () => {
    return (
        <Content>
            <h1>This is a User Page</h1>
            <Calendar /> {/* Add Calendar component */}
        </Content>
    );
};
const UserPage = () => {
    return (
        <MainDashboard>
            <UserPageDashboard />
        </MainDashboard>
    );
};

export default UserPage;