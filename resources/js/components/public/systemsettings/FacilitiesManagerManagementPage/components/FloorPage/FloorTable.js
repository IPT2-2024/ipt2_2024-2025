import React from 'react';
import { Table, Space, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const FloorTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteFloor,
    currentPage,
    pageSize,
    setCurrentPage
}) => {
    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>,
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {/* Edit Button */}
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    {/* Delete Button */}
                    {!record.isArchived && (
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteFloor(record.id)} // Directly delete using ID
                        />
                    )}
                    {/* Restore Button */}
                    {record.isArchived && (
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRestore(record.id)}
                        >
                            Restore
                        </Button>
                    )}
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>, // Added ID column
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Floor Level</span>,
            dataIndex: 'floor_level',
            key: 'floor_level',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>, // Added created_at column
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>, // Added updated_at column
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
    ];

    return (
        <Table
            rowSelection={rowSelection} // Supports bulk operations
            columns={columns}
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Paginate the data
            bordered
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange, // Update the page when changed
                position: ['topRight'], // Pagination only at the top-right
            }}
            style={{ color: '#000' }}
            rowKey="id" // Use 'id' as a unique key
            scroll={{ x: 'max-content' }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {/* Page Info at Bottom Left */}
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
        />
    );
};

export default FloorTable;
