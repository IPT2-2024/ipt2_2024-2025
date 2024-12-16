// CurriculumTable.js
import React, { useEffect } from 'react';
import { Table, Space, Button, Popconfirm, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { FileExclamationOutlined } from '@ant-design/icons';

const CurriculumTable = ({
  data,
  selectedRowKeys,
  onRowSelectionChange,
  onSortChange,
  currentPage: propCurrentPage,
  pageSize: propPageSize,
  onPageChange,
  totalRecords,
  handleEditCurriculum,
  handleDeleteCurriculum,
  handleRestoreCurriculum,
  showArchived,
  loading,
  searchText,
}) => {
  const [localCurrentPage, setLocalCurrentPage] = React.useState(propCurrentPage || 1);
  const localPageSize = propPageSize || 5;

  // Function for handling page change
  const handlePageChangeInternal = (page) => {
    setLocalCurrentPage(page); // Update the local current page when changed
    if (onPageChange) {
      onPageChange(page); // Call the prop handler if provided
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleEdit = (record) => {
    console.log('Edit:', record);
    if (handleEditCurriculum) {
      handleEditCurriculum(record);
    }
  };

  const handleDelete = (id) => {
    console.log('Delete:', id);
    if (handleDeleteCurriculum) {
      handleDeleteCurriculum(id);
    }
  };

  const handleRestore = (id) => {
    console.log('Restore:', id);
    if (handleRestoreCurriculum) {
      handleRestoreCurriculum(id);
    }
  };

  let columns = [
    {
      title: <span style={{ color: '#1890ff' }}>Actions</span>,
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!showArchived && (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                size="small"
                aria-label="Edit Curriculum"
              />
              {record.availability === true && (
                <Popconfirm
                  title="Are you sure to delete this curriculum?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    size="small"
                    aria-label="Delete Curriculum"
                  />
                </Popconfirm>
              )}
            </>
          )}
          {showArchived && (
            <Popconfirm
              title="Are you sure you want to restore this curriculum?"
              onConfirm={() => handleRestore(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="default"
                icon={<ReloadOutlined />}
                size="small"
                aria-label="Restore Curriculum"
              >
                Restore
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 100,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Objective</span>,
      dataIndex: 'objective',
      key: 'objective',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 200,
      sorter: (a, b) => a.objective.localeCompare(b.objective),
    },
    {
      title: <span style={{ color: '#1890ff' }}>Curriculum Type</span>,
      dataIndex: 'curriculum_type',
      key: 'curriculum_type',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 50,
      sorter: (a, b) => a.curriculum_type.localeCompare(b.curriculum_type),
    },
    {
      title: <span style={{ color: '#1890ff' }}>Resources</span>,
      dataIndex: 'resources',
      key: 'resources',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 100,
      sorter: (a, b) => a.resources.localeCompare(b.resources),
    },
    {
      title: <span style={{ color: '#1890ff' }}>Prerequisite</span>,
      dataIndex: 'prerequisite',
      key: 'prerequisite',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 30,
      sorter: (a, b) => a.prerequisite.localeCompare(b.prerequisite),
    },
    {
      title: <span style={{ color: '#1890ff' }}>Assessment</span>,
      dataIndex: 'assessment',
      key: 'assessment',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 180,
      sorter: (a, b) => a.assessment.localeCompare(b.assessment),
    },
    {
      title: <span style={{ color: '#1890ff' }}>Method</span>,
      dataIndex: 'method',
      key: 'method',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 180,
      sorter: (a, b) => a.method.localeCompare(b.method),
    },
    {
      title: <span style={{ color: '#1890ff' }}>Content</span>,
      dataIndex: 'content',
      key: 'content',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 150,
      sorter: (a, b) => a.content.localeCompare(b.content),
    },
    {
      title: <span style={{ color: '#1890ff' }}>Number of hours</span>,
      dataIndex: 'number_of_hours',
      key: 'number_of_hours',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      width: 50,
      sorter: (a, b) => a.number_of_hours - b.number_of_hours,
    },
  ];

  // **Conditionally add the `deleted_at` column**
  if (showArchived) {
    columns.push({
      title: <span style={{ color: '#1890ff' }}>Deleted At</span>,
      dataIndex: 'deleted_at',
      key: 'deleted_at',
      responsive: ['md', 'lg', 'xl'],
      width: 180,
      sorter: (a, b) => new Date(a.deleted_at) - new Date(b.deleted_at),
      render: (deletedAt) => (deletedAt ? new Date(deletedAt).toLocaleString() : '-'),
    });
  }

  // **Custom Empty Text Based on `showArchived` and `searchText`**
  const getEmptyText = () => {
    if (searchText.trim() !== '') {
      return (
        <Empty
          image={<FileExclamationOutlined style={{ fontSize: 48, color: '#1890ff' }} />}
          description="No curriculums match your search."
        />
      );
    }

    if (showArchived) {
      return (
        <Empty
          image={<FileExclamationOutlined style={{ fontSize: 48, color: '#1890ff' }} />}
          description="No archived curriculums found."
        />
      );
    }

    return (
      <Empty
        image={<FileExclamationOutlined style={{ fontSize: 48, color: '#1890ff' }} />}
        description="No curriculums found."
      />
    );
  };

  // **Debugging: Log columns and data when showArchived changes**
  useEffect(() => {
    console.log('Columns:', columns);
    console.log('Data:', data);
  }, [columns, data]);

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
        showSizeChanger: false, // Disable page size changer for simplicity
      }}
      scroll={{ x: 'max-content' }}
      responsive
      loading={loading}
      rowClassName={(record) => (record.deleted_at ? 'archived-row' : '')}
      locale={{
        emptyText: getEmptyText(),
      }}
    />
  );
};

export default CurriculumTable;
