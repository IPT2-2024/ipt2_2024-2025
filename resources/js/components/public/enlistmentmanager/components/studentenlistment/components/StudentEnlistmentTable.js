import React, { useState } from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const StudentEnlistmentTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteEnlistment,
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
                        style={{
                            backgroundColor: '#1677FF',
                            borderColor: '#1677FF',
                            color: '#fff',
                        }}
                        onClick={() => {
                            setIsEditModalVisible(true);
                            setModalData(record);
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        style={{
                            backgroundColor: 'white',
                            border: 'none',
                            color: 'black',
                        }}
                        onClick={() => handleDeleteEnlistment(record.id)}
                    />
                </Space>
            ),
        },
        // {
        //     title: <span style={{ color: '#1890ff' }}>ID</span>,
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        {
            title: <span style={{ color: '#1890ff' }}>Profile ID</span>,
            dataIndex: 'profile_id',
            key: 'profile_id',
        },

        {
            title: <span style={{ color: '#1890ff' }}>Full Name</span>,
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Program</span>,
            dataIndex: 'program',
            key: 'program',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Year Level</span>,
            dataIndex: 'year_level',
            key: 'year_level',
        },

        {
            title: <span style={{ color: '#1890ff' }}>Status</span>,
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>,
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> // Format the date
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>,
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
            dataSource={Array.isArray(data) 
                ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
                : []} // Safe usage of slice
            rowKey="id" // Ensure each row is keyed by the unique enlistment ID
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange, // Update the page when changed
                position: ['topRight'], // Pagination only at the top-right
            }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {/* Page Info at Bottom Left */}
                    <Text>{`Page ${currentPage} of ${Math.ceil(
                        data.length / pageSize
                    )}`}</Text>
                </div>
            )}
            scroll={{ x: 1000 }} // Allows horizontal scrolling on smaller screens if needed
        />
    );
};

export default StudentEnlistmentTable;
