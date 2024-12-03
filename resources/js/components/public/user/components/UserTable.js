import React, { useEffect, useState } from 'react';
import { Table, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserTable = ({
    rowSelection,
    setIsEditModalVisible,
    setIsDeleteModalVisible,
    setModalData,
    setIsCreateModalVisible,
}) => {
    const [dataSource, setDataSource] = useState([]);

    // Fetch users data on component mount
    useEffect(() => {
        axios.get('/api/users')
            .then(response => {
                setDataSource(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, []); // Empty dependency array ensures it runs once when component mounts

    const handleEdit = (record) => {
        setModalData(record); // Set data to edit modal
        setIsEditModalVisible(true);
    };

    const handleDelete = (record) => {
        setModalData(record); // Set data to delete modal
        setIsDeleteModalVisible(true);
    };

    const columns = [
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <span>{status || 'N/A'}</span>,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <span>{email || 'N/A'}</span>,
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            sorter: (a, b) => new Date(a.created) - new Date(b.created),
        },
        {
            title: 'Updated',
            dataIndex: 'updated',
            key: 'updated',
            sorter: (a, b) => new Date(a.updated) - new Date(b.updated),
        },
    ];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
            style={{ color: '#000' }}
            components={{
                header: {
                    cell: (props) => (
                        <th
                            {...props}
                            style={{
                                color: '#4d90fe',
                            }}
                        />
                    ),
                },
            }}
        />
    );
};

export default UserTable;
