import React, { useState } from 'react';
import { Table, Space, Button, Typography, Popconfirm, List, Card } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';

const { Text } = Typography;

const UserTable = ({
    data,
    rowSelection, // Retain this for bulk actions
    setIsEditModalVisible,
    setModalData,
    loadingDelete,
    handleSpecificDelete,  // The delete function passed from the parent
    handleRestore,   
    loading,      // The restore function passed from the parent
}) => {
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const pageSize = 5; // Define the page size

    // Function for handling page change
    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page when the page is changed
    };

    const isMobile = useMediaQuery({ maxWidth: 767 }); // Define mobile breakpoint

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
                        onClick={() => handleEdit(record)}  // Triggers edit modal with user data
                        size="small"
                        aria-label="Edit User"
                    />

                    {/* Delete Button - Visible only for non-archived users */}
                    {record.status !== 'archived' && (  // Ensure 'record.archived' is false (non-archived)
                        <Popconfirm
                            title="Are you sure to delete this user?"
                            onConfirm={() => handleSpecificDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            loading={loadingDelete}  // Show loading state during deletion
                            size="small"
                            aria-label="Delete User"
                        />
                        </Popconfirm>
                    )}

                    {/* Restore Button - Visible only for archived users */}
                    {record.status === 'archived' && (  // Only show if 'record.archived' is true (archived)
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRestore(record.id)}  // Trigger restore using record ID
                            size="small"
                            aria-label="Restore User"
                        >
                            Restore
                        </Button>
                    )}
                </Space>

            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Visible on all screen sizes
        },
        
        {
            title: <span style={{ color: '#1890ff' }}>Status</span>,
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                switch (status) {
                    case 'active':
                        return 'Active';
                    case 'archived':
                        return 'Archived';
                    case 'regular':
                        return 'Regular';
                    case 'irregular':
                        return 'Irregular';
                    default:
                        return 'Unknown'; // Optional fallback for unexpected statuses
                }
            },
            responsive: ['md', 'lg', 'xl'], // Hidden on small and extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Username</span>,
            dataIndex: 'username',
            key: 'username',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Visible on all screen sizes
        },
        {
            title: <span style={{ color: '#1890ff' }}>Password</span>,
            dataIndex: 'password',
            key: 'password',
            render: () => '******', // Mask the password
            responsive: ['lg', 'xl'], // Hidden on small and extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Role</span>,
            key: 'role',
            dataIndex: 'role_name', // Assuming 'role_name' is the correct data index
            render: (text, record) => (record.role ? record.role.role_name : 'No Role'),
            responsive: ['sm', 'md', 'lg', 'xl'], // Hidden on extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Email</span>,
            dataIndex: 'email',
            key: 'email',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Visible on all screen sizes
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created</span>,
            dataIndex: 'created_at',
            key: 'created',
            render: (created_at) => moment(created_at).format('MM/DD/YYYY, h:mm:ss A'),
            responsive: ['lg', 'xl'], // Hidden on small and extra small screens
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated</span>,
            dataIndex: 'updated_at',
            key: 'updated',
            render: (updated_at) => moment(updated_at).format('MM/DD/YYYY, h:mm:ss A'),
            responsive: ['lg', 'xl'], // Hidden on small and extra small screens
        },
        
    ];

    const printTable = () => {
        const printWindow = window.open('', '', 'height=650, width=900');
        printWindow.document.write('<html><head><title>User Table</title></head><body>');
        printWindow.document.write('<h2>User Table</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">');
        printWindow.document.write('<thead><tr><<th>Status</th><th>Username</th><th>Role</th><th>Email</th><th>Created</th><th>Updated</th></tr></thead>');
        printWindow.document.write('<tbody>');
        data.forEach((item) => {
            printWindow.document.write('<tr>');
            // printWindow.document.write(`<td>${item.id}</td>`);
            printWindow.document.write(`<td>${item.status === 'active' ? 'Active' :
                item.status === 'archived' ? 'Archived' :
                item.status === 'regular' ? 'Regular' : 'Irregular'}</td>`);
            printWindow.document.write(`<td>${item.username}</td>`);
            printWindow.document.write(`<td>${item.role ? item.role.role_name : 'No Role'}</td>`);
            printWindow.document.write(`<td>${item.email}</td>`);
            printWindow.document.write(`<td>${item.created_at}</td>`);
            printWindow.document.write(`<td>${item.updated_at}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody>');
        printWindow.document.write('</table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <>
            {/* Print Button Rendered Always */}
            <Button
                icon={<PrinterOutlined />}
                type="primary"
                onClick={printTable}
                style={{ marginBottom: 16 }}
                aria-label="Print Table"
            >
                Print Table
            </Button>

            {isMobile ? (
                <List
                    dataSource={data}
                    bordered
                    renderItem={(item) => (
                        <List.Item>
                            <Card style={{ width: '100%' }}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                
                                    <Text strong>Username:</Text> {item.username}
                                    <Text strong>Email:</Text> {item.email}
                                    <Text strong>Status:</Text> {
                                        item.status === 'active' ? 'Active' :
                                        item.status === 'archived' ? 'Archived' :
                                        item.status === 'regular' ? 'Regular' :
                                        item.status === 'irregular' ? 'Irregular' :
                                        'Unknown'  // Optional fallback in case of an unknown status value
                                    }
                                    <Text strong>Role:</Text> {item.role ? item.role.role_name : 'No Role'}
                                    
                                    <Space>
                                        {/* Edit Button - always visible */}
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(item)}  // Triggers edit modal with user data
                                            size="small"
                                            aria-label="Edit User"
                                        />

                                        {/* Delete Button - only visible for non-archived users */}
                                        {item.status !== 'archived' && (  // Ensure 'item.archived' is false (not archived)
                                            <Button
                                                type="danger"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleSpecificDelete(item.id)}  // Triggers delete function with user ID
                                                size="small"
                                                aria-label="Delete User"
                                            />
                                        )}

                                        {/* Restore Button - only visible for archived users */}
                                        {item.status === 'archived' && (  // Only show if 'item.archived' is true (archived)
                                            <Button
                                                type="default"
                                                icon={<ReloadOutlined />}
                                                onClick={() => handleRestore(item.id)}  // Triggers restore function with user ID
                                                size="small"
                                                aria-label="Restore User"
                                            >
                                                Restore
                                            </Button>
                                        )}
                                    </Space>


                                </Space>
                            </Card>
                        </List.Item>
                    )}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: data.length,
                        onChange: handlePageChange,
                        position: ['bottomCenter'], // Pagination at the bottom center for mobile
                    }}
                    style={{ marginBottom: 16 }}
                />
            ) : (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    bordered
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: data.length,
                        onChange: handlePageChange,
                        position: ['topRight'],
                    }}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    loading={{
                        spinning: loading, // Controls if the table should show loading spinner
                        indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, // Custom loading indicator (optional)
                        tip: "Loading data..." // Loading message
                    }}
                />
            )}
        </>
    );
};

export default UserTable;
