import React from 'react';
import { Layout } from "antd";
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout


const PostingManagementPageDashboard = () => {
    return (
        <Content>
            <h1>This is a Posting Management page</h1>
        </Content>
    );
};
const PostingManagementPage = () => {
    return (
        <MainDashboard>
            <PostingManagementPageDashboard />
        </MainDashboard>
    );
};

export default PostingManagementPage;