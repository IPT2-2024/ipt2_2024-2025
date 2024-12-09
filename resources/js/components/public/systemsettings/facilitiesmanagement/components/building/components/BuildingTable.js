// BuildingTable.js (Updated to Use Dynamic Data and Enhanced Search)
import React, { useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Helper function to convert number to ordinal string
const getOrdinalFloor = (num) => {
    if (typeof num !== 'number') return 'No Floor';
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]) + ' floor';
};

const BuildingTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteBuilding,
    handleRestoreBuilding,
    loading, // Receive loading state from parent
    reloadData,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, // Blue title
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                        onClick={() => {
                            setIsEditModalVisible(true);
                            setModalData(record);
                        }}
                        aria-label={`Edit building ${record.building_name}`} // ARIA label for accessibility
                    />
                    
                    {/* Show delete button for active buildings (deleted_at is null) */}
                    {record.deleted_at === null && (
                        <Popconfirm
                            title="Are you sure to delete this building?"
                            onConfirm={() => handleDeleteBuilding(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                type="danger"
                                aria-label={`Delete building ${record.building_name}`} // ARIA label for accessibility
                            />
                        </Popconfirm>
                    )}
                    
                    {/* Show restore button for archived buildings (deleted_at is not null) */}
                    {record.deleted_at !== null && (
                        <Button
                            icon={<ReloadOutlined />}
                            type="default"
                            onClick={() => handleRestoreBuilding(record.id)} // Handle restore action
                            aria-label={`Restore building ${record.building_name}`} // ARIA label for accessibility
                        >
                            Restore
                        </Button>
                    )}
                </Space>
            ),
        },
        
        {
            title: <span style={{ color: '#1890ff' }}>Building Name</span>, // Blue title
            dataIndex: 'building_name',
            key: 'building_name',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Maximum Floor</span>, // Blue title
            dataIndex: 'floor_level', // Use 'floor_level' from the data
            key: 'floor',
            render: (text, record) => getOrdinalFloor(record.floor ? record.floor.floor_level : null),  // Show ordinal floor or 'No Floor' if not available
        },        
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>, // Blue title
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> // Format the date
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>, // Blue title
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> // Format the date
            ),
        },
    ];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data} // Data from the backend, may be empty
            rowKey="id" // Ensure each row is keyed by the unique building ID
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length, // Set to 0 if no data available
                onChange: handlePageChange, // Update page on change
                position: ['topRight'], // Pagination on the top-right
                hideOnSinglePage: true, // Hide pagination if there's only one page
            }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {/* Page Info at Bottom Left */}
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
            scroll={{ x: 1200 }} // Allow horizontal scrolling if needed
            loading={{
                spinning: loading, // Controls if the table should show loading spinner
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                tip: "Loading data..." // Loading message
            }} // Show loading spinner when data is being fetched
            locale={{
                emptyText: loading ? 'Loading Buildings...' : 'No Buildings Found.', // Show loading or empty message
            }}
        />

    );
};

export default BuildingTable;
