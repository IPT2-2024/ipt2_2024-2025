import React, { useState } from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ClassScheduleTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteClassSchedule
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
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                        onClick={() => handleDeleteClassSchedule(record.id)}
                    />
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>,
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Start Time</span>,
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: <span style={{ color: '#1890ff' }}>End Time</span>,
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Day of Week</span>,
            dataIndex: 'day_of_week',
            key: 'day_of_week',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Classified Section ID</span>,
            dataIndex: 'classifiedsection_id',
            key: 'classifiedsection_id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Academic Program ID</span>,
            dataIndex: 'academicprogram_id',
            key: 'academicprogram_id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Classroom Scheduling ID</span>,
            dataIndex: 'classroomscheduling_id',
            key: 'classroomscheduling_id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Profile ID</span>,
            dataIndex: 'profile_id',
            key: 'profile_id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Semester Academic Year ID</span>,
            dataIndex: 'semacyear_id',
            key: 'semacyear_id',
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
        {
            title: <span style={{ color: '#1890ff' }}>Deleted At</span>,
            dataIndex: 'deleted_at',
            key: 'deleted_at',
            render: (text) => (
                <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date, show 'N/A' if deleted_at is null
            ),
        },
    ];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Paginate the data
            rowKey="id" // Ensure each row is keyed by the unique schedule ID
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
            scroll={{ x: 1000 }} // Allows horizontal scrolling on smaller screens if needed
        />
    );
};

export default ClassScheduleTable;
