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
  const [filterType, setFilterType] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
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
        const response = await axios.get('/api/subject', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });

        const subjects = response.data;
        const activeSubjects = subjects.filter(floor => !subject.isArchived);
        const archivedSubjects = subjects.filter(floor => subject.isArchived);

        setData(activeSubjects);
        setArchivedData(archivedSubjects);

        if (showArchived) {
            setFilteredData(archivedSubjects);
        } else {
            setFilteredData(activeSubjects);
        }
        setCurrentPage(1);
    } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to fetch subject data.');
        message.error('Failed to fetch subject data.');
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchText]);

  const handleAddSubject = async (values) => {
    try {
      const token = localStorage.getItem('auth_token');
      const url = editingSubject ? `/api/subject/${editingSubject.id}` : '/api/subject';
      const method = editingSubject ? 'put' : 'post';
      const response = await axios[method](
        url,
        { name: values.name, code: values.code, classification: values.classification, units: values.units, availability: values.availability},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notification.success({
        message: 'Success',
        description: editingSubject
          ? 'Subject updated successfully.'
          : 'Subject added successfully.',
      });

      setIsModalVisible(false);
      form.resetFields();

      if (editingSubject) {
        setData((prevData) =>
          prevData.map((subject) =>
            subject.id === editingSubject.id ? response.data.subject : subject
          )
        );
      } else {
        setData((prevData) => [response.data.subject, ...prevData]);
        setTotalRecords((prevTotal) => prevTotal + 1);
      }

      setEditingSubject(null);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to save the subject. Please try again later.',
      });
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setIsModalVisible(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action will delete the subject permanently.',
      onOk: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          await axios.delete(`/api/subject/${subjectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          notification.success({
            message: 'Success',
            description: 'Subject deleted successfully.',
          });
          fetchSubjects();
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Failed to delete subject. Please try again later.',
          });
        }
      },
    });
  };

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
      key: 'classification',
    },
    {
      title: 'Units',
      dataIndex: 'units',
      key: 'units',
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
    },
  ];

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
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
        />

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          onChange={onPageChange}
          style={{ marginTop: '20px', textAlign: 'center' }}
        />

        <Modal
          title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleAddSubject}>
            <Form.Item
              label="Subject Name"
              name="name"
              rules={[{ required: true, message: 'Please enter the subject name' }]}
            >
              <Input placeholder="Enter subject name" />
            </Form.Item>
            <Form.Item
              label="Subject Code"
              name="code"
              rules={[{ required: true, message: 'Please enter the subject code' }]}
            >
              <Input placeholder="Enter subject code" />
            </Form.Item>
            <Form.Item
              label="Classification"
              name="classification"
              rules={[{ required: true, message: 'Please choose classification.' }]}
            >
              <Select placeholder="Select classification">
                 <Option value="major">Major</Option>
                 <Option value="minor">Minor</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Units"
              name="units"
              rules={[{ required: true, message: 'Please enter the amount of units.' }]}
            >
              <Input placeholder="Enter amount of units" />
            </Form.Item>
            <Form.Item
              label="Availability"
              name="availability"
              rules={[{ required: true, message: 'Please choose the availability.' }]}
            >
              <Select placeholder="Select availability">
                 <Option value="avail">Available</Option>
                 <Option value="notavail">Not Available</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </MainDashboard>
  );
};

export default SubjectEnlistmentPage;
