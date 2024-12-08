import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const SectionCatalogModal = ({
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
                section_name: modalData.section_name, // Editable section name
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const sectionName = values.section_name.trim();

            // Check if the section already exists (case-insensitive)
            const sectionExists = data.some(
                (section) => section.section_name.toLowerCase() === sectionName.toLowerCase()
            );

            if (sectionExists) {
                message.error('Section already exists.'); // Show error message if section exists
                return; // Prevent the modal from closing if section exists
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing section
                const updatedData = data.map((section) =>
                    section.id === modalData.id ? { ...section, ...values, updated_at: new Date().toISOString() } : section
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Section updated successfully');
            } else {
                // Handle create logic for a new section
                const newSection = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newSection]);
                setIsCreateModalVisible(false);
                message.success('New Section created successfully');
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
            title={isEditModalVisible ? 'Edit Section' : 'Create New Section'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Section'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="sectionCatalogForm">
                <Form.Item
                    label="Section Name"
                    name="section_name"
                    rules={[{ required: true, message: 'Please enter a section name!' }]}
                >
                    <Input placeholder="Enter section name (e.g., Section A)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SectionCatalogModal;
