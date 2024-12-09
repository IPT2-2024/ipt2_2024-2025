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
    handleEditSemester,
    handleCreateSemester,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            
            form.setFieldsValue({
                semester_period: modalData.semester_period, 
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            
            const semesterPeriodName = values.semester_period.trim();
    
            
            const sanitizedValues = { semester_period: semesterPeriodName };
    
            if (isEditModalVisible) {
                
                handleEditSemester(modalData.id, sanitizedValues);
            } else {
                
                handleCreateSemester(sanitizedValues);
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
