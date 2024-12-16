// SubjectTable.js
import React, { useState } from 'react';
import { Table, Space, Switch, Button, Popconfirm, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';

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
  handleEditSubject,
  handleDeleteSubject,
  loading, // Receive the loading prop
}) => {
  const [localCurrentPage, setLocalCurrentPage] = useState(propCurrentPage || 1);
  const localPageSize = propPageSize || 5;

  // Function for handling page change
  const handlePageChangeInternal = (page) => {
    setLocalCurrentPage(page); // Update the local current page when changed
    if (onPageChange) {
      onPageChange(page); // Call the prop handler if provided
    }
  };

  // Function for handling availability toggle (optional if switches are disabled)
  const handleAvailabilityToggle = async (record, checked) => {
    try {
      const token = localStorage.getItem('auth_token');

      const availability = checked ? 1 : 0;

      await axios.put(
        `/api/subject/${record.id}`,
        { availability },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      notification.success({
        message: 'Success',
        description: 'Availability updated successfully.',
      });

      // Update the record in the UI
      record.availability = availability;
      // Optionally, trigger a re-render or update state if necessary
    } catch (error) {
      console.error('Error updating availability:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update availability. Please try again later.',
      });
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Handler for editing a subject
  const handleEdit = (record) => {
    console.log('Edit:', record);
    if (handleEditSubject) {
      handleEditSubject(record); 
    }
  };

  // Handler for deleting a subject
  const handleDelete = (id) => {
    console.log('Delete:', id);
    if (handleDeleteSubject) {
      handleDeleteSubject(id);
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
            onClick={() => handleEdit(record)}
            size="small"
            aria-label="Edit Subject"
          />
          {record.availability === true && (
            <Popconfirm
              title="Are you sure to delete this subject?"
              onConfirm={() => handleDelete(record.id)}
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
      width: 100, // Increased width for better alignment
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Code</span>,
      dataIndex: 'subject_code',
      key: 'subject_code',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 120,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Name</span>,
      dataIndex: 'subject_name',
      key: 'subject_name',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 180,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Units</span>,
      dataIndex: 'units',
      key: 'units',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 50,
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
      width: 100, // Adjusted width for better fit
    },
    {
      title: <span style={{ color: '#1890ff' }}>Subject Description</span>,
      dataIndex: 'subject_description',
      key: 'subject_description',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 250, // Increased width for longer descriptions
    },
    {
      title: <span style={{ color: '#1890ff' }}>Availability</span>,
      dataIndex: 'availability',
      key: 'availability',
      render: (availability, record) => (
        <Switch
          checked={!!availability}
          // onChange handler is optional since Switch is disabled
          onChange={(checked) => handleAvailabilityToggle(record, checked)}
          disabled // Disable the switch to make it read-only
        />
      ),
      responsive: ['md', 'lg', 'xl'],
      width: 120,
    }
  ];

  return (
    <Table
      rowKey="id" // Ensure each row has a unique key based on the 'id' field
      columns={columns}
      dataSource={data}
      loading={loading} // Pass the loading prop to the Table component
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
        showSizeChanger: false, // Disable page size changer for consistency
      }}
      scroll={{ x: 'max-content' }}
      responsive
    />
  );
};

export default SubjectTable;
