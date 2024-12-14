import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Typography, Popconfirm, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import axios from 'axios';

const { Text } = Typography;

const StudentTable = ({
    data,
    rowSelection,
    setIsEditModalVisible,
    setModalData,
    loadingDelete,
    handleSpecificDelete,
    handleRestore,
    loading,
    fetchData,
    totalItems, // total number of items from the server for pagination
}) => {
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        // Fetch data based on the new page and pageSize
        fetchData(page, pageSize);
    };

    const isMobile = useMediaQuery({ maxWidth: 767 });

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
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                        aria-label="Edit Student"
                    />
                    {record.status !== 'archived' && (
                        <Popconfirm
                            title="Are you sure to delete this student?"
                            onConfirm={() => handleSpecificDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                icon={<DeleteOutlined />}
                                loading={loadingDelete}
                                size="small"
                                aria-label="Delete Student"
                            />
                        </Popconfirm>
                    )}
                    {record.status === 'archived' && (
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRestore(record.id)}
                            size="small"
                            aria-label="Restore Student"
                        >
                            Restore
                        </Button>
                    )}
                </Space>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            width: 100,  // Adjust the width of the Actions column
        },
        {
            title: <span style={{ color: '#1890ff' }}>First Name</span>,
            dataIndex: 'first_name',
            key: 'first_name',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            width: 120,
        },
        {
            title: <span style={{ color: '#1890ff' }}>Last Name</span>,
            dataIndex: 'last_name',
            key: 'last_name',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            width: 120,
        },
        {
            title: <span style={{ color: '#1890ff' }}>School Email</span>,
            dataIndex: 'school_email',
            key: 'school_email',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            width: 180,
        },
        {
            title: <span style={{ color: '#1890ff' }}>Program</span>,
            dataIndex: 'program_name',
            key: 'program_name',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            width: 180,
        },
        {
            title: <span style={{ color: '#1890ff' }}>Year Level</span>,
            dataIndex: 'year_level_name',
            key: 'year_level_name',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            width: 180,
        },
        {
            title: <span style={{ color: '#1890ff' }}>Admission Date</span>,
            dataIndex: 'admission_date',
            key: 'admission_date',
            render: (admission_date) => moment(admission_date).format('MM/DD/YYYY'),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            width: 120,
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>,
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => moment(created_at).format('MM/DD/YYYY, h:mm:ss A'),
            responsive: ['lg', 'xl'],
            width: 200,
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>,
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (updated_at) => moment(updated_at).format('MM/DD/YYYY, h:mm:ss A'),
            responsive: ['lg', 'xl'],
            width: 200,
        },
    ];    

    const printTable = () => {
        const printWindow = window.open('', '', 'height=650, width=900');
        printWindow.document.write('<html><head><title>Student Table</title></head><body>');
        printWindow.document.write('<h2>Student Table</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">');
        printWindow.document.write('<thead><tr><th>First Name</th><th>Last Name</th><th>Middle Initial</th><th>Suffix</th><th>Date of Birth</th><th>Age</th><th>Address</th><th>School Email</th><th>Sex/Gender</th><th>Phone Number</th><th>Admission Date</th><th>Marital Status</th><th>Religion</th><th>Created At</th><th>Updated At</th></tr></thead>');
        printWindow.document.write('<tbody>');
        data.forEach((item) => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${item.first_name}</td>`);
            printWindow.document.write(`<td>${item.last_name}</td>`);
            printWindow.document.write(`<td>${item.school_email}</td>`);
            printWindow.document.write(`<td>${moment(item.admission_date).format('MM/DD/YYYY')}</td>`);
            printWindow.document.write(`<td>${moment(item.created_at).format('MM/DD/YYYY, h:mm:ss A')}</td>`);
            printWindow.document.write(`<td>${moment(item.updated_at).format('MM/DD/YYYY, h:mm:ss A')}</td>`);
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
            <div style={{ marginBottom: 20 }}>
                <Button
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={printTable}
                >
                    Print Table
                </Button>
            </div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}  // Use `data` which is fetched and stored in the state
                rowKey="id"  // Specify the unique key for each row
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: handlePageChange,
                    total: totalItems,  // Use `totalItems` for correct pagination
                }}
                loading={loadingProfiles}  // Show loading spinner when fetching
                scroll={{ x: isMobile ? 800 : 1300 }}
                style={{ marginTop: 20 }}
            />
        </>
    );
};

export default StudentTable;
//goods na