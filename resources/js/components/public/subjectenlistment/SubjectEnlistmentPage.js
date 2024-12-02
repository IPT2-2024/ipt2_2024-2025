import React, { useState, useMemo } from 'react';
import { Layout, Table, Button, Space, Input, Row, Col, Select, DatePicker, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout
const { Option } = Select;

const SubjectEnlistmentPageDashboard = () => {
    // State for table data and search/filter inputs
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Set the number of items per page

    // Sample data for the table
    const data = [
        {
            key: '1',
            subjectCode: 'MATH101',
            subjectName: 'Mathematics',
            classification: 'Major',
            units: 3,
            description: 'Fundamental concepts of algebra and calculus.',
            availability: 'Available',
            createdAt: '2023-08-15',
            updatedAt: '2023-11-20',
        },
        {
            key: '2',
            subjectCode: 'PHY101',
            subjectName: 'Physics',
            classification: 'Major',
            units: 4,
            description: 'Basic principles of classical mechanics and thermodynamics.',
            availability: 'Not Available',
            createdAt: '2023-09-05',
            updatedAt: '2023-11-18',
        },
        {
            key: '3',
            subjectCode: 'CHEM101',
            subjectName: 'Chemistry',
            classification: 'Minor',
            units: 3,
            description: 'Introduction to chemical principles and reactions.',
            availability: 'Available',
            createdAt: '2023-10-01',
            updatedAt: '2023-11-25',
        },
        // Add more rows as needed
    ];

    // Apply the filter to the data based on filterType
    const filteredData = useMemo(() => {
        if (!filterType) {
            return data;
        }
        return data.filter(item => item.availability === filterType);
    }, [filterType, data]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [currentPage, filteredData]);

    // Table columns
    const columns = [
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record.key)}
                    />
                    <Button 
                        type="link" 
                        icon={<DeleteOutlined />} 
                        danger 
                        onClick={() => handleDelete(record.key)}
                    />
                </Space>
            ),
        },
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
            sorter: (a, b) => a.subjectCode.localeCompare(b.subjectCode),
            sortOrder: sortOrder === 'subjectCode' ? 'ascend' : undefined,
        },
        {
            title: 'Subject Name',
            dataIndex: 'subjectName',
            key: 'subjectName',
            sorter: (a, b) => a.subjectName.localeCompare(b.subjectName),
            sortOrder: sortOrder === 'subjectName' ? 'ascend' : undefined,
        },
        {
            title: 'Classification',
            dataIndex: 'classification',
            key: 'classification',
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
            sorter: (a, b) => a.units - b.units,
            sortOrder: sortOrder === 'units' ? 'ascend' : undefined,
        },
        {
            title: 'Subject Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Availability',
            dataIndex: 'availability',
            key: 'availability',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortOrder: sortOrder === 'createdAt' ? 'ascend' : undefined,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            sortOrder: sortOrder === 'updatedAt' ? 'ascend' : undefined,
        },
    ];

    // Event handler for selecting/deselecting a row
    const handleSelect = (key) => {
        const newSelectedRowKeys = selectedRowKeys.includes(key)
            ? selectedRowKeys.filter(k => k !== key)
            : [...selectedRowKeys, key];
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // Event handler for Create New button
    const handleCreateNew = () => {
        console.log('Create New clicked');
    };

    // Search handler
    const handleSearch = () => {
        console.log('Search Text:', searchText);
        console.log('Filter Type:', filterType);
    };

    // Event handler for Edit and Delete buttons
    const handleEdit = (key) => {
        console.log('Edit clicked for key:', key);
    };

    const handleDelete = (key) => {
        console.log('Delete clicked for key:', key);
    };

    // Change page handler
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Content style={{ padding: '0 50px' }}>
            <div style={{ margin: '16px 0' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={handleCreateNew}
                        >
                            Create New
                        </Button>
                    </Col>
                </Row>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Input 
                            placeholder="Search..." 
                            value={searchText} 
                            onChange={e => setSearchText(e.target.value)} 
                            onPressEnter={handleSearch} 
                            prefix={<SearchOutlined />} 
                        />
                    </Col>
                    <Col span={8}>
                        <Select 
                            placeholder="Filter by Availability" 
                            style={{ width: '100%' }} 
                            value={filterType} 
                            onChange={setFilterType}
                        >
                            <Option value="Available">Available</Option>
                            <Option value="Not Available">Not Available</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Select Date" 
                        />
                    </Col>
                </Row>
            </div>
            {/* Pagination Component */}
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredData.length}
                    onChange={handlePageChange}
                    showSizeChanger={false} // Optional: Hide the size changer if you want to keep a fixed page size
                />
            </div>
            {/* Table Component */}
            <Table 
                columns={columns} 
                dataSource={paginatedData} // Use the paginated data here
                rowKey="key"
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                    getCheckboxProps: record => ({
                        disabled: false, // You can add logic here to disable specific checkboxes if needed
                    }),
                }}
            />
        </Content>
    );
};

const SubjectEnlistmentPage = () => {
    return (
        <MainDashboard>
            <SubjectEnlistmentPageDashboard />
        </MainDashboard>
    );
};

export default SubjectEnlistmentPage;
