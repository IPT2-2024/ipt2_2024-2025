import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Space, Dropdown, Menu, Typography, message, Modal, Row, Col, Spin, Popconfirm, Pagination } from 'antd';
import { FilterOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useMediaQuery } from 'react-responsive';
import StudentTable from './components/StudentTable'; // Your table component
import StudentCreateModal from './components/StudentCreateModal'; // Your Create Modal
import MainDashboard from '../dashboard/components/MainDashboard';

const { Text } = Typography;

const StudentISPage = () => {
    const [data, setData] = useState([]); // Raw data
    const [filteredData, setFilteredData] = useState([]); // Filtered data
    const [roles, setRoles] = useState([]); // Available roles for filter
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [searchValue, setSearchValue] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [showArchived, setShowArchived] = useState(false);
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    useEffect(() => {
        if (data.length > 0) {
            filterData();
        }
    }, [data, searchValue, selectedRole, selectedStatus]);
        

    const fetchData = async () => {
        console.log('Fetching Data...');
        setLoadingProfiles(true);  // Start loading
        try {
            // Retrieve the auth_token from local storage
            const authToken = localStorage.getItem('auth_token');
    
            // Check if the auth_token exists
            if (!authToken) {
                message.error('Authorization token not found');
                return;
            }
    
            // Make the API request with the auth_token in the Authorization header
            const response = await axios.get('/api/profiles/students/only', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,  // Attach the token as a Bearer token
                },
            });
    
            // Check if the response contains student data
            if (response.data && response.data.length > 0) {
                setData(response.data);  // Store the student data
                setFilteredData(response.data);  // Update filtered data as well
            } else {
                message.warning('No student data found.');
            }
        } catch (error) {
            // Specific error handling based on the error type
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    message.error(`Error: ${error.response.status} - ${error.response.data.message || 'Unable to fetch student data.'}`);
                    console.error('Response error:', error.response);
                } else if (error.request) {
                    // The request was made but no response was received
                    message.error('No response received from server.');
                    console.error('Request error:', error.request);
                } else {
                    // Something else went wrong
                    message.error(`An error occurred: ${error.message}`);
                    console.error('Axios error:', error.message);
                }
            } else {
                // General JavaScript error (e.g., coding issues)
                message.error('Unexpected error occurred while fetching data.');
                console.error('Unexpected error:', error);
            }
        } finally {
            setLoadingProfiles(false);  // Stop loading
        }
    };
    
    


    useEffect(() => {
        fetchData();
        // fetchRoles();
    }, [currentPage, pageSize]);
    

    const filterData = useCallback(() => {
        console.log('Filtering data...');
        let filtered = data.filter((student) => {
            const matchesSearch = student.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                                  student.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                                  student.school_email.toLowerCase().includes(searchValue.toLowerCase());
            const matchesRole = selectedRole === 'All' || student.role_name === selectedRole;
            const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;
    
            return matchesSearch && matchesRole && matchesStatus;
        });
    
        setFilteredData(filtered); // Set the filtered data
    }, [searchValue, selectedRole, selectedStatus, data]);
    
    

    const debouncedFilter = useCallback(debounce(filterData, 300), [filterData]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        debouncedFilter();
    };

    const roleMenu = (
        <Menu>
            {roles.map((role) => (
                <Menu.Item key={role.id} onClick={() => setSelectedRole(role.name)}>
                    {role.name}
                </Menu.Item>
            ))}
        </Menu>
    );

    const handleRemoveSelected = () => {
        console.log('Removing selected students:', selectedRowKeys);
    };

    const handleRestoreSelected = () => {
        console.log('Restoring selected students:', selectedRowKeys);
    };

    const resetFilters = () => {
        setSearchValue('');
        setSelectedRole('All');
        setSelectedStatus('All');
        setFilteredData(data); 
    };

    const handleArchiveToggle = () => {
        setShowArchived(!showArchived);
        fetchData(); 
    };

    const handleCreateModalOpen = () => {
        setIsCreateModalVisible(true);
    };

    // Pagination change handler
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchData();  // Fetch new data when page changes
    };

    // Calculate data for the current page
    const paginatedData = filteredData && filteredData.length > 0
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : []; // Fallback to empty array if filteredData is empty or undefined

    return (
        <MainDashboard>
            <div className="students-page">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <h3>Students Management</h3>
                    <Row gutter={[16, 16]} justify="space-between" align="middle">
                        <Col xs={24} sm={24} md={12}>
                            <Space wrap>
                                <Input.Search
                                    value={searchValue}
                                    placeholder="Search by username, role, or email"
                                    style={{ width: '100%', maxWidth: 300 }}
                                    onSearch={debouncedFilter}
                                    onChange={handleSearchChange}
                                    allowClear
                                />
                                <Dropdown overlay={roleMenu} trigger={['click']}>
                                    <Button icon={<FilterOutlined />}>
                                        {selectedRole === 'All' ? 'Filter by Role' : `Role: ${selectedRole}`}
                                    </Button>
                                </Dropdown>
                                <Button
                                    icon={<FileTextOutlined />}
                                    onClick={handleArchiveToggle}
                                >
                                    {showArchived ? 'View Active Users' : 'View Archived Users'}
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} sm={24} md={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleCreateModalOpen}
                                >
                                    Create New
                                </Button>
                                <Popconfirm
                                    title="Are you sure to remove this student?"
                                    onConfirm={handleRemoveSelected}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button disabled={selectedRowKeys.length === 0}>
                                        Remove
                                    </Button>
                                </Popconfirm>
                                {showArchived && (
                                    <Popconfirm
                                        title="Are you sure to restore this user/s?"
                                        onConfirm={handleRestoreSelected}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="default" disabled={selectedRowKeys.length === 0}>
                                            Restore Selected
                                        </Button>
                                    </Popconfirm>
                                )}
                            </Space>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Button
                                onClick={resetFilters}
                                disabled={searchValue === '' && selectedRole === 'All'}
                                style={{ marginTop: 10 }}
                            >
                                Reset Filters
                            </Button>
                        </Col>
                    </Row>

                    {selectedRowKeys.length > 0 && (
                        <Text strong style={{ marginBottom: '1px', display: 'block' }}>
                            {selectedRowKeys.length} item(s) selected
                        </Text>
                    )}

                    {/* Pagination at the top-right of the table */}
                    <Row justify="end" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Pagination
                                current={currentPage}
                                total={filteredData.length}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                showQuickJumper={false}
                                showSizeChanger={false}
                                itemRender={(current, type, originalElement) => {
                                    if (type === 'page') {
                                        return <a style={{ border: '1px solid blue', padding: '0 10px' }}>{current}</a>;
                                    }
                                    return originalElement;
                                }}
                            />
                        </Col>
                    </Row>

                    {/* Student Table */}
                    {loading ? (
                        <div style={{ textAlign: 'center' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <StudentTable
                            rowSelection={{
                                selectedRowKeys,
                                onChange: setSelectedRowKeys,
                            }}
                            data={paginatedData}  // Display only the paginated data
                            loading={loading}
                            fetchData={fetchData}
                            setLoadingProfiles={setLoadingProfiles}  // Pass setLoadingProfiles as a prop
                        />

                    )}

                </Space>

                <StudentCreateModal
                    isVisible={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    onCreate={fetchData}
                />
            </div>
        </MainDashboard>
    );
};

export default StudentISPage;
