import React, { useState } from 'react';
import { Table, Space, Switch, Button } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const SubjectTable = ({
  data,
  selectedRowKeys,
  onRowSelectionChange,
  onSearchChange,
  onFilterChange,
  onSortChange,
  currentPage: propCurrentPage, // Use propCurrentPage to distinguish from local state
  pageSize: propPageSize,
  onPageChange,
  totalRecords,
}) => {
  const [localCurrentPage, setLocalCurrentPage] = useState(1); // Local state for the current page
  const localPageSize = 5; // Local constant for page size

  // Function for handling page change
  const handlePageChange = (page) => {
    setLocalCurrentPage(page); // Update the local current page when changed
    if (onPageChange) {
      onPageChange(page); // Call the prop handler if provided
    }
  };

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

  const handleEdit = (record) => {
    console.log('Edit:', record);
    handleEditSubject(record);
  };

  const handleDelete = (record) => {
    console.log('Delete:', record);
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
            onClick={() => handleEdit(record)} // Replace with the actual edit handler
            size="small"
            aria-label="Edit Subject"
          />
          {record.availability === true ? (
            <Popconfirm
              title="Are you sure to delete this subject?"
              onConfirm={() => handleDelete(record.id)} // Replace with the actual delete handler
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
          ) : (
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={() => handleRestore(record.id)} // Replace with the actual restore handler
              size="small"
              aria-label="Restore Subject"
            >
              Restore
            </Button>
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
          onChange={(checked) => handleAvailabilityToggle(record, checked)} // Replace with your availability toggle handler
        />
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 150,
    },
  ];
  
  

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowSelection={{
        selectedRowKeys,
        onChange: onRowSelectionChange,
      }}
      onChange={onSortChange}
      pagination={{
        current: localCurrentPage,
        pageSize: localPageSize,
        total: totalRecords,
        onChange: handlePageChange,
      }}
      scroll={{ x: 'max-content' }}
      responsive
    />
  );
};

export default SubjectTable;
