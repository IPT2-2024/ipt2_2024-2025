
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
}) => {
    const [form] = Form.useForm();

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

    
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const programName = values.college_programs.trim();
                const studyType = values.study_type;

                if (isEditModalVisible) {
                    
                    handleEditCollegeProgram(modalData.id, { 
                        college_programs: programName,
                        study_type: studyType,
                    });
                } else {
                    
                    handleCreateCollegeProgram({ 
                        college_programs: programName,
                        study_type: studyType,
                    });
                }

                form.resetFields(); 
            })
            .catch((info) => {
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
            onOk={handleOk}
            onCancel={handleCancel}
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
                    </Select>
                </Form.Item>
            </Form>
            {}
            {}
        </Modal>
    );
};

export default CollegeProgramsModal;
