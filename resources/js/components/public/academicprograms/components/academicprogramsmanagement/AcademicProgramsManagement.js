import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Space, Alert, Modal, Row, Col } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import AcademicProgramTable from './AcademicProgramTable'; 
const { Option } = Select;

const AcademicProgramsManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [departments, setDepartments] = useState([]); 
  const [programNames, setProgramNames] = useState([]); 
  const [subjectNames, setSubjectNames] = useState([]); 
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState(null);
  const [programs, setPrograms] = useState([]); 
  const token = localStorage.getItem('authToken'); 

  
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!token) {
        setDepartmentsError("Authentication token is missing. Please log in.");
        setDepartments([]);
        return;
      }

      setDepartmentsLoading(true);
      setDepartmentsError(null);

      try {
        const response = await axios.get("/api/department", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const departmentsArray = response.data.map((department) => ({
          id: department.id,
          name: department.department_name,
        }));
        setDepartments(departmentsArray);
      } catch (error) {
        if (error.response) {
          setDepartmentsError(`Error: ${error.response.status} - ${error.response.data.message || "Failed to fetch departments."}`);
        } else if (error.request) {
          setDepartmentsError("Error: No response from server. Please try again later.");
        } else {
          setDepartmentsError(`Error: ${error.message}`);
        }
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, [token]);

  
  useEffect(() => {
    const fetchProgramNames = async () => {
      try {
        
        const mockProgramNames = [
          { id: 1, name: 'Computer Science' },
          { id: 2, name: 'Information Technology' },
          { id: 3, name: 'Data Science' },
        ];
        setProgramNames(mockProgramNames);
      } catch (error) {
        console.error("Failed to fetch program names:", error);
      }
    };

    fetchProgramNames();
  }, []);

  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        
        const mockSubjects = [
          { name: 'Introduction to Programming' },
          { name: 'Data Structures' },
          { name: 'Algorithms' },
        ];
        setSubjectNames(mockSubjects.map((sub) => sub.name));
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  
  const onFinish = (values) => {
    console.log("Form submitted:", values); 
    form.resetFields(); 
    setIsModalVisible(false); 
    setPrograms(prevPrograms => [...prevPrograms, { ...values, id: Date.now() }]); 
  };

  
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  
  const handleEdit = (program) => {
    console.log("Edit program:", program);
  };

  const handleDelete = (program) => {
    console.log("Delete program:", program);
    setPrograms(prevPrograms => prevPrograms.filter(p => p.id !== program.id)); 
  };

  return (
    <div style={{background: '#fff' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={showModal}>
          Set
        </Button>
      </div>

      <Modal
        title="Manage Academic Programs"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        
        {departmentsError && <Alert message={departmentsError} type="error" showIcon />}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16} align="middle">
            <Col span={12}>
              <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please select a department' }]}>
                <Select placeholder="Select Department" loading={departmentsLoading}>
                  {departments.map((department) => (
                    <Option key={department.id} value={department.id}>
                      {department.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Program Name"
                name="programName"
                rules={[{ required: true, message: 'Please select a program name' }]}>
                <Select placeholder="Select Program Name">
                  {programNames.map((program) => (
                    <Option key={program.id} value={program.name}>
                      {program.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Subject Name"
                name="subjectName"
                rules={[{ required: true, message: 'Please select a subject name' }]}>
                <Select placeholder="Select Subject Name">
                  {subjectNames.map((name) => (
                    <Option key={name} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                    loading={loading}
                  >
                    Save Program
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <AcademicProgramTable
        data={programs}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AcademicProgramsManagement;
