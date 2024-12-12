import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Input, Button, Pagination, Modal, Form, Select, notification } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainDashboard from '../dashboard/components/MainDashboard';
import SubjectTable from './components/SubjectTable';

const { Content } = Layout;

const SubjectEnlistmentPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form] = Form.useForm();

  const pageSize = 5;

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/subject', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Fetched Subjects:', response.data); // Debugging API response

      const subjects = response.data.map((subject) => ({
        id: subject.id,
        code: subject.subject_code,
        name: subject.subject_name,
        units: subject.units,
        subject_category: subject.subject_category.subject_category,
        availability: subject.availability,
      }));

      setData(subjects);
      setTotalRecords(subjects.length);
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
  }, [currentPage, searchText]);

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <MainDashboard>
      <Content style={{ padding: '20px' }}>
        <h3>Subject Enlistment Management</h3>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="Search subjects"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={onSearchChange}
            />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingSubject(null);
                setIsModalVisible(true);
              }}
            >
              Add Subject
            </Button>
          </Col>
        </Row>

        <SubjectTable
          data={data}
          selectedRowKeys={selectedRowKeys}
          onRowSelectionChange={setSelectedRowKeys}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
          totalRecords={totalRecords}
          loading={loading}
        />

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          onChange={onPageChange}
          style={{ marginTop: '20px', textAlign: 'center' }}
        />
      </Content>
    </MainDashboard>
  );
};

export default SubjectEnlistmentPage;
