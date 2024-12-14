import React, { useState } from 'react';
import { Table, Space, Switch, Button, Popconfirm, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios'; // Ensure axios is imported

const SubjectTable = ({
  data,
  selectedRowKeys,
  onRowSelectionChange,
  onSearchChange,
  onFilterChange,
  onSortChange,
  currentPage: propCurrentPage,
  pageSize: propPageSize,
  onPageChange,
  totalRecords,
  handleEditSubject,   // Handler for editing subjects
  handleDeleteSubject, // Handler for deleting subjects
}) => {
  const [localCurrentPage, setLocalCurrentPage] = useState(propCurrentPage || 1); // Initialize with prop or default to 1
  const localPageSize = propPageSize || 5; // Use prop or default to 5

  // Function for handling page change
  const handlePageChangeInternal = (page) => {
    setLocalCurrentPage(page); // Update the local current page when changed
    if (onPageChange) {
      onPageChange(page); // Call the prop handler if provided
    }
  };

  // Function for handling availability toggle
  const handleAvailabilityToggle = async (record, checked) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`/api/subject/${record.id}`, { availability: checked }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({
        message: 'Success',
        description: 'Availability updated successfully.',
      });

      // Optionally update state directly or refetch data
      // Here, we'll update the local data directly for immediate UI feedback
      record.availability = checked;
    } catch (error) {
      console.error('Error updating availability:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update availability. Please try again later.',
      });
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 767 }); // Define mobile breakpoint

  // Handler for editing a subject
  const handleEdit = (record) => {
    console.log('Edit:', record);
    if (handleEditSubject) {
      handleEditSubject(record); // Call the parent handler
    }
  };

  // Handler for deleting a subject
  const handleDelete = (id) => {
    console.log('Delete:', id);
    if (handleDeleteSubject) {
      handleDeleteSubject(id); // Call the parent handler
    }
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
            onClick={() => handleEdit(record)} // Edit handler
            size="small"
            aria-label="Edit Subject"
          />
          {record.availability === true && (
            <Popconfirm
              title="Are you sure to delete this subject?"
              onConfirm={() => handleDelete(record.id)} // Delete handler
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                size="small"
                aria-label="Delete Subject"
              />
            </Popconfirm>
          )}
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 150, // Adjust the width of the Actions column
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Code</span>,
      dataIndex: 'code',
      key: 'code',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 120,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Name</span>,
      dataIndex: 'name',
      key: 'name',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 180,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Units</span>,
      dataIndex: 'units',
      key: 'units',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 100,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Category</span>,
      dataIndex: 'subject_category',
      key: 'subject_category',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 180,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Classification</span>,
      dataIndex: 'classification',
      key: 'classification',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 180,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Description</span>,
      dataIndex: 'subject_description',
      key: 'subject_description',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 180,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Availability</span>,
      dataIndex: 'availability',
      key: 'availability',
      render: (text, record) => (
        <Switch
          checked={record.availability}
          onChange={(checked) => handleAvailabilityToggle(record, checked)} // Availability toggle handler
        />
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 150,
    },
  ];

  return (
    <Table
      rowKey="id" // Ensure each row has a unique key based on the 'id' field
      columns={columns}
      dataSource={data}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys,
        onChange: onRowSelectionChange,
      }}
      onChange={onSortChange}
      pagination={{
        current: localCurrentPage,
        pageSize: localPageSize,
        total: totalRecords,
        onChange: handlePageChangeInternal,
      }}
      scroll={{ x: 'max-content' }}
      responsive
    />
  );
};

export default SubjectTable;