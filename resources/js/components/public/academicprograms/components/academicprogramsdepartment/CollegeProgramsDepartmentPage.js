import React, { useState, useEffect } from 'react';
import { Form, Button, Space, Typography, Row, Col, notification, Spin, Alert } from 'antd'; // Add Spin here
import { SaveOutlined } from '@ant-design/icons';
import DepartmentSelect from './components/DepartmentSelect';
import ProgramSelect from './components/ProgramSelect';
import AssignmentsTable from './components/AssignmentsTable';
import axios from 'axios';

const { Title } = Typography;

const CollegeProgramsDepartmentPage = () => {
  const [form] = Form.useForm();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth_token");

  // Fetch programs dynamically
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/collegeprogram", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          const mappedPrograms = response.data.map((programItem) => {
            return {
              id: programItem.id,
              name: programItem.college_programs || programItem.program_name || 'Unknown Program',
            };
          });

          setPrograms(mappedPrograms);
        } else {
          setError("Unexpected response format. Expected an array.");
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError(
          err.response?.data?.message || "An unknown error occurred while fetching programs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [token]);

  // Check if a program is already assigned to any department
  const isProgramAssigned = (selectedDepartment, selectedPrograms, editingKey) => {
    return assignments.some(
      (assignment) =>
        assignment.key !== editingKey && // Exclude the currently edited row
        assignment.programs.some((program) => selectedPrograms.includes(program))
    );
  };

  // Check if a department is already assigned
  const isDepartmentAssigned = (selectedDepartment, editingKey) => {
    return assignments.some(
      (assignment) => assignment.department === selectedDepartment && assignment.key !== editingKey
    );
  };

  const onFinish = (values) => {
    const { department, program } = values;
  
    // Check if the department is already assigned
    if (isDepartmentAssigned(department, editingRecord?.key)) {
      notification.error({
        message: 'Error',
        description: `The department ${department} is already assigned.`,
      });
      return;
    }
  
    // Check if any of the selected programs are already assigned
    if (isProgramAssigned(department, program, editingRecord?.key)) {
      notification.error({
        message: 'Error',
        description: `One or more selected programs are already assigned to another department.`,
      });
      return;
    }
  
    const newAssignment = {
      key: editingRecord ? editingRecord.key : assignments.length + 1,
      department,
      programs: program,
    };
  
    // Extract the program names
    const programNames = programs.filter(p => program.includes(p.id)).map(p => p.name).join(', ');
  
    if (editingRecord) {
      // Update existing record
      setAssignments((prev) =>
        prev.map((record) => (record.key === editingRecord.key ? newAssignment : record))
      );
      setIsEditing(false);
      setEditingRecord(null);
    } else {
      // Add new record
      setAssignments([...assignments, newAssignment]);
    }
  
    notification.success({
      message: 'Success',
      description: `Program(s) ${programNames} have been successfully assigned to ${department} department.`,
    });
  
    form.resetFields();
  };
  

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue({
      department: record.department,
      program: record.programs,
    });
  };

  if (loading) {
    return <Spin tip="Loading programs..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      <Title level={3}>Assign Academic Program to Department</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={16}>
          {/* Department Select */}
          <Col xs={24} sm={12} md={11}>
            <DepartmentSelect />
          </Col>

          {/* Program Select */}
          <Col xs={24} sm={12} md={11}>
            <Form.Item
              name="program"
              rules={[{ required: true, message: 'Please select at least one academic program' }]}
            >
              <ProgramSelect programs={programs} />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              {isEditing ? 'Save Changes' : 'Assign Program(s)'}
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Display Assignments in a Table */}
      <AssignmentsTable
        assignments={assignments}
        handleEdit={handleEdit}
        programList={programs} // Pass the programs list here
      />
    </div>
  );
};

export default CollegeProgramsDepartmentPage;
