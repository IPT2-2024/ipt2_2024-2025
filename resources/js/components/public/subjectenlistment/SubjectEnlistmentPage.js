import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Input, Button, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import MainDashboard from '../dashboard/components/MainDashboard'; 
import SubjectTable from './components/SubjectTable'; 

const { Content } = Layout;

const SubjectEnlistmentPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0); 
  const pageSize = 5;

  const [data, setData] = useState([]);

  const navigate = useNavigate();  // Initialize the useNavigate hook

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/subjects', {
        params: {
          page: currentPage,
          pageSize,
          search: searchText,
          filter: filterType,
          sort: sortOrder,
        },
      });
      setData(response.data.subjects); 
      setTotalRecords(response.data.total); 
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchText, filterType, sortOrder]); 

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); 
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onSortChange = (columnKey) => {
    const newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
    setSortOrder(newSortOrder);
  };

  return (
    <MainDashboard>
      <Content style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '14px' }}>Subject Enlistment Management</h3>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="Search subjects"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={onSearchChange}
            />
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/add-subject')}  // Use navigate for redirection
            >
              Add Subject
            </Button>
          </Col>
        </Row>

        <SubjectTable
          data={data}
          selectedRowKeys={selectedRowKeys}
          onRowSelectionChange={setSelectedRowKeys}
          onSearchChange={onSearchChange}
          onFilterChange={setFilterType}
          onSortChange={onSortChange}
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
        
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          onChange={onPageChange}
          showSizeChanger={false}
          style={{ marginTop: '20px' }}
        />
      </Content>
    </MainDashboard>
  );
};

export default SubjectEnlistmentPage;
