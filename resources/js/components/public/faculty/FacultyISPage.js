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
} from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import MainDashboard from '../dashboard/components/MainDashboard';

const { Text } = Typography;

const FacultyISPage = () => {
    // Static data for faculty
    const facultyData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            middleInitial: 'A.',
            sex: 'Male',
            phoneNumber: '123-456-7890',
            suffix: 'Jr.',
            photoPath: '/path/to/photo.jpg',
            religion: 'Christianity',
            maritalStatus: 'Married',
            address: '123 Main St',
            status: 'Active',
            email: 'john.doe@example.com',
        },
        // Add more faculty members as needed
    ];

    const statusData = [
        { id: 1, name: 'Active' },
        { id: 2, name: 'Inactive' },
        { id: 3, name: 'On Leave' },
    ];

    const [faculty, setFaculty] = useState(facultyData);
    const [filteredFaculty, setFilteredFaculty] = useState(facultyData);
    const [statuses, setStatuses] = useState(statusData);
    const [searchValue, setSearchValue] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
