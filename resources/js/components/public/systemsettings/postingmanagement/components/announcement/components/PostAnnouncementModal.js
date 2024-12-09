// AnnouncementModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form } from 'antd';
import PropTypes from 'prop-types';

const AnnouncementModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateAnnouncement, // Handler for creating
    handleEditAnnouncement,   // Handler for editing
    modalData,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                announcement: modalData.announcement, // Editable announcement text
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const announcementContent = values.announcement.trim();

                if (isEditModalVisible) {
                    // Handle update logic via parent handler
                    handleEditAnnouncement(modalData.id, { announcement: announcementContent });
                } else {
                    // Handle create logic via parent handler
                    handleCreateAnnouncement({ announcement: announcementContent });
                }

                form.resetFields(); // Reset the form fields after submission
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
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
            visible={isCreateModalVisible || isEditModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Announcement'}
            cancelText="Cancel"
            destroyOnClose // Ensure form is reset when modal is closed
        >
            <Form form={form} layout="vertical" name="announcementForm">
                <Form.Item
                    label="Announcement"
                    name="announcement"
                    rules={[
                        { required: true, message: 'Please enter an announcement!' },
                        { min: 5, message: 'Announcement must be at least 5 characters.' },
                    ]}
                >
                    <Input.TextArea rows={4} placeholder="Enter announcement content" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

AnnouncementModal.propTypes = {
    isCreateModalVisible: PropTypes.bool.isRequired,
    setIsCreateModalVisible: PropTypes.func.isRequired,
    isEditModalVisible: PropTypes.bool.isRequired,
    setIsEditModalVisible: PropTypes.func.isRequired,
    handleCreateAnnouncement: PropTypes.func.isRequired,
    handleEditAnnouncement: PropTypes.func.isRequired,
    modalData: PropTypes.object,
};

export default AnnouncementModal;
