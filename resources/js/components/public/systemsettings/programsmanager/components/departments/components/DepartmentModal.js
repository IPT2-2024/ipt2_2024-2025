// DepartmentModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';

const DepartmentModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateDepartment, 
    handleEditDepartment,   
    modalData,
    data, // Combined data for duplicate checks
}) => {
    const [form] = Form.useForm();

    // Reset or set form fields based on modal visibility and modalData
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                department_name: modalData.department_name,
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // **Define the validateDepartmentName function**
    const validateDepartmentName = (_, value) => {
        if (!value) {
            return Promise.reject('Please enter a department name');
        }

        const departmentNameLower = value.toLowerCase().trim();

        // Check for duplicates in combined data
        const duplicate = data.some(dep => 
            dep.department_name.toLowerCase().trim() === departmentNameLower && 
            (isEditModalVisible ? dep.id !== modalData.id : true)
        );

        if (duplicate) {
            return Promise.reject('A department with this name already exists.');
        }

        // Additional validation can be added here (e.g., regex for allowed characters)

        return Promise.resolve();
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const departmentName = values.department_name.trim();

            if (isEditModalVisible) {
                // **Use handleEditDepartment**
                await handleEditDepartment(modalData.id, { department_name: departmentName });
            } else {
                // **Use handleCreateDepartment**
                await handleCreateDepartment({ department_name: departmentName });
            }

            form.resetFields(); 
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); 
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Department' : 'Create New Department'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Department'}
            cancelText="Cancel"
            destroyOnClose 
        >
            <Form form={form} layout="vertical" name="departmentForm">
                <Form.Item
                    label="Department Name"
                    name="department_name"
                    rules={[
                        { required: true, message: 'Please enter a department name!' },
                        { min: 2, message: 'Department name must be at least 2 characters.' },
                        { validator: validateDepartmentName }, // Now defined
                    ]}
                >
                    <Input placeholder="Enter department name (e.g., Computer Science)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DepartmentModal;
