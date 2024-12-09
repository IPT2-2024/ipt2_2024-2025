import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form'; 
import axios from 'axios';

const { Option } = Select;

const UserEditModal = ({
  isVisible,
  setIsVisible,
  reloadData,
  modalData,
  setModalData,
  roles,
}) => {
  const [form] = useForm();  
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (values) => {
    setLoading(true);

    
    const updatedData = { 
      username: values.username,
      email: values.email,
      status: values.status,  
      role_id: values.role,   
    };

    
    if (values.password) {
      updatedData.password = values.password;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`/api/users/${modalData.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        message.success('User updated successfully');
        reloadData();  
        setIsVisible(false);  
      }
    } catch (error) {
      message.error(`Failed to update user: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (modalData) {
      form.setFieldsValue({
        username: modalData.username,
        email: modalData.email,
        status: modalData.status,  
        role: modalData.role_id,   
      });
    }
  }, [modalData, form]);

  return (
    <Modal
      title="Edit User"
      visible={isVisible}
      onCancel={() => setIsVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={loading}
        >
          {loading ? <Spin /> : 'Save Changes'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'active',  
        }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input the username' },
            { max: 50, message: 'Username should not be longer than 50 characters' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email' },
            { type: 'email', message: 'Please enter a valid email' },
            { max: 100, message: 'Email should not be longer than 100 characters' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { min: 8, message: 'Password must be at least 8 characters' },
            { max: 50, message: 'Password should not be longer than 50 characters' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select the user status' }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="archived">Archived</Option>
            <Option value="regular">Regular</Option>
            <Option value="irregular">Irregular</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select role">
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
