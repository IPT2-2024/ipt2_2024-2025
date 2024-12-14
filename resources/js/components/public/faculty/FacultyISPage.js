import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Input,
    Space,
    Dropdown,
    Menu,
    Typography,
    Row,
    Col,
    Table,
    Spin,
    Popconfirm,
    message,
} from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import MainDashboard from '../dashboard/components/MainDashboard';
import axios from 'axios';

const { Text } = Typography;

const FacultyISPage = () => {
    const [faculty, setFaculty] = useState([]);
    const [filteredFaculty, setFilteredFaculty] = useState([]);
    const [statuses, setStatuses] = useState([
        { id: 1, name: 'Active' },
        { id: 2, name: 'Inactive' },
        { id: 3, name: 'On Leave' },
    ]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch faculty data from backend
    useEffect(() => {
        const fetchFaculty = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/profiles/faculty/only'); // Adjust the endpoint to match the actual backend route

                // Ensure the data returned by the backend matches the following structure
                const data = response.data.map((item) => ({
                    id: item.id,
                    firstName: item.first_name,
                    lastName: item.last_name,
                    middleInitial: item.middle_initial || '',
                    suffix: item.suffix || '',
                    sex: item.sex,
                    phoneNumber: item.phone_number,
                    religion: item.religion,
                    maritalStatus: item.marital_status,
                    address: item.address,
                    status: item.status || 'Active', // Default to Active if not provided
                    email: item.email, // Make sure this is the correct field name returned by the backend
                }));
                setFaculty(data);
                setFilteredFaculty(data);
            } catch (error) {
                message.error('Failed to load faculty data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaculty();
    }, []);

    const filterFaculty = useCallback(() => {
        let filtered = faculty.filter((member) => {
            const matchesSearch =
                member.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                member.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
                member.email.toLowerCase().includes(searchValue.toLowerCase());
            const matchesStatus = selectedStatus === 'All' || member.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
        setFilteredFaculty(filtered);
    }, [faculty, searchValue, selectedStatus]);

    const debouncedFilter = useCallback(debounce(filterFaculty, 300), [filterFaculty]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        debouncedFilter();
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        filterFaculty();
    };

    const resetFilters = () => {
        setSearchValue('');
        setSelectedStatus('All');
        setFilteredFaculty(faculty);
    };

    const statusMenu = (
        <Menu>
            {statuses.map((status) => (
                <Menu.Item key={status.id} onClick={() => handleStatusFilter(status.name)}>
                    {status.name}
                </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item onClick={() => handleStatusFilter('All')}>All Statuses</Menu.Item>
        </Menu>
    );

    const columns = [
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Middle Initial', dataIndex: 'middleInitial', key: 'middleInitial' },
        { title: 'Suffix', dataIndex: 'suffix', key: 'suffix' },
        { title: 'Sex', dataIndex: 'sex', key: 'sex' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Religion', dataIndex: 'religion', key: 'religion' },
        { title: 'Marital Status', dataIndex: 'maritalStatus', key: 'maritalStatus' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
    ];

    return (
        <MainDashboard>
            <div className="faculty-page">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <h3>Faculty Management</h3>
                    <Row gutter={[16, 16]} justify="space-between" align="middle">
                        <Col xs={24} sm={24} md={12}>
                            <Space wrap>
                                <Input.Search
                                    value={searchValue}
                                    placeholder="Search faculty..."
                                    style={{ width: '100%', maxWidth: 300 }}
                                    onSearch={debouncedFilter}
                                    onChange={handleSearchChange}
                                    allowClear
                                />
                                <Dropdown overlay={statusMenu} trigger={['click']}>
                                    <Button icon={<FilterOutlined />}>
                                        {selectedStatus === 'All'
                                            ? 'Filter by Status'
                                            : `Status: ${selectedStatus}`}
                                    </Button>
                                </Dropdown>
                            </Space>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            style={{ textAlign: isMobile ? 'left' : 'right' }}
                        >
                            <Space>
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add Faculty
                                </Button>
                                <Popconfirm
                                    title="Are you sure to remove the selected faculty?"
                                    onConfirm={() => console.log('Remove faculty')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button disabled={selectedRowKeys.length === 0}>
                                        Remove
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                onClick={resetFilters}
                                disabled={searchValue === '' && selectedStatus === 'All'}
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
                    {loading ? (
                        <div style={{ textAlign: 'center' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            rowSelection={{
                                selectedRowKeys,
                                onChange: setSelectedRowKeys,
                            }}
                            dataSource={filteredFaculty}
                            columns={columns}
                            rowKey="id"
                        />
                    )}
                </Space>
            </div>
        </MainDashboard>
    );
};

export default FacultyISPage;
