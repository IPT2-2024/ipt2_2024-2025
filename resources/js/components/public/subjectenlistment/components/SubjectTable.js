
import React from 'react';
import { Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const SubjectTable = ({
  data,
  selectedRowKeys,
  onRowSelectionChange,
  onSearchChange,
  onFilterChange,
  onSortChange,
  currentPage,
  pageSize,
  onPageChange,
  totalRecords,
}) => {
  const columns = [
    {
      title: 'Subject Code',
      dataIndex: 'subjectCode',
      sorter: true,
      
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
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
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined />
          <DeleteOutlined />
        </Space>
      ),
      responsive: ['xs', 'sm'], 
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
      pagination={false} 
      scroll={{ x: 'max-content' }} 
      responsive
    />
  );
};

export default SubjectTable;
