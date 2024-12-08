import React, { useState } from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AcademicYearTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteAcademicYear
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
                        onClick={() => handleDeleteAcademicYear(record.id)}
                    />
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>ID</span>, // Blue title
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Academic Year</span>, // Blue title
            dataIndex: 'academic_year',
            key: 'academic_year',
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
            rowKey="id" // Ensure each row is keyed by the unique academic year ID
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

export default AcademicYearTable;
