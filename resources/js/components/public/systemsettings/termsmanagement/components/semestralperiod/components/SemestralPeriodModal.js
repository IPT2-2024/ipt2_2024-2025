// SemesterModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, Typography } from 'antd';

const { Text } = Typography;

const SemesterModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateSemester,
    handleEditSemester,
    modalData,
    data, // Combined data for duplicate checks
}) => {
    const [form] = Form.useForm();

    // Reset or set form fields based on modal visibility and modalData
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                semester_period: modalData.semester_period,
            });
        } else if (isCreateModalVisible) {
            form.resetFields();
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // **Define the validateSemesterPeriod function**
    const validateSemesterPeriod = (_, value) => {
        if (!value) {
            return Promise.reject('Please enter a semester period');
        }

        const semesterPeriodLower = value.toLowerCase().trim();

        // Check for duplicates in combined data
        const duplicate = data.some(semester => 
            semester.semester_period.toLowerCase().trim() === semesterPeriodLower && 
            (isEditModalVisible ? semester.id !== modalData.id : true)
        );

        if (duplicate) {
            return Promise.reject('A semester period with this name already exists.');
        }

        // Additional validation can be added here (e.g., regex for allowed characters)

        return Promise.resolve();
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const semesterPeriodName = values.semester_period.trim();

            if (isEditModalVisible) {
                // **Use handleEditSemester**
                await handleEditSemester(modalData.id, { 
                    semester_period: semesterPeriodName,
                });
            } else {
                // **Use handleCreateSemester**
                await handleCreateSemester({ 
                    semester_period: semesterPeriodName,
                });
            }

            form.resetFields();
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Semester Period' : 'Create New Semester Period'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Semester Period'}
            cancelText="Cancel"
            destroyOnClose 
        >
            <Form form={form} layout="vertical" name="semesterForm">
                <Form.Item
                    label="Semester Period"
                    name="semester_period"
                    rules={[
                        { required: true, message: 'Please enter a semester period!' },
                        { min: 2, message: 'Semester period must be at least 2 characters.' },
                        { validator: validateSemesterPeriod }, // Now defined
                    ]}
                >
                    <Input placeholder="Enter semester period (e.g., Fall, Spring)" />
                </Form.Item>
            </Form>
            {/* Optional: Display error messages */}
            {/* {error && <Text type="danger">{error}</Text>} */}
        </Modal>
    );
};

export default SemesterModal;
