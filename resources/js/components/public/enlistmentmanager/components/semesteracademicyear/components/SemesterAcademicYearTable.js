// SemesterAcademicYearTable.js
import React, { useState } from 'react';
import { Table, Button, Space, Typography, Switch, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'; // For prop type checking

const { Text } = Typography;

// **Custom Switch Component with Confirmation**
const ConfirmSwitch = ({ checked, onConfirm, disabled }) => {
    const [visible, setVisible] = useState(false);

    const handleChange = (checked) => {
        if (checked) {
            setVisible(true);
        }
    };

    const handleConfirm = () => {
        setVisible(false);
        onConfirm();
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <Popconfirm
            title="Are you sure you want to activate this academic year? This will deactivate all others."
            visible={visible}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            okText="Yes"
            cancelText="No"
        >
            <Switch
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                aria-label={`Toggle status for ID`}
            />
        </Popconfirm>
    );
};

ConfirmSwitch.propTypes = {
    checked: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

const SemesterAcademicYearTable = ({
    rowSelection,
    data = [], // Default to empty array if data is undefined
    setIsEditModalVisible,
    setModalData,
    handleDeleteSemesterAcademicYear,
    handleStatusChange, // Function to handle status changes
    showArchived, // New prop to determine if showing archived data
    loading, // Loading state
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
                        disabled={showArchived || loading} // Disable edit in archived view or during loading
                        aria-label="Edit Academic Year"
                    />
                    <Popconfirm
                        title="Are you sure you want to archive this academic year?"
                        onConfirm={() => handleDeleteSemesterAcademicYear(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                            disabled={loading} // Disable delete during loading
                            aria-label="Archive Academic Year"
                        />
                    </Popconfirm>
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
                showArchived ? (
                    <Switch
                        checked={record.status === 1}
                        disabled // Disable switch in archived view
                        aria-label={`Status for ID ${record.id}`}
                    />
                ) : (
                    record.status === 1 ? (
                        // If the record is active, disable the switch to prevent disabling
                        <Switch
                            checked={true}
                            disabled
                            aria-label={`Active status for ID ${record.id}`}
                        />
                    ) : (
                        // If the record is inactive, allow activating with confirmation
                        <ConfirmSwitch
                            checked={false}
                            onConfirm={() => handleStatusChange(record.id, true)}
                            disabled={loading}
                        />
                    )
                )
            ),
        },
    ];

    // **Conditionally add date columns based on showArchived prop**
    if (!showArchived) {
        // If showing active data, include Created At and Updated At
        columns.push(
            {
                title: <span style={{ color: '#1890ff' }}>Created At</span>,
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date
                ),
            },
            {
                title: <span style={{ color: '#1890ff' }}>Updated At</span>,
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> // Format the date
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
            loading={loading} // Pass the loading state to the Table
        />
    );
};

// **Prop Type Validation**
SemesterAcademicYearTable.propTypes = {
    rowSelection: PropTypes.object,
    data: PropTypes.array.isRequired,
    setIsEditModalVisible: PropTypes.func.isRequired,
    setModalData: PropTypes.func.isRequired,
    handleDeleteSemesterAcademicYear: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    showArchived: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default SemesterAcademicYearTable;
