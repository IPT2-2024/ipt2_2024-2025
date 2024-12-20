// RoomTagsModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, Select, message } from 'antd';
import axios from 'axios';

const RoomTagsModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data, // Combined active and archived data for duplicate checks
    setData,
    modalData,
    setModalData,
    handleCreateRoomTag, // Passed from RoomTagsPage
    handleEditRoomTag, // Passed from RoomTagsPage
}) => {
    const [form] = Form.useForm();

    // Reset or set form fields based on modal visibility and modalData
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                room_tag: modalData.room_tag,
                room_tag_type: modalData.room_tag_type,
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // **Define the validateRoomTag function**
    const validateRoomTag = (_, value) => {

        const roomTagLower = value.toLowerCase().trim();

        // Check for duplicates in combined data
        const duplicate = data.some(tag => 
            tag.room_tag.toLowerCase().trim() === roomTagLower && 
            (isEditModalVisible ? tag.id !== modalData.id : true)
        );

        if (duplicate) {
            return Promise.reject('A room tag with this name already exists.');
        }

        return Promise.resolve();
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            if (isEditModalVisible) {
                // **Use handleEditRoomTag**
                await handleEditRoomTag(modalData.id, values);
            } else {
                // **Use handleCreateRoomTag**
                await handleCreateRoomTag(values);
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
            title={isEditModalVisible ? 'Edit Room Tag' : 'Create New Room Tag'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Room Tag'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="roomTagForm">
                <Form.Item
                    label="Room Tag"
                    name="room_tag"
                    rules={[
                        { required: true, message: 'Please enter a room tag!' },
                        { validator: validateRoomTag }, // Now defined
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Room Tag Type"
                    name="room_tag_type"
                    rules={[{ required: true, message: 'Please select a room tag type!' }]}
                >
                    <Select placeholder="Select room tag type">
                        <Select.Option value="numerical">Numerical</Select.Option>
                        <Select.Option value="functional">Functional</Select.Option>
                        <Select.Option value="office">Office</Select.Option>
                        {/* Add more types as needed */}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoomTagsModal;
