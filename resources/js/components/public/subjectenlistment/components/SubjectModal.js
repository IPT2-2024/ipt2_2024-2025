import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Spin, notification } from 'antd';
import axios from 'axios'; // Import axios for API calls

const { Option } = Select;

const SubjectModal = ({
  isModalVisible,
  setIsModalVisible,
  editingSubject,
  setEditingSubject,
  form,
  handleAddSubject,
}) => {
  const [categories, setCategories] = useState([]); // State to hold categories
  const [loadingCategories, setLoadingCategories] = useState(false); // Loading state for categories

  useEffect(() => {
    if (isModalVisible) {
      fetchCategories();
      if (editingSubject) {
        // Populate form fields with editingSubject data
        form.setFieldsValue({
          name: editingSubject.name,
          code: editingSubject.code,
          classification: editingSubject.classification,
          units: editingSubject.units,
          description: editingSubject.description,
          category_id: editingSubject.category_id,
          availability: editingSubject.availability,
        });
      } else {
        form.resetFields();
      }
    }
    // Cleanup when modal is closed
    return () => {
      setCategories([]);
      setLoadingCategories(false);
      form.resetFields();
    };
  }, [isModalVisible, editingSubject, form]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem('auth_token'); // Retrieve auth token if needed
      const response = await axios.get('/api/subjectcategory', {
        headers: {
          Authorization: `Bearer ${token}`, // Corrected syntax
        },
      });

      // Assuming the API returns an array of categories
      // Example: [{ id: 1, name: 'Mathematics' }, { id: 2, name: 'Science' }, ...]
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
      onOk={handleOk} // Use the handleOk function
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
          name="subjctcode"
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
            {/* Add more classifications as needed */}
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
          name="description"
          rules={[
            { required: true, message: 'Please enter subject description.' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category_id"
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
                  {category.name}
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