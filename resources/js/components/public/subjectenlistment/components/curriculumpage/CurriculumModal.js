import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Spin, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const CurriculumModal = ({
  isModalVisible,
  setIsModalVisible,
  editingCurriculum,
  setEditingCurriculum,
  form,
  handleAddCurriculum,
}) => {
  const [categories, setCategories] = useState([]); 
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (isModalVisible) {
      if (editingCurriculum) {
        form.setFieldsValue({
          objective: editingCurriculum.objective,
          curriculum_type: editingCurriculum.curriculum_type,
          resources: editingCurriculum.resources,
          prerequisite: editingCurriculum.prerequisite,
          assessment: editingCurriculum.assessment,
          method: editingCurriculum.method,
          content: editingCurriculum.content,
          number_of_hours: editingCurriculum.number_of_hours,
        });
      } else {
        form.resetFields();
      }
    }
    return () => {
      form.resetFields();
    };
  }, [isModalVisible, editingCurriculum, form]);

  // Mapping function to convert category name to ID
  const getCategoryIdByName = (name) => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
    return category ? category.id : null;
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Check if 'category_id' is a string (category name) instead of a number (category ID)
        const isCategoryName = typeof values.category_id === 'string';

        let categoryId = values.category_id;

        if (isCategoryName) {
          // Convert category name to ID
          categoryId = getCategoryIdByName(values.category_id);

          if (!categoryId) {
            notification.error({
              message: 'Invalid Category',
              description:
                'The selected category does not exist. Please choose a valid category.',
            });
            return; // Prevent submission if category is invalid
          }
        }

        // Update the form values with the correct category ID
        const updatedValues = { ...values, category_id: categoryId };

        handleAddCurriculum(updatedValues);
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title={editingCurriculum ? 'Edit Curriculum' : 'Add New Curriculum'}
      visible={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setEditingCurriculum(null);
        form.resetFields();
      }}
      onOk={handleOk}
      okText="Save"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleAddCurriculum}>
        <Form.Item
          label="Objective"
          name="objective"
          rules={[
            { required: true, message: 'Please enter an objective.' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter objective" />
        </Form.Item>
        <Form.Item
          label="Curriculum type"
          name="curriculum_type"
          rules={[
            { required: true, message: 'Please select the curriculum type.' },
          ]}
        >
          <Select placeholder="Select curriculum type">
            <Option value="formal">Formal</Option>
            <Option value="informal">Informal</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Resources"
          name="resources"
          rules={[
            { required: true, message: 'Please select a resource.' },
          ]}
        >
          <Select placeholder="Select resource">
            <Option value="non-lab">Non-lab</Option>
            <Option value="laboratory">Laboratory</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Prerequisite"
          name="prerequisite"
          rules={[
            { required: true, message: 'Please select the prerequisite.' },
          ]}
        >
          <Select placeholder="Select prerequisite">
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Assessment"
          name="assessment"
          rules={[
            { required: true, message: 'Please enter assessments.' },
          ]}
        >
          <Input placeholder="Enter assessment" />
        </Form.Item>
        <Form.Item
          label="Method"
          name="method"
          rules={[{ required: true, message: 'Please enter a method.' }]}
        >
          <Input placeholder="Enter method" />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: 'Please enter content.' }]}
        >
          <Input placeholder="Enter content" />
        </Form.Item>
        <Form.Item
          label="Number of hours"
          name="number_of_hours"
          rules={[{ required: true, message: 'Please enter number of hours.' }]}
        >
          <Input type="number" placeholder="Enter number of hours" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CurriculumModal;