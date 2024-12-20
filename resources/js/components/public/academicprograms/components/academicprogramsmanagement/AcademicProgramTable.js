import React from 'react';
import { Table } from 'antd';

const AcademicProgramTable = ({ data, loading }) => {
  const columns = [
    {
      title: 'Subject Code',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Subject Description',
      dataIndex: 'subjectDescription',
      key: 'subjectDescription',
    },
    {
      title: 'Units',
      dataIndex: 'units',
      key: 'units',
    },
    {
      title: 'Curriculum',
      dataIndex: 'curriculum',
      key: 'curriculum',
    },
    {
      title: 'Subject Category',
      dataIndex: 'subjectCategory',
      key: 'subjectCategory',
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id" // Adjust the key if your data uses a different identifier
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AcademicProgramTable;
