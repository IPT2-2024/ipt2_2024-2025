
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
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            
            form.setFieldsValue({
                section_name: modalData.section_name,
            });
        } else if (isCreateModalVisible) {
            form.resetFields(); 
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    
    const handleOk = () => {
        form.validateFields().then((values) => {
            const sectionName = values.section_name.trim();

            if (isEditModalVisible) {
                
                handleEditSection(modalData.id, { section_name: sectionName });
            } else {
                
                handleCreateSection({ section_name: sectionName });
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
            onOk={handleOk}
            onCancel={handleCancel}
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
                    ]}
                >
                    <Input placeholder="Enter section name (e.g., Electronics)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SectionCatalogModal;
