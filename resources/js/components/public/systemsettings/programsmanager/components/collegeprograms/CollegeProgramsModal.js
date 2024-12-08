import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, Select, message } from 'antd';

const { Option } = Select;

const CollegeProgramsModal = ({
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
                college_programs: modalData.college_programs, // Editable college program name
                study_type: modalData.study_type, // Editable study type (undergraduate, graduate, diploma)
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const collegeProgramName = values.college_programs.trim();
            const studyType = values.study_type;

            // Check if the college program already exists with the same name and study type
            const programExists = data.some(
                (program) => program.college_programs.toLowerCase() === collegeProgramName.toLowerCase() &&
                            program.study_type === studyType
            );

            if (programExists) {
                message.error('This College Program with the selected study type already exists.');
                return; // Prevent the modal from closing if program exists
            }

            if (isEditModalVisible) {
                // Handle update logic for an existing college program
                const updatedData = data.map((program) =>
                    program.id === modalData.id ? { ...program, ...values, updated_at: new Date().toISOString() } : program
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('College Program updated successfully');
            } else {
                // Handle create logic for a new college program
                const newCollegeProgram = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...values,
                    created_at: new Date().toISOString(), // Set created_at and updated_at
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newCollegeProgram]);
                setIsCreateModalVisible(false);
                message.success('New College Program created successfully');
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
            title={isEditModalVisible ? 'Edit College Program' : 'Create New College Program'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create College Program'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="collegeProgramForm">
                <Form.Item
                    label="College Program"
                    name="college_programs"
                    rules={[{ required: true, message: 'Please enter a college program name!' }]}
                >
                    <Input placeholder="Enter college program name" />
                </Form.Item>

                <Form.Item
                    label="Study Type"
                    name="study_type"
                    rules={[{ required: true, message: 'Please select a study type!' }]}
                >
                    <Select placeholder="Select study type">
                        <Option value="undergraduate">Undergraduate</Option>
                        <Option value="graduate">Graduate</Option>
                        <Option value="diploma">Diploma</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CollegeProgramsModal;
