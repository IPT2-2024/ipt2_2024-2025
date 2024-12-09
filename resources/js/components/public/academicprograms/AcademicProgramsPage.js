import React, { useState } from 'react';
import { Form, Input, Select, Button, Checkbox, Space, Typography } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import MainDashboard from '../dashboard/components/MainDashboard';  // Adjust the path if needed

const { Option } = Select;
const { Title } = Typography;

const AcademicProgramsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Handle form submission (UI-only)
  const onFinish = (values) => {
    console.log("Form submitted:", values);  // Placeholder for form submission
    form.resetFields();  // Reset form fields after submission
  };

  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#fff' }}>
        {/* Smaller header by changing the Title level */}
        <Title level={3}>Academic Program Management</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: true, // Default value for active programs
          }}
        >
          {/* Program Name */}
          <Form.Item
            label="Program Name"
            name="programName"
            rules={[{ required: true, message: 'Please enter the program name' }]}
          >
            <Input placeholder="Enter Program Name" />
          </Form.Item>

          {/* Department */}
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Please select the department' }]}
          >
            <Select placeholder="Select Department">
              <Option value="cs">Computer Science</Option>
              <Option value="it">Information Technology</Option>
              <Option value="math">Mathematics</Option>
              {/* Add more departments as needed */}
            </Select>
          </Form.Item>

          {/* Year Level */}
          <Form.Item
            label="Year Level"
            name="yearLevel"
            rules={[{ required: true, message: 'Please select the year level' }]}
          >
            <Select placeholder="Select Year Level">
              <Option value="1">1st Year</Option>
              <Option value="2">2nd Year</Option>
              <Option value="3">3rd Year</Option>
              <Option value="4">4th Year</Option>
              {/* Add more year levels as needed */}
            </Select>
          </Form.Item>

          {/* Program Type */}
          <Form.Item
            label="Program Type"
            name="programType"
            rules={[{ required: true, message: 'Please select the program type' }]}
          >
            <Select placeholder="Select Program Type">
              <Option value="undergraduate">Undergraduate</Option>
              <Option value="graduate">Graduate</Option>
            </Select>
          </Form.Item>

          {/* Duration */}
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: 'Please enter the duration (in years)' }]}
          >
            <Input placeholder="Enter Duration in years" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please provide a description of the program' }]}
          >
            <Input.TextArea placeholder="Program Description" rows={4} />
          </Form.Item>

          {/* Active Program (Checkbox or Toggle) */}
          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Is Active</Checkbox>
          </Form.Item>

          {/* Submission Button */}
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                htmlType="submit" 
                loading={loading}
              >
                Add Program
              </Button>
              <Button 
                icon={<SaveOutlined />} 
                onClick={() => form.submit()}
                loading={loading}
              >
                Save Program
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </MainDashboard>
  );
};

export default AcademicProgramsPage;
