// YearLevelModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';
import axios from 'axios';

const YearLevelModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data, // Combined active and archived data for duplicate checks
    setData,
    modalData,
    setModalData,
    handleCreateYearLevel, // Passed from YearLevelPage
    handleEditYearLevel, // Passed from YearLevelPage
    isPrintPreviewVisible,
    setIsPrintPreviewVisible, 
    closePrintPreview,
}) => {
    const [form] = Form.useForm();

    // Reset or set form fields based on modal visibility and modalData
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                year_level: modalData.year_level, 
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // **Define the validateYearLevel function**
    const validateYearLevel = (_, value) => {
        if (!value) {
            return Promise.reject('Please enter a Year Level');
        }

        const yearLevelLower = value.toLowerCase().trim();

        // Check for duplicates in combined data
        const duplicate = data.some(tag => 
            tag.year_level.toLowerCase().trim() === yearLevelLower && 
            (isEditModalVisible ? tag.id !== modalData.id : true)
        );

        if (duplicate) {
            return Promise.reject('A year level with this name already exists.');
        }

        // Check if year_level is an integer between 1 and 10
        const yearLevelInt = parseInt(value);
        if (isNaN(yearLevelInt) || yearLevelInt < 1 || yearLevelInt > 10) {
            return Promise.reject('Year Level must be an integer between 1 and 10');
        }

        return Promise.resolve();
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            if (isEditModalVisible) {
                // **Use handleEditYearLevel**
                await handleEditYearLevel(modalData.id, values);
            } else {
                // **Use handleCreateYearLevel**
                await handleCreateYearLevel(values);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        setModalData(null);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Year Level' : 'Create New Year Level'}
            visible={isEditModalVisible || isCreateModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Year Level'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="yearLevelForm">
                <Form.Item
                    label="Year Level"
                    name="year_level"
                    rules={[
                        { required: true, message: 'Please input the Year Level!' },
                        { validator: validateYearLevel }, // Now defined
                    ]}
                >
                    <Input
                        type="number" 
                        min={1} 
                        max={10} 
                        onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} 
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default YearLevelModal;
