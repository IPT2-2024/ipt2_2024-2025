// SemesterAcademicYearTable.js
import React, { useState } from 'react';
import { Table, Button, Space, Typography, Switch, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'; // Ensure axios is imported for API calls

const { Text } = Typography;

const SemesterAcademicYearTable = ({
    rowSelection,
    data = [], // Default to empty array if data is undefined
    setIsEditModalVisible,
    setModalData,
    handleDeleteSemesterAcademicYear,
    handleStatusChange, // New prop for handling status changes
    setData,
    reloadData,
    showArchived, // New prop to determine if showing archived data
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [loadingStatus, setLoadingStatus] = useState(false); // Loading state for status updates

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    // If handleStatusChange is not passed as a prop, define a default handler
    const defaultHandleStatusChange = async (id, checked) => {
        setLoadingStatus(true);  // Set loading state for status update
    
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                message.error('Authorization token is missing');
                return;
            }
    
            // First, update all statuses in the database to 0 (turn them off)
            await axios.put('/api/semesteracademicyear/all/status', {
                status: 0, // Set all to 0 (off)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers for authorization
                },
            });
    
            // After updating all statuses to 0, now update the clicked row's status to 1 (turn it on)
            if (checked) {
                await axios.put(`/api/semesteracademicyear/${id}/status`, {
                    status: 1, // Set the clicked row to 1 (on)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
    
            // Update the local state after successful API call
            setData(prevData => prevData.map(item => {
                if (item.id === id && checked) {
                    return { ...item, status: 1 };  // Update the clicked row's status to 1
                } else {
                    return { ...item, status: 0 };  // Set all other rows' status to 0
                }
            }));
    
            message.success('Status updated successfully');
            reloadData();  // Reload the data if needed
    
        } catch (error) {
            console.error('Error updating status:', error);
            message.error(`Failed to update status: ${error.message || 'Unknown error'}`);
        } finally {
            setLoadingStatus(false);  // Set loading state back to false after the update completes
        }
    };
    

    // Use the passed handler or default handler
    const onStatusChange = handleStatusChange || defaultHandleStatusChange;

    // Define base columns
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
                        disabled={showArchived} // Disable edit in archived view
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                        onClick={() => handleDeleteSemesterAcademicYear(record.id)}
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
            title: <span style={{ color: '#1890ff' }}>Academic Year</span>,  // Updated column name
            dataIndex: 'academic_year',  // Updated field
            key: 'academic_year',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Semester Period</span>,
            dataIndex: 'semester_period',
            key: 'semester_period',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Status</span>, // New Status column
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <Switch
                    checked={record.status === 1} // Switch should be on when status is 1
                    onChange={(checked) => onStatusChange(record.id, checked)}
                    loading={loadingStatus}
                    disabled={showArchived} // Disable switch in archived view
                />
            ),
        },
    ];

    // Conditionally add date columns based on showArchived prop
    if (!showArchived) {
        // If showing active data, include Created At and Updated At
        columns.push(
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
            }
        );
    } else {
        // If showing archived data, include only Deleted At
        columns.push(
            {
                title: <span style={{ color: '#1890ff' }}>Deleted At</span>,
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date, show 'N/A' if deleted_at is null
                ),
            }
        );
    }

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // Paginate the data
            rowKey="id" // Ensure each row is keyed by the unique record ID
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange, // Update the page when changed
                position: ['topRight'], // Pagination only at the top-right
            }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
            scroll={{ x: 1000 }} // Allows horizontal scrolling on smaller screens if needed
        />
    );
};

export default SemesterAcademicYearTable;
