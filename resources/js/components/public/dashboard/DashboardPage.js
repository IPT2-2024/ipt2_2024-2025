import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic, Breadcrumb, Typography, Divider, Spin } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import axios from 'axios'; // Import axios for API requests
import MainDashboard from '../dashboard/components/MainDashboard'; // Import MainDashboard
import { useLocation } from 'react-router-dom'; // For route-based dynamic breadcrumb

const { Content } = Layout; // Destructure Content from Layout
const { Title } = Typography; // Destructure Title from Typography

const DashboardPageDashboard = () => {
    const [data, setData] = useState(null); // State to store API response data
    const [currentSection, setCurrentSection] = useState('Analytics'); // Default section
    const [loading, setLoading] = useState(true); // State for loading indicator
    const location = useLocation(); // Get current route location

    // Fetch data from an API (for example, fetching analytics-related data)
    const fetchData = async () => {
        try {
            setLoading(true); // Set loading to true when starting the fetch
            const response = await axios.get('/api/analytics'); // Replace with your actual API URL
            setData(response.data); // Update state with the API response
        } catch (error) {
            console.error("There was an error fetching data:", error);
        } finally {
            setLoading(false); // Set loading to false when the fetch is complete
        }
    };

    // Update current section based on route or API response
    useEffect(() => {
        // Dynamically set the current section based on the path (could be Analytics, Announcement, Reports)
        const section = location.pathname.split("/").pop();
        setCurrentSection(section.charAt(0).toUpperCase() + section.slice(1)); // Capitalize first letter

        // Fetch data when the section changes
        fetchData();
    }, [location]);

    return (
        <Content style={{ padding: '20px' }}>
            {/* Dashboard Label */}
            <Title level={1} style={{ marginBottom: '18px' }}>Analytics</Title>

            {/* Breadcrumb with Dynamic Highlighting */}
            <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item style={{ color: currentSection === "Announcement" ? '#3f7afc' : 'gray' }}>Announcement</Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: currentSection === "Reports" ? '#3f7afc' : 'gray' }}>Reports</Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: currentSection === "Analytics" ? '#3f7afc' : 'gray' }}>Analytics</Breadcrumb.Item>
            </Breadcrumb>

            {/* Divider (Boundary) between Breadcrumb and Analytics */}
            <Divider style={{ margin: '20px 0' }} />

            {/* Analytics Title */}
            <Title level={2} style={{ marginBottom: '20px' }}>{currentSection}</Title>

            {/* Spinner for Loading */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                // Analytics Container
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card
                            hoverable
                            bordered={false}
                            style={{ textAlign: 'center', backgroundColor: '#e6f7ff' }}
                        >
                            <Statistic
                                title="Total Enrolled Students"
                                value={data.enrolledStudents}
                                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                                style={{ fontSize: '18px', color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card
                            hoverable
                            bordered={false}
                            style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}
                        >
                            <Statistic
                                title="Total Instructors"
                                value={data.totalInstructors}
                                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                                style={{ fontSize: '18px', color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card
                            hoverable
                            bordered={false}
                            style={{ textAlign: 'center', backgroundColor: '#fff2e8' }}
                        >
                            <Statistic
                                title="Total Courses"
                                value={data.totalCourses}
                                prefix={<FileTextOutlined style={{ color: '#ff4d4f' }} />}
                                style={{ fontSize: '18px', color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card
                            hoverable
                            bordered={false}
                            style={{ textAlign: 'center', backgroundColor: '#fff7e6' }}
                        >
                            <Statistic
                                title="Total Users"
                                value={data.totalUsers}
                                prefix={<AppstoreAddOutlined style={{ color: '#faad14' }} />}
                                style={{ fontSize: '18px', color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </Content>
    );
};

const DashboardPage = () => {
    return (
        <MainDashboard>
            <DashboardPageDashboard />
        </MainDashboard>
    );
};

export default DashboardPage;
