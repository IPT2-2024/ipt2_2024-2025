import React, { useState, useEffect } from 'react';
import { Form, Select, Spin, Alert } from 'antd';
import axios from 'axios';

const { Option } = Select;

const DepartmentSelect = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth_token"); 

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/department", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setDepartments(
          response.data.map((department) => ({
            id: department.id,
            name: department.department_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError(
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) { // Only fetch departments if the token exists
      fetchDepartments();
    }
  }, [token]);

  if (loading) {
    return <Spin tip="Loading departments..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <Form.Item
      label="Department"
      name="department"
      rules={[{ required: true, message: 'Please select a department' }]}
    >
      <Select
        showSearch
        placeholder="Select Department"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {departments.map((department) => (
          <Option key={department.id} value={department.name}>
            {department.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default DepartmentSelect;
