// SectionCatalogModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';

const SectionCatalogModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateSection, 
    handleEditSection,   
    modalData,           
    data, // Combined data for duplicate checks
}) => {
    const [form] = Form.useForm();

    // Reset or set form fields based on modal visibility and modalData
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                section_name: modalData.section_name,
            });
        } else if (isCreateModalVisible) {
            form.resetFields(); 
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // **Define the validateSectionName function**
    const validateSectionName = (_, value) => {

        const sectionNameLower = value.toLowerCase().trim();

        // Check for duplicates in combined data
        const duplicate = data.some(section => 
            section.section_name.toLowerCase().trim() === sectionNameLower && 
            (isEditModalVisible ? section.id !== modalData.id : true)
        );

        if (duplicate) {
            return Promise.reject('A section with this name already exists.');
        }

        // Additional validation can be added here (e.g., regex for allowed characters)

        return Promise.resolve();
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const sectionName = values.section_name.trim();

            if (isEditModalVisible) {
                // **Use handleEditSection**
                await handleEditSection(modalData.id, { section_name: sectionName });
            } else {
                // **Use handleCreateSection**
                await handleCreateSection({ section_name: sectionName });
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
            title={isEditModalVisible ? 'Edit Section' : 'Create New Section'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Section'}
            cancelText="Cancel"
            destroyOnClose 
        >
            <Form form={form} layout="vertical" name="sectionCatalogForm">
                <Form.Item
                    label="Section Name"
                    name="section_name"
                    rules={[
                        { required: true, message: 'Please enter a section name!' },
                        { min: 2, message: 'Section name must be at least 2 characters.' },
                        { validator: validateSectionName }, // Now defined
                    ]}
                >
                    <Input placeholder="Enter section name (e.g., Electronics)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SectionCatalogModal;
