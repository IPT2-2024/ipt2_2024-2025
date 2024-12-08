import React, { useState } from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const PostEventTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteEvent
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
                            setModalData(record); // Pass data to modal for editing
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                        onClick={() => handleDeleteEvent(record.id)} // Handle event deletion
                    />
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Event Name</span>, // Blue title
            dataIndex: 'event_name',
            key: 'event_name',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Date</span>, // Blue title
            dataIndex: 'date',
            key: 'date',
            render: (text) => (
                <Text>{new Date(text).toLocaleDateString()}</Text> // Format the date
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Time</span>, // Blue title
            dataIndex: 'time',
            key: 'time',
            render: (text) => {
                const time = moment(text, 'hh:mm A'); // Parse the time string with the expected format
                if (time.isValid()) {
                    return <Text>{time.format('hh:mm A')}</Text>; // Display time in 12-hour format
                }
                return <Text>Invalid Time</Text>; // Fallback for invalid time format
            },
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
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Paginate the data
            rowKey="id" // Ensure each row is keyed by the unique event ID
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
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
            scroll={{ x: 800 }} // Allows horizontal scrolling on smaller screens if needed
        />
    );
};

export default PostEventTable;
