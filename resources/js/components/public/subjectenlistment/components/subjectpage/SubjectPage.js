// SubjectPage.js
import React, { useState, useEffect } from 'react';
import { Input, Button, Space, notification, Form, Popconfirm } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'; 
import axios from 'axios';
import SubjectTable from './SubjectTable';
import SubjectModal from './SubjectModal';
import { generateSubjectPrintHTML } from './printUtils';

const SubjectPage = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // New state to store all subjects
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
      
      // Always fetch all data for client-side search:
      const params = {
        all: true, // Assuming 'all=true' fetches all subjects
        ...(showArchived && { deleted: 'only' }),
      };

      const response = await axios.get('/api/subject', {
        headers: { Authorization: `Bearer ${token}` }, 
        params,
      });

      console.log('API Response:', response.data);

      const subjectsArray = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      const subjects = subjectsArray.map((subject) => ({
        id: subject.id,
        subject_code: subject.subject_code,
        subject_name: subject.subject_name,
        units: subject.units,
        classification: subject.classification,
        subject_description: subject.subject_description,
        availability: subject.availability,
        subject_category: subject.subject_category.subject_category,
        created_at: subject.created_at,   
        updated_at: subject.updated_at,       
        deleted_at: subject.deleted_at,      
      }));

      console.log('Fetched Subjects:', subjects); // **Debugging**

      // Store all fetched data for client-side search:
      setAllData(subjects);

      if (searchText.trim() === '') {
        // If not searching, display all data with pagination:
        const paginatedData = subjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setData(paginatedData);
        setTotalRecords(subjects.length);
      } else {
        // If searching, filter the data
        const filteredData = subjects.filter((subject) =>
          Object.values(subject).some((value) =>
            value?.toString().toLowerCase().includes(searchText.toLowerCase())
          )
        );
        setData(filteredData);
        setTotalRecords(filteredData.length);
        setCurrentPage(1); // Reset to first page after search
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  // **Effect to handle searchText and pagination changes**
  useEffect(() => {
    if (searchText.trim() === '') {
      // If search is cleared, paginate allData
      const paginatedData = allData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      setData(paginatedData);
      setTotalRecords(allData.length);
    } else {
      // Perform client-side filtering
      const filteredData = allData.filter((subject) =>
        Object.values(subject).some((value) =>
          value?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setData(filteredData);
      setTotalRecords(filteredData.length);
      setCurrentPage(1); // Reset to first page after search
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, allData, currentPage]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handler for printing
  const handlePrint = () => {
    const htmlContent = generateSubjectPrintHTML(data, showArchived);
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for the content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const handleAddSubject = async (values) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (editingSubject) {
        await axios.put(`/api/subject/${editingSubject.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        notification.success({
          message: 'Success',
          description: 'Subject updated successfully.',
        });
      } else {
        await axios.post('/api/subject', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        notification.success({
          message: 'Success',
          description: 'Subject created successfully.',
        });
      }

      fetchSubjects();
      setIsModalVisible(false);
      form.resetFields();
      setEditingSubject(null);
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
  
      // Create an array of DELETE request promises
      const deletePromises = selectedRowKeys.map((id) =>
        axios.delete(`/api/subject/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
  
      // Wait for all DELETE requests to complete
      await Promise.all(deletePromises);
  
      notification.success({
        message: 'Success',
        description: 'Selected subjects deleted successfully.',
      });
  
      fetchSubjects();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Error deleting selected subjects:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete selected subjects. Please try again later.',
      });
    }
  };
  
  const handleRestoreSelected = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const restorePromises = selectedRowKeys.map((id) =>
        axios.post(`/api/subject/${id}/restore`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => ({ id, status: 'fulfilled' }))
        .catch((error) => ({ id, status: 'rejected', error }))
      );
  
      const results = await Promise.all(restorePromises);
  
      const fulfilled = results.filter(result => result.status === 'fulfilled').map(result => result.id);
      const rejected = results.filter(result => result.status === 'rejected');
  
      if (fulfilled.length > 0) {
        notification.success({
          message: 'Partial Success',
          description: `${fulfilled.length} subject(s) restored successfully.`,
        });
      }
  
      if (rejected.length > 0) {
        notification.error({
          message: 'Partial Failure',
          description: `${rejected.length} subject(s) failed to restore.`,
        });
        console.error('Failed restorations:', rejected);
      }
  
      fetchSubjects(); // Corrected from fetchSubject() to fetchSubjects()
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Error restoring selected subjects:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to restore selected subjects. Please try again later.',
      });
    }
  };
  
  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsModalVisible(true);
  };

  const handleDeleteSubject = async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`/api/subject/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      notification.success({
        message: 'Success',
        description: 'Subject deleted successfully.',
      });
  
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete subject. Please try again later.',
      });
    }
  };
  
  const handleRestoreSubject = async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`/api/subject/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      notification.success({
        message: 'Success',
        description: 'Subject restored successfully.',
      });
  
      fetchSubjects();
    } catch (error) {
      console.error('Error restoring subject:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to restore subject. Please try again later.',
      });
    }
  };
  
  const handleRowSelectionChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Input.Search
            value={searchText}
            placeholder="Search subject"
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
            onClick={() => {
              setShowArchived(!showArchived);
              console.log('Show Archived:', !showArchived); // **Debugging**
            }}
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
                  setEditingSubject(null);
                  setIsModalVisible(true);
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
                <Button danger disabled={selectedRowKeys.length === 0}>
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
              <Button type="default" disabled={selectedRowKeys.length === 0}>
                Restore Selected Subjects
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <SubjectTable 
        data={data}
        selectedRowKeys={selectedRowKeys} 
        onRowSelectionChange={handleRowSelectionChange} 
        currentPage={currentPage} 
        pageSize={pageSize} 
        onPageChange={(page) => setCurrentPage(page)} 
        totalRecords={totalRecords} 
        loading={loading} // Already passed
        handleEditSubject={handleEditSubject}
        handleDeleteSubject={handleDeleteSubject}
        handleRestoreSubject={handleRestoreSubject} 
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
