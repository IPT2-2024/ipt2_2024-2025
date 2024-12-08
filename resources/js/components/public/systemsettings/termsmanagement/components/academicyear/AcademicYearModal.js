import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const AcademicYearModal = ({
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
                academic_year: modalData.academic_year, // Editable academic year
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const academicYearName = values.academic_year.trim();

            // Check if the academic year already exists
            const academicYearExists = data.some(
                (year) => year.academic_year.toLowerCase() === academicYearName.toLowerCase()
            );

            if (academicYearExists) {
                message.error('This Academic Year already exists.');
                return; // Prevent the modal from closing if academic year exists
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing academic year
                const updatedData = data.map((year) =>
                    year.id === modalData.id ? { ...year, ...values, updated_at: new Date().toISOString() } : year
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Academic Year updated successfully');
            } else {
                // Handle create logic for a new academic year
                const newAcademicYear = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newAcademicYear]);
                setIsCreateModalVisible(false);
                message.success('New Academic Year created successfully');
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
            title={isEditModalVisible ? 'Edit Academic Year' : 'Create New Academic Year'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Academic Year'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="academicYearForm">
                <Form.Item
                    label="Academic Year"
                    name="academic_year"
                    rules={[{ required: true, message: 'Please enter an academic year!' }]}
                >
                    <Input placeholder="Enter academic year (e.g., 2024-2025)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AcademicYearModal;
