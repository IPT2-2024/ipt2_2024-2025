// CollegeProgramsModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Form, Select, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const CollegeProgramsModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateCollegeProgram, 
    handleEditCollegeProgram,   
    modalData,                  
    data, // Combined data for duplicate checks
}) => {
    const [form] = Form.useForm();

    // Reset or set form fields based on modal visibility and modalData
    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                college_programs: modalData.college_programs,
                study_type: modalData.study_type,
            });
        } else if (isCreateModalVisible) {
            form.resetFields(); 
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    // **Define the validateCollegeProgramName function**
    const validateCollegeProgramName = (_, value) => {
        if (!value) {
            return Promise.reject('Please enter a college program name');
        }

        const programNameLower = value.toLowerCase().trim();

        // Check for duplicates in combined data
        const duplicate = data.some(program => 
            program.college_programs.toLowerCase().trim() === programNameLower && 
            (isEditModalVisible ? program.id !== modalData.id : true)
        );

        if (duplicate) {
            return Promise.reject('A college program with this name already exists.');
        }

        // Additional validation can be added here (e.g., regex for allowed characters)

        return Promise.resolve();
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const programName = values.college_programs.trim();
            const studyType = values.study_type;

            if (isEditModalVisible) {
                // **Use handleEditCollegeProgram**
                await handleEditCollegeProgram(modalData.id, { 
                    college_programs: programName,
                    study_type: studyType,
                });
            } else {
                // **Use handleCreateCollegeProgram**
                await handleCreateCollegeProgram({ 
                    college_programs: programName,
                    study_type: studyType,
                });
            }

            form.resetFields(); 
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); 
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit College Program' : 'Create New College Program'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Program'}
            cancelText="Cancel"
            destroyOnClose 
        >
            <Form form={form} layout="vertical" name="collegeProgramForm">
                <Form.Item
                    label="College Program Name"
                    name="college_programs"
                    rules={[
                        { required: true, message: 'Please enter a college program name!' },
                        { min: 2, message: 'Program name must be at least 2 characters.' },
                        { validator: validateCollegeProgramName }, // Now defined
                    ]}
                >
                    <Input placeholder="Enter college program name (e.g., Computer Science)" />
                </Form.Item>

                <Form.Item
                    label="Study Type"
                    name="study_type"
                    rules={[
                        { required: true, message: 'Please select a study type!' },
                    ]}
                >
                    <Select placeholder="Select study type">
                        <Option value="undergraduate">Undergraduate</Option>
                        <Option value="graduate">Graduate</Option>
                        <Option value="diploma">Diploma</Option>
                        {/* Add more study types as needed */}
                    </Select>
                </Form.Item>
            </Form>
            {/* Optional: Display error messages */}
            {/* {error && <Text type="danger">{error}</Text>} */}
        </Modal>
    );
};

export default CollegeProgramsModal;
