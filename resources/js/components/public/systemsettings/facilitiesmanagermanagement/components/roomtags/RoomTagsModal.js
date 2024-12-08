import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { message } from 'antd';

const RoomTagsModal = ({
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
                room_tag: modalData.room_tag, 
                room_tag_type: modalData.room_tag_type,
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (isEditModalVisible) {
                // Handle update logic for an existing room tag
                const updatedData = data.map((tag) =>
                    tag.id === modalData.id ? { ...tag, ...values } : tag
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Room tag updated successfully');
            } else {
                // Handle create logic for a new room tag
                const newRoomTag = {
                    id: Date.now(), // Assuming auto-generation of ID based on timestamp
                    ...values,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newRoomTag]);
                setIsCreateModalVisible(false);
                message.success('New room tag created successfully');
            }
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Room Tag' : 'Create New Room Tag'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Room Tag'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="roomTagForm">
                <Form.Item
                    label="Room Tag"
                    name="room_tag"
                    rules={[{ required: true, message: 'Please enter a room tag!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Room Tag Type"
                    name="room_tag_type"
                    rules={[{ required: true, message: 'Please select a room tag type!' }]}
                >
                    <Select placeholder="Select room tag type">
                        <Select.Option value="conference">Conference</Select.Option>
                        <Select.Option value="meeting">Meeting</Select.Option>
                        <Select.Option value="office">Office</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoomTagsModal;
