import React, { useState } from 'react';
import { Layout, Table, Button, Space, Checkbox, Input, Row, Col, Select, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Content } = Layout; // Destructure Content from Layout
const { Option } = Select;

const FacilitiesManagerManagementPageDashboard = () => {
    // State to manage selected rows and "Select All" checkbox
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    // State for search bar and filters
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    // Table data
    const data = [
        {
            key: '1',
            roomTag: 'Room 101',
            roomTagType: 'Lecture',
            created: '2023-11-01',
            updated: '2023-11-10',
        },
        {
            key: '2',
            roomTag: 'Room 102',
            roomTagType: 'Laboratory',
            created: '2023-11-05',
            updated: '2023-11-12',
        },
        // Add more rows as needed
    ];

    // Handle the change of the "Select All" checkbox
    const handleSelectAllChange = (e) => {
        const newSelectedRowKeys = e.target.checked ? data.map(item => item.key) : [];
        setSelectedRowKeys(newSelectedRowKeys);
        setIsAllSelected(e.target.checked);
    };

    // Row selection handler
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
            setIsAllSelected(newSelectedRowKeys.length === data.length);
        },
    };

    // Table columns
    const columns = [
        {
            title: (
                <Checkbox
                    indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < data.length}
                    onChange={handleSelectAllChange}
                    checked={isAllSelected}
                />
            ),
            dataIndex: 'select',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.key)}
                    onChange={() => handleRowSelect(record.key)}
                />
            ),
            width: 100,
            align: 'center',
        },
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
            title: 'Room Tag',
            dataIndex: 'roomTag',
            key: 'roomTag',
            sorter: (a, b) => a.roomTag.localeCompare(b.roomTag),
            sortOrder: sortOrder === 'roomTag' ? 'ascend' : undefined,
        },
        {
            title: 'Room Type',
            dataIndex: 'roomTagType',
            key: 'roomTagType',
            sorter: (a, b) => a.roomTagType.localeCompare(b.roomTagType),
            sortOrder: sortOrder === 'roomTagType' ? 'ascend' : undefined,
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            sorter: (a, b) => new Date(a.created) - new Date(b.created),
            sortOrder: sortOrder === 'created' ? 'ascend' : undefined,
        },
        {
            title: 'Updated',
            dataIndex: 'updated',
            key: 'updated',
        },
    ];

    // Search handler
    const handleSearch = () => {
        // Implement search logic based on searchText and filterType
        console.log('Search Text:', searchText);
        console.log('Filter Type:', filterType);
    };

    // Sort handler
    const handleSortChange = (columnKey) => {
        setSortOrder(sortOrder === columnKey ? null : columnKey);
    };

    // Event handler for Create New button
    const handleCreateNew = () => {
        console.log('Create New clicked');
    };

    // Event handler for Archive button
    const handleArchive = () => {
        console.log('Archive clicked');
    };

    return (
        <MainDashboard>
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
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Button 
                                type="default" 
                                onClick={handleArchive}
                            >
                                Archive
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
                                placeholder="Filter by Type" 
                                style={{ width: '100%' }} 
                                value={filterType} 
                                onChange={setFilterType}
                            >
                                <Option value="Lecture">Lecture</Option>
                                <Option value="Laboratory">Laboratory</Option>
                                <Option value="Conference">Conference</Option>
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
                <Table 
                    rowSelection={rowSelection} 
                    columns={columns} 
                    dataSource={data} 
                    onChange={(pagination, filters, sorter) => {
                        if (sorter.order) {
                            handleSortChange(sorter.columnKey);
                        }
                    }} 
                    rowKey="key"
                    pagination={{ pageSize: 5 }}
                />
            </Content>
        </MainDashboard>
    );
};

export default FacilitiesManagerManagementPageDashboard;
