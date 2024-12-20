import React, { useState, useEffect } from 'react';
import { Form, Select, Spin, Alert } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ProgramSelect = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth_token"); // Verify this matches your backend implementation

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
              id: programItem.id, // Ensure this field exists in the response
              name: programItem.college_programs || programItem.program_name || 'Unknown Program', // Fallback value
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

  if (loading) {
    return <Spin tip="Loading programs..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <Form.Item
      label="Program(s)"
      name="program"
      
    >
      <Select
        mode="multiple"
        showSearch
        placeholder="Select College Program"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {programs.map((program) => (
          <Option key={program.id} value={program.id}>
            {program.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default ProgramSelect;
