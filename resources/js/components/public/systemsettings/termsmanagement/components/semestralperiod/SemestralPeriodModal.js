import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';

const SemesterModal = ({
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
                semester_period: modalData.semester_period, // Editable semester period
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const semesterPeriodName = values.semester_period.trim();

            // Check if the semester period already exists
            const semesterExists = data.some(
                (semester) => semester.semester_period.toLowerCase() === semesterPeriodName.toLowerCase()
            );

            if (semesterExists) {
                message.error('This Semester Period already exists.');
                return; // Prevent the modal from closing if semester period exists
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing semester
                const updatedData = data.map((semester) =>
                    semester.id === modalData.id
                        ? { ...semester, ...values, updated_at: new Date().toISOString() }
                        : semester
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Semester Period updated successfully');
            } else {
                // Handle create logic for a new semester
                const newSemester = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newSemester]);
                setIsCreateModalVisible(false);
                message.success('New Semester Period created successfully');
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
            title={isEditModalVisible ? 'Edit Semester Period' : 'Create New Semester Period'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Semester Period'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="semesterForm">
                <Form.Item
                    label="Semester Period"
                    name="semester_period"
                    rules={[{ required: true, message: 'Please enter a semester period!' }]}
                >
                    <Input placeholder="Enter semester period (e.g., Fall, Spring)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SemesterModal;
