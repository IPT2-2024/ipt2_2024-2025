import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card } from 'antd';
import axios from 'axios';
import MainDashboard from '../dashboard/components/MainDashboard';

const { Content } = Layout;

const EnlistmentManagerPageDashboard = () => {
    const [enlistments, setEnlistments] = useState([]);

    useEffect(() => {
        // Fetch the data from the Laravel API
        axios.get('/api/enlistments')  // Adjust the URL to match your backend route
            .then(response => {
                setEnlistments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the enlistments data!', error);
            });
    }, []);

    return (
        <Content style={{ padding: '20px' }}>
            <h1>This is an Enlistment Manager</h1>
            <Row gutter={16}>
                {enlistments.map((enlistment, index) => (
                    <Col span={8} key={index}>
                        <Card title={`Enlistment ${enlistment.id}`} bordered={false}>
                            <p>Name: {enlistment.name}</p>
                            <p>Status: {enlistment.status}</p>
                            {/* Display other enlistment data here */}
                        </Card>
                    </Col>
                ))}
            </Row>
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
