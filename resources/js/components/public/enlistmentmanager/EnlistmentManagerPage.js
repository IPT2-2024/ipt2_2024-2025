import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  

const { Content } = Layout; 


const EnlistmentManagerPageDashboard = () => {
    return (
        <Content>
            <h1>This is a EnlistmentManager</h1>
        </Content>
    );
};
const EnlistmentManagerPage = () => {
    return (
        <MainDashboard>
            <EnlistmentManagerPageDashboard />
        </MainDashboard>
    );
};

export default EnlistmentManagerPage;