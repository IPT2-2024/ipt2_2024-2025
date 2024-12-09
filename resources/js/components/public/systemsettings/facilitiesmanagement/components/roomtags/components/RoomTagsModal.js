import React, { useEffect } from 'react';
import { Modal, Input, Form, Select, message } from 'antd';
import axios from 'axios';

const RoomTagsModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
    fetchData
}) => {
    const [form] = Form.useForm();

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

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const token = localStorage.getItem('auth_token');

            if (isEditModalVisible && modalData) {
                
                try {
                    const response = await axios.put(`/api/roomtag/${modalData.id}`, values, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const updatedTag = response.data;
                    const updatedData = data.map((tag) => 
                        tag.id === updatedTag.id ? updatedTag : tag
                    );
                    setData(updatedData);
                    setIsEditModalVisible(false);
                    setModalData(null);
                    message.success('Room tag updated successfully');
                } catch (error) {
                    console.error('Error updating room tag:', error);
                    message.error('Failed to update room tag');
                }
            } else {
                
                try {
                    const response = await axios.post('/api/roomtag', values, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const newRoomTag = response.data;
                    setData([...data, newRoomTag]);
                    setIsCreateModalVisible(false);
                    setModalData(null);
                    message.success('New room tag created successfully');
                } catch (error) {
                    console.error('Error creating room tag:', error);
                    message.error('Failed to create new room tag');
                }
            }
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
                        <Select.Option value="numerical">Numerical</Select.Option>
                        <Select.Option value="functional">Functional</Select.Option>
                        <Select.Option value="office">Office</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoomTagsModal;
