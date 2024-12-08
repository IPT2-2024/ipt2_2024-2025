import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const YearLevelModal = ({
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
                year_level: modalData.year_level, // Editable year level
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const yearLevelName = values.year_level.trim();

            // Check if the year level already exists
            const yearLevelExists = data.some(
                (yearLevel) => yearLevel.year_level.toLowerCase() === yearLevelName.toLowerCase()
            );

            if (yearLevelExists) {
                message.error('This Year Level already exists.');
                return; // Prevent the modal from closing if year level exists
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing year level
                const updatedData = data.map((yearLevel) =>
                    yearLevel.id === modalData.id ? { ...yearLevel, ...values, updated_at: new Date().toISOString() } : yearLevel
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Year Level updated successfully');
            } else {
                // Handle create logic for a new year level
                const newYearLevel = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newYearLevel]);
                setIsCreateModalVisible(false);
                message.success('New Year Level created successfully');
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
            title={isEditModalVisible ? 'Edit Year Level' : 'Create New Year Level'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Year Level'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="yearLevelForm">
                <Form.Item
                    label="Year Level"
                    name="year_level"
                    rules={[{ required: true, message: 'Please enter a year level!' }]}
                >
                    <Input placeholder="Enter year level (e.g., First Year)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default YearLevelModal;
