import React from 'react';
import { Table, Space, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RoomTagsTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteRoomTag,
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
                    {!record.archived && (
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteRoomTag(record.id)} // Directly delete using ID
                        />
                    )}

                    {/* Restore Button */}
                    {record.archived && (
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
            title: <span style={{ color: '#1890ff' }}>ID</span>,
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Room Tag</span>,
            dataIndex: 'room_tag',
            key: 'room_tag',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>,
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>,
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
    ];

    return (
        <Table
            rowSelection={rowSelection} // Still supports bulk operations
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

export default RoomTagsTable;
