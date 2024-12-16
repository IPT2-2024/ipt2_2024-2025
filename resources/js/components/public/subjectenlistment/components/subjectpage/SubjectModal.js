import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Spin, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SubjectModal = ({
  isModalVisible,
  setIsModalVisible,
  editingSubject,
  setEditingSubject,
  form,
  handleAddSubject,
}) => {
  const [categories, setCategories] = useState([]); 
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (isModalVisible) {
      fetchCategories();
      if (editingSubject) {
        form.setFieldsValue({
          subject_name: editingSubject.subject_name,
          subject_code: editingSubject.subject_code,
          classification: editingSubject.classification,
          units: editingSubject.units,
          subject_description: editingSubject.subject_description,
          subjectcategory_id: editingSubject.subjectcategory_id,
          availability: editingSubject.availability,
        });
      } else {
        form.resetFields();
      }
    }
    return () => {
      setCategories([]);
      setLoadingCategories(false);
      form.resetFields();
    };
  }, [isModalVisible, editingSubject, form]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem('auth_token'); 
      const response = await axios.get('/api/subjectcategory', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching subject categories:', error);
      notification.error({
        message: 'Error',
        description:
          'Failed to load subject categories. Please try again later.',
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Mapping function to convert category name to ID
  const getCategoryIdByName = (name) => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
    return category ? category.id : null;
  };

  const handleOk = () => {
    form
      .validateFields() // Validate all fields
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

        // Call the provided handleAddSubject function with updated values
        handleAddSubject(updatedValues);
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
        setEditingSubject(null);
        form.resetFields();
      }}
      onOk={handleOk}
      okText="Save"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleAddSubject}>
        <Form.Item
          label="Subject Name"
          name="subject_name"
          rules={[
            { required: true, message: 'Please enter the subject name.' },
          ]}
        >
          <Input placeholder="Enter subject name" />
        </Form.Item>
        <Form.Item
          label="Subject Code"
          name="subject_code"
          rules={[
            { required: true, message: 'Please enter the subject code.' },
          ]}
        >
          <Input placeholder="Enter subject code" />
        </Form.Item>
        <Form.Item
          label="Classification"
          name="classification"
          rules={[
            { required: true, message: 'Please choose classification.' },
          ]}
        >
          <Select placeholder="Select classification">
            <Option value="major">Major</Option>
            <Option value="minor">Minor</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Units"
          name="units"
          rules={[
            { required: true, message: 'Please enter the amount of units.' },
            {
              pattern: /^\d+(\.\d{1,2})?$/,
              message: 'Please enter a valid number of units.',
            },
          ]}
        >
          <Input type="number" placeholder="Enter amount of units" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="subject_description"
          rules={[
            { required: true, message: 'Please enter subject description.' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="subjectcategory_id"
          rules={[{ required: true, message: 'Please choose a category.' }]}
        >
          {loadingCategories ? (
            <Spin />
          ) : (
            <Select
              placeholder="Select category"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              allowClear
              onChange={(value) => {
                // Log the selected value for debugging
                console.log('Selected Category ID:', value);
              }}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.subject_category}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="Availability"
          name="availability"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: 'Please toggle availability.',
            },
          ]}
          initialValue={editingSubject?.availability || true} // Default to true if not editing
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectModal;