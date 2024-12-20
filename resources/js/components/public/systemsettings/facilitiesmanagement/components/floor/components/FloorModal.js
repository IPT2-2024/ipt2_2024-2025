// FloorModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputNumber, notification } from 'antd';
import axios from 'axios'; 

const FloorModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateFloor,
    handleEditFloor, // Receive the edit handler
    data, // Combined active and archived data for duplicate checks
    modalData,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); 

    // Reset or set form fields based on modal visibility and modalData
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                floor_level: modalData.floor_level,
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // Custom validator to check for duplicate floor levels
    const validateFloorLevel = (_, value) => {
        if (value === undefined || value === null) {
            return Promise.reject('Please input the floor level');
        }

        const floorLevelStr = String(value).toLowerCase().trim();

        // Exclude the current floor when editing
        const duplicate = data.some(floor => 
            String(floor.floor_level).toLowerCase().trim() === floorLevelStr && (isEditModalVisible ? floor.id !== modalData.id : true)
        );

        if (duplicate) {
            return Promise.reject('A floor with this level already exists.');
        }

        return Promise.resolve();
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            setLoading(true);
            if (isEditModalVisible) {
                // Call handleEditFloor with id and updated data
                handleEditFloor(modalData.id, { floor_level: values.floor_level })
                    .finally(() => setLoading(false));
            } else {
                // Call handleCreateFloor with new floor data
                handleCreateFloor({ floor_level: values.floor_level })
                    .finally(() => setLoading(false));
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Floor' : 'Create New Floor'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave} loading={loading}>
                    Save
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="floor_level"
                    label="Floor Level"
                    rules={[
                        { required: true, message: 'Please input the floor level' },
                        { validator: validateFloorLevel }, 
                    ]}
                >
                    <InputNumber min={1} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FloorModal;
