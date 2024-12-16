import React from 'react';
import { Button, Table } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const AssignmentsTable = ({ assignments, handleEdit, programList = [] }) => {



  const columns = [
    {
      title: <span style={{ color: '#1890ff' }}>Action</span>,
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ margin: '0 auto', backgroundColor: '#1890ff', color: 'white' }}
        />
      ),
      responsive: ['xs', 'sm', 'md'], 
    },
    {
      title: <span style={{ color: '#1890ff' }}>Department</span>,
      dataIndex: 'department',
      key: 'department',
      responsive: ['xs', 'sm'], 
    },
    {
      title: <span style={{ color: '#1890ff' }}>Programs</span>,
      dataIndex: 'programs',
      key: 'programs',
      render: (programs) => (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {programs && programs.length > 0 ? (
            programs.map((programId, index) => {
             
              const program = programList.find((program) => program.id === programId);
              const programName = program ? program.name : 'Unknown Program'; 
              return <li key={index}>{programName}</li>;
            })
          ) : (
            <li>No programs selected</li>
          )}
        </ul>
      ),
      responsive: ['xs', 'sm', 'md'], // Adjust visibility on small screens
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={assignments}
      style={{ marginTop: '20px' }}
      rowKey="key"
      pagination={false} // You can enable pagination if needed
      scroll={{ x: 'max-content' }} // This allows horizontal scroll on small screens
      responsive // This enables responsiveness
    />
  );
};

export default AssignmentsTable;
