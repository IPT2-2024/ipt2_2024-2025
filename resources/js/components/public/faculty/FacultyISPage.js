import React from 'react';
import MainDashboard from '../dashboard/components/MainDashboard'; 
import FacultyPageDashboard from './components/FacultyPageDashboard';
import { Layout, Tabs } from 'antd';

const { Content } = Layout;
const { TabPane } = Tabs;

const FacultyPage = () => {
    return (
        <MainDashboard>
            <FacultyPageDashboard />
           
        </MainDashboard>
    );
};

export default FacultyPage;
