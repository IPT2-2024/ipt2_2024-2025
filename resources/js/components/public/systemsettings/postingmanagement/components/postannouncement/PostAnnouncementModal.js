import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const PostAnnouncementModal = ({
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
                announcement: modalData.announcement, // Editable announcement text
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const announcementText = values.announcement.trim();

            // Check if the announcement already exists
            const announcementExists = data.some(
                (announcement) => announcement.announcement.toLowerCase() === announcementText.toLowerCase()
            );

            if (announcementExists) {
                message.error('This announcement already exists.');
                return; // Prevent the modal from closing if the announcement already exists
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing announcement
                const updatedData = data.map((announcement) =>
                    announcement.id === modalData.id ? { ...announcement, ...values, updated_at: new Date().toISOString() } : announcement
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Announcement updated successfully');
            } else {
                // Handle create logic for a new announcement
                const newAnnouncement = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newAnnouncement]);
                setIsCreateModalVisible(false);
                message.success('New Announcement created successfully');
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
            title={isEditModalVisible ? 'Edit Announcement' : 'Create New Announcement'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Announcement'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="announcementForm">
                <Form.Item
                    label="Announcement"
                    name="announcement"
                    rules={[{ required: true, message: 'Please enter an announcement!' }]}
                >
                    <Input.TextArea placeholder="Enter the announcement text" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PostAnnouncementModal;
