import React, { useState } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

const { Option } = Select;
const SubjectModal = ({ isModalVisible, setIsModalVisible, editingSubject, setEditingSubject, form, handleAddSubject }) => {

    const handleOk = () => {
        form
          .validateFields() // Validate all fields
          .then((values) => {
            // Call the provided handleAddSubject function
            handleAddSubject(values);
          })
          .catch((errorInfo) => {
            console.error('Validation Failed:', errorInfo);
          });
      };
      

  return (
    <Modal
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
        visible={isModalVisible}
        onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
        }}
        onOk={handleOk} // Use the handleOk function
        >
      
      <Form form={form} layout="vertical" onFinish={handleAddSubject}>
        <Form.Item
          label="Subject Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the subject name.' }]}
        >
          <Input placeholder="Enter subject name" />
        </Form.Item>
        <Form.Item
          label="Subject Code"
          name="code"
          rules={[{ required: true, message: 'Please enter the subject code.' }]}
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
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter subject description.' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please choose subject category.' }]}
        >
          <Select placeholder="Select category">
            {/* Add your category options here */}
          </Select>
        </Form.Item>
        <Form.Item
          label="Availability"
          name="availability"
          rules={[{ required: true, message: 'Toggle Availability' }]}
          initialValue={editingSubject?.availability}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectModal;