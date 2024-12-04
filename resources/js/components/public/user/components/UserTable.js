import React from 'react';
import { Table, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const UserTable = ({
    data,
    rowSelection, // Retain this for bulk actions
    setIsEditModalVisible,
    setModalData,
    handleDelete, // Single delete logic passed from parent
    handleRestore,
}) => {
    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
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
                            onClick={() => handleDelete(record.id)} // Directly delete using ID
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
            title: <span style={{ color: '#1890ff' }}>Status</span>,
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status ? 'Active' : 'Archived'), // Display status as "Active" or "Archived"
        },
        {
            title: <span style={{ color: '#1890ff' }}>Username</span>,
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Password</span>,
            dataIndex: 'password',
            key: 'password',
            render: () => '******', // Mask the password
        },
        {
            title: <span style={{ color: '#1890ff' }}>Role</span>,
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Email</span>,
            dataIndex: 'email',
            key: 'email',
            render: () => <span></span>, // Render blank content for now
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created</span>,
            dataIndex: 'created',
            key: 'created',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated</span>,
            dataIndex: 'updated',
            key: 'updated',
        },
    ];

    return (
        <Table
            rowSelection={rowSelection} // Still supports bulk operations
            columns={columns}
            dataSource={data}
            bordered
            pagination={{
                pageSize: 5,
                position: ['topRight'], // Pagination only at the top-right
            }}
            showTotal={(total, range) => `Page ${Math.ceil(range[0] / 5)} out of ${Math.ceil(total / 5)}`} // Display page info
            style={{ color: '#000' }}
            rowKey="id" // Use 'id' as a unique key
            scroll={{ x: 'max-content' }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {/* Page Info at Bottom Left */}
                    Page {Math.ceil((data.length) / 5)} of {Math.ceil(data.length / 5)}
                </div>
            )}
        />
    );
};

export default UserTable;
