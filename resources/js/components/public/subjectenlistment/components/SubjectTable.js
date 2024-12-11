import React, { useState } from 'react';
import { Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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

  const isMobile = useMediaQuery({ maxWidth: 767 }); // Define mobile breakpoint

  const handleEdit = (record) => {
    console.log('Edit:', record);
  };

  const handleDelete = (record) => {
    console.log('Delete:', record);
  };

  const columns = [
    {
      title: 'Subject Code',
      dataIndex: 'code',
      sorter: true,
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Subject Name',
      dataIndex: 'name',
      sorter: true,
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
      responsive: ['xs', 'sm'],
    },
    {
      title: 'Units',
      dataIndex: 'units',
      sorter: true,
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      responsive: ['xs', 'sm', 'md'],
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
