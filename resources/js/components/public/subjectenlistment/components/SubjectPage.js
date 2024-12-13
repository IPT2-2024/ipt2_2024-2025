import React, { useState, useEffect } from 'react';
import { Input, Button, Space, notification, Form, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, FileTextOutlined, UnorderedListOutlined } from '@ant-design/icons'; 
import axios from 'axios';
import SubjectTable from './SubjectTable';
import SubjectModal from './SubjectModal';

const SubjectPage = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [form] = Form.useForm();

  const fetchSubjects = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/subject', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          search: searchText,
          archived: showArchived
        }
      });

      const subjects = response.data.map((subject) => ({
        id: subject.id,
        code: subject.subject_code,
        name: subject.subject_name,
        units: subject.units,
        subject_category: subject.subject_category.subject_category,
        classification: subject.classification,
        subject_description: subject.subject_description,
        availability: subject.availability,
      }));

      setData(subjects);
      setTotalRecords(response.data.total || subjects.length);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch subjects. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchText, showArchived]);

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePrint = () => {
    // Implement print functionality
    window.print();
  };

  // Add this function to SubjectPage
const handleAddSubject = async (values) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (editingSubject) {
      // Update existing subject
      await axios.put(`/api/subject/${editingSubject.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({
        message: 'Success',
        description: 'Subject updated successfully.',
      });
    } else {
      // Create new subject
      await axios.post('/api/subject', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({
        message: 'Success',
        description: 'Subject created successfully.',
      });
    }

    // Refresh data and close modal
    fetchSubjects();
    setIsModalVisible(false);
    form.resetFields();
  } catch (error) {
    console.error('Error saving subject:', error);
    notification.error({
      message: 'Error',
      description: 'Failed to save subject. Please try again later.',
    });
  }
};


  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete('/api/subject/bulk-delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedRowKeys }
      });

      notification.success({
        message: 'Success',
        description: 'Selected subjects deleted successfully.',
      });

      // Refresh data after deletion
      fetchSubjects();
      setSelectedRowKeys([]);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to delete selected subjects. Please try again later.',
      });
    }
  };

  const handleRestoreSelected = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put('/api/subject/bulk-restore', 
        { ids: selectedRowKeys },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notification.success({
        message: 'Success',
        description: 'Selected subjects restored successfully.',
      });

      // Refresh data after restoration
      fetchSubjects();
      setSelectedRowKeys([]);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to restore selected subjects. Please try again later.',
      });
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '10px' 
      }}>
        <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Input.Search
            value={searchText}
            placeholder="Search subjects"
            style={{ width: '100%', maxWidth: '300px' }}
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Button icon={<FileTextOutlined />} onClick={handlePrint}>
            Print
          </Button>
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? 'Show Active Subjects' : 'Show Archived Subjects'}
          </Button>
        </Space>
        <Space wrap style={{ flex: 1, justifyContent: 'flex-end' }}>
          {!showArchived && (
            <>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => {
                  setEditingSubject(null); // Ensure no subject is being edited
                  setIsModalVisible(true); // Show the modal
                }}
              >
                Create New Subject
              </Button>

              <Popconfirm
                title="Are you sure you want to delete the selected subjects?"
                onConfirm={handleDeleteSelected}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  disabled={selectedRowKeys.length === 0}
                >
                  Remove Selected Subjects
                </Button>
              </Popconfirm>
            </>
          )}

          {showArchived && (
            <Popconfirm
              title="Are you sure you want to restore the selected subjects?"
              onConfirm={handleRestoreSelected}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="default"
                disabled={selectedRowKeys.length === 0}
              >
                Restore Selected Subjects
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <SubjectTable 
        data={data} 
        selectedRowKeys={selectedRowKeys} 
        onRowSelectionChange={setSelectedRowKeys} 
        currentPage={currentPage} 
        pageSize={pageSize} 
        onPageChange={(page) => setCurrentPage(page)} 
        totalRecords={totalRecords} 
        loading={loading} 
        searchText={searchText} 
        onSearchChange={(e) => handleSearch(e.target.value)}
        showArchived={showArchived}
      />

      <SubjectModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        editingSubject={editingSubject}
        setEditingSubject={setEditingSubject}
        form={form}
        handleAddSubject={handleAddSubject}
      />
    </div>
  );
};

export default SubjectPage;