import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { message } from 'antd';

const BuildingModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData
}) => {
    const [form] = useForm(); // Ant Design Form hook for form handling

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                building_name: modalData.building_name, // Editable building name
                floor_id: modalData.floor_id, // Editable floor ID
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (isEditModalVisible) {
                // Handle update logic for an existing building
                const updatedData = data.map((building) =>
                    building.id === modalData.id ? { ...building, ...values } : building
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Building updated successfully');
            } else {
                // Handle create logic for a new building
                const newBuilding = {
                    id: Date.now(), // Assuming auto-generation of ID based on timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at to current date
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newBuilding]);
                setIsCreateModalVisible(false);
                message.success('New building created successfully');
            }
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Building' : 'Create New Building'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Building'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="buildingForm">
                <Form.Item
                    label="Building Name"
                    name="building_name"
                    rules={[{ required: true, message: 'Please enter a building name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Floor ID"
                    name="floor_id"
                    rules={[{ required: true, message: 'Please enter a floor ID!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BuildingModal;
