import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Layout, Row, Col, Input, Tabs, Spin, Alert, Card, Button } from 'antd'; 
import { debounce } from 'lodash'; 
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import TeacherTimetable from './TeacherTimetable'; 
import TeacherProfiles from './TeacherProfiles'; 
import TeacherAssignment from './TeacherAssignment'; 

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

const FacultyPageDashboard = () => {
    const [searchQuery, setSearchQuery] = useState(''); 
    const [teachers, setTeachers] = useState([]); 
    const [timetable, setTimetable] = useState([]); 
    const [assignments, setAssignments] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const navigate = useNavigate();  // Initialize navigate hook for redirection
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); 

                const teacherResponse = await axios.get('https://api.example.com/teachers'); 
                setTeachers(teacherResponse.data);

                const timetableResponse = await axios.get('https://api.example.com/timetable'); 
                setTimetable(timetableResponse.data);

                const assignmentsResponse = await axios.get('https://api.example.com/assignments'); 
                setAssignments(assignmentsResponse.data);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, []); 

    const handleSearchChange = debounce((value) => {
        setSearchQuery(value); 
    }, 500); 

    return (
        <Content style={{ padding: '20px', minHeight: '280px' }}>
            <h3 style={{ marginBottom: '14px' }}>Faculty Information System</h3>
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={20}>
                    <Search
                        placeholder="Search for profiles, timetable, or assignments"
                        onSearch={handleSearchChange} 
                        onChange={(e) => handleSearchChange(e.target.value)} 
                        value={searchQuery}
                        enterButton="Search"
                        size="large"  
                        style={{
                            width: '100%',  
                            maxWidth: '600px', 
                        }}
                    />
                </Col>
                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={() => navigate('/add-faculty')} 
                        style={{ width: '100%' }}
                    >
                        Add Teacher
                    </Button>
                </Col>
            </Row>

            {loading && (
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            )}

            {error && <Alert message={error} type="error" showIcon />}

            <Tabs defaultActiveKey="1">
                <TabPane tab="Teacher Profiles" key="1">
                    <Row gutter={[16, 16]}>
                        {teachers
                            .filter(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(teacher => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    xl={4}
                                    key={teacher.id}
                                    style={{
                                        padding: '8px', 
                                    }}
                                >
                                    <Card
                                        hoverable
                                        title={teacher.name}
                                        extra={<a href="#">More</a>}
                                        style={{
                                            width: '100%',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                                        }}
                                    >
                                        <p>{teacher.subject}</p>
                                        <p>{teacher.email}</p>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </TabPane>

                <TabPane tab="Teacher Timetable" key="2">
                    <TeacherTimetable timetable={timetable} searchQuery={searchQuery} />
                </TabPane>

                <TabPane tab="Teacher Assignments" key="3">
                    <TeacherAssignment assignments={assignments} searchQuery={searchQuery} />
                </TabPane>
            </Tabs>
        </Content>
    );
};

export default FacultyPageDashboard;