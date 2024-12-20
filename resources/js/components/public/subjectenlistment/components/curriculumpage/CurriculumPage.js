// CurriculumPage.js
import React, { useState, useEffect } from 'react';
import { Input, Button, Space, notification, Form, Popconfirm } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'; 
import axios from 'axios';
import CurriculumTable from './CurriculumTable';
import CurriculumModal from './CurriculumModal';
import { generateCurriculumPrintHTML } from './printUtils';

const CurriculumPage = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // To store all data for client-side search
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [form] = Form.useForm();

  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      // Always fetch all data so client-side search can work:
      const response = await axios.get('/api/curriculum', {
        headers: { Authorization: `Bearer ${token}` },
        params: { all: true, ...(showArchived && { deleted: 'only' }) }
      });
  
      const curriculumsArray = Array.isArray(response.data)
        ? response.data
        : response.data.data;
  
      const curriculums = curriculumsArray.map((curriculum) => ({
        id: curriculum.id,
        objective: curriculum.objective,
        curriculum_type: curriculum.curriculum_type,
        resources: curriculum.resources,
        prerequisite: curriculum.prerequisite,
        assessment: curriculum.assessment,
        method: curriculum.method,
        content: curriculum.content,
        number_of_hours: curriculum.number_of_hours,
        created_at: curriculum.created_at,
        updated_at: curriculum.updated_at,
        deleted_at: curriculum.deleted_at,
      }));
  
      // Store all fetched data for client-side search:
      setAllData(curriculums);
      // If currently not searching, show all:
      if (searchText.trim() === '') {
        setData(curriculums);
        setTotalRecords(curriculums.length);
      } else {
        // If a search is active, filter immediately:
        const filteredData = curriculums.filter((c) =>
          Object.values(c).some((value) =>
            value?.toString().toLowerCase().includes(searchText.toLowerCase())
          )
        );
        setData(filteredData);
        setTotalRecords(filteredData.length);
      }
    } catch (error) {
      console.error('Error fetching curriculums:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch curriculums. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCurriculums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, showArchived]);

  // **Effect to handle searchText changes**
  useEffect(() => {
    if (searchText.trim() === '') {
      // If search is cleared, show all curriculums from allData
      setData(allData);
      setTotalRecords(allData.length);
    } else {
      const filteredData = allData.filter((curriculum) =>
        Object.values(curriculum).some((value) =>
          value?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setData(filteredData);
      setTotalRecords(filteredData.length);
    }
  }, [searchText, allData]);
  

  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handler for printing
  const handlePrint = () => {
    const htmlContent = generateCurriculumPrintHTML(data, showArchived);
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleAddCurriculum = async (values) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (editingCurriculum) {
        await axios.put(`/api/curriculum/${editingCurriculum.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        notification.success({
          message: 'Success',
          description: 'Curriculum updated successfully.',
        });
      } else {
        await axios.post('/api/curriculum', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        notification.success({
          message: 'Success',
          description: 'Curriculum created successfully.',
        });
      }

      fetchCurriculums();
      setIsModalVisible(false);
      form.resetFields();
      setEditingCurriculum(null);
    } catch (error) {
      console.error('Error saving curriculum:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to save curriculum. Please try again later.',
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem('auth_token');
  
      // Create an array of DELETE request promises
      const deletePromises = selectedRowKeys.map((id) =>
        axios.delete(`/api/curriculum/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
  
      // Wait for all DELETE requests to complete
      await Promise.all(deletePromises);
  
      notification.success({
        message: 'Success',
        description: 'Selected curriculums deleted successfully.',
      });
  
      fetchCurriculums();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Error deleting selected curriculums:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete selected curriculums. Please try again later.',
      });
    }
  };
  
  const handleRestoreSelected = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const restorePromises = selectedRowKeys.map((id) =>
        axios.put(`/api/curriculum/${id}/restore`, {}, {
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
          description: `${fulfilled.length} curriculum(s) restored successfully.`,
        });
      }
  
      if (rejected.length > 0) {
        notification.error({
          message: 'Partial Failure',
          description: `${rejected.length} curriculum(s) failed to restore.`,
        });
        console.error('Failed restorations:', rejected);
      }
  
      fetchCurriculums();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Error restoring selected curriculums:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to restore selected curriculums. Please try again later.',
      });
    }
  };
  
  const handleEditCurriculum = (curriculum) => {
    setEditingCurriculum(curriculum);
    setIsModalVisible(true);
  };

  const handleDeleteCurriculum = async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`/api/curriculum/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      notification.success({
        message: 'Success',
        description: 'Curriculum deleted successfully.',
      });
  
      fetchCurriculums();
    } catch (error) {
      console.error('Error deleting curriculum:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete curriculum. Please try again later.',
      });
    }
  };
  
  const handleRestoreCurriculum = async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`/api/curriculum/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      notification.success({
        message: 'Success',
        description: 'Curriculum restored successfully.',
      });
  
      fetchCurriculums();
    } catch (error) {
      console.error('Error restoring curriculum:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to restore curriculum. Please try again later.',
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
            placeholder="Search curriculum"
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
            {showArchived ? 'Show Active Curriculums' : 'Show Archived Curriculums'}
          </Button>
        </Space>
        <Space wrap style={{ flex: 1, justifyContent: 'flex-end' }}>
          {!showArchived && (
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingCurriculum(null);
                  setIsModalVisible(true);
                }}
              >
                Create New Curriculum
              </Button>

              <Popconfirm
                title="Are you sure you want to delete the selected curriculums?"
                onConfirm={handleDeleteSelected}
                okText="Yes"
                cancelText="No"
              >
                <Button danger disabled={selectedRowKeys.length === 0}>
                  Remove Selected Curriculums
                </Button>
              </Popconfirm>
            </>
          )}

          {showArchived && (
            <Popconfirm
              title="Are you sure you want to restore the selected curriculums?"
              onConfirm={handleRestoreSelected}
              okText="Yes"
              cancelText="No"
            >
              <Button type="default" disabled={selectedRowKeys.length === 0}>
                Restore Selected Curriculums
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <CurriculumTable 
        data={data}
        selectedRowKeys={selectedRowKeys} 
        onRowSelectionChange={handleRowSelectionChange} 
        currentPage={currentPage} 
        pageSize={pageSize} 
        onPageChange={(page) => setCurrentPage(page)} 
        totalRecords={totalRecords} 
        loading={loading} 
        handleEditCurriculum={handleEditCurriculum}
        handleDeleteCurriculum={handleDeleteCurriculum}
        handleRestoreCurriculum={handleRestoreCurriculum} 
        showArchived={showArchived} 
        searchText={searchText} // Pass searchText to the table if needed
      />

      <CurriculumModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        editingCurriculum={editingCurriculum}
        setEditingCurriculum={setEditingCurriculum}
        form={form}
        handleAddCurriculum={handleAddCurriculum}
      />
    </div>
  );
};

export default CurriculumPage;
