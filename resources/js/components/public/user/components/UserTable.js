import React from 'react';
import { Table, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const UserTable = ({
    data,
    rowSelection,
    setIsEditModalVisible,
    setIsDeleteModalVisible,
    setModalData,
    handleDelete,
    handleRestore
}) => {

    const handleEdit = (record) => {
        setModalData(record); // Set data to edit modal
        setIsEditModalVisible(true);
    };

    const handleDeleteClick = (record) => {
        setModalData(record); // Set data to delete modal
        setIsDeleteModalVisible(true);
    };

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>,
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    {!record.archived && (
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)} // Pass ID for deletion
                        />
                    )}
                    {record.archived && (
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRestore(record.id)} // Pass ID for restoring
                        >
                            Restore
                        </Button>
                    )}
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>,
            dataIndex: 'id', // Ensure this is the correct field for ID
            key: 'id', // This should match the field in your data
            render: (id) => <span>{id}</span> // Display the ID value
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
            render: (password) => '******', // Mask the password as hashed/hidden
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
            render: () => <span></span> // Render blank content for the Email column
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
            rowSelection={rowSelection} // This should correctly select individual rows
            columns={columns}
            dataSource={data} // Make sure data has unique 'id' for each row
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
            style={{ color: '#000' }}
            rowKey="id" // Ensure this is the unique identifier for each row
        />
    );
};

export default UserTable;
