import React from 'react';
import { Table, Tag, Space, Button } from 'antd';

const EnrollmentTracking = ({ courses }) => {
  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Enrollment Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Completed' ? 'green' : 'volcano';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small">View</Button>
          <Button type="danger" size="small">Drop</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={courses}
      rowKey="courseID"
      pagination={false}
      bordered
    />
  );
};

export default EnrollmentTracking;
