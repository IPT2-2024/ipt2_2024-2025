import React, { useState } from 'react';
import { Form, Button, Space, Typography, Row, Col, notification } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import DepartmentSelect from './components/DepartmentSelect';
import ProgramSelect from './components/ProgramSelect';
import { programs, departments } from './components/data';

const { Title } = Typography;

const AcademicProgramsDepartment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Program(s) assigned:", values);
    notification.success({
      message: 'Success',
      description: `Program(s) ${values.program.join(', ')} have been successfully assigned to ${values.department} department.`,
    });
    form.resetFields();
  };

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
            <DepartmentSelect departments={departments} />
          </Col>

          {/* Program Select */}
          <Col xs={24} sm={12} md={11}>
            <ProgramSelect programs={programs} />
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
              Assign Program(s)
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AcademicProgramsDepartment;
