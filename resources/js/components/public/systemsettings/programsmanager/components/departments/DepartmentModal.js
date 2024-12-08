import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const DepartmentModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                department_name: modalData.department_name, // Editable department name
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const departmentName = values.department_name.trim();

            // Check if the department already exists (case-insensitive)
            const departmentExists = data.some(department => department.department_name.toLowerCase() === departmentName.toLowerCase());

            if (departmentExists) {
                message.error('Department already exists.'); // Show error message if department exists
                return; // Prevent the modal from closing if department exists
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing department
                const updatedData = data.map((department) =>
                    department.id === modalData.id ? { ...department, ...values, updated_at: new Date().toISOString() } : department
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Department updated successfully');
            } else {
                // Handle create logic for a new department
                const newDepartment = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newDepartment]);
                setIsCreateModalVisible(false);
                message.success('New Department created successfully');
            }
            form.resetFields(); // Reset the form fields
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Clear the form when the modal is canceled
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Department' : 'Create New Department'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Department'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="departmentForm">
                <Form.Item
                    label="Department Name"
                    name="department_name"
                    rules={[{ required: true, message: 'Please enter a department name!' }]}
                >
                    <Input placeholder="Enter department name (e.g., Computer Science)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DepartmentModal;
