    
    import React, { useEffect } from 'react';
    import { Modal, Input, Button, Form, message } from 'antd';

    const DepartmentModal = ({
        isCreateModalVisible,
        setIsCreateModalVisible,
        isEditModalVisible,
        setIsEditModalVisible,
        handleCreateDepartment, 
        handleEditDepartment,   
        modalData,
    }) => {
        const [form] = Form.useForm();

        useEffect(() => {
            if (isEditModalVisible && modalData) {
                
                form.setFieldsValue({
                    department_name: modalData.department_name, 
                });
            } else if (isCreateModalVisible) {
                form.resetFields();
            }
        }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

        const handleOk = () => {
            form.validateFields().then((values) => {
                const departmentName = values.department_name.trim();

                if (isEditModalVisible) {
                    
                    handleEditDepartment(modalData.id, { department_name: departmentName });
                } else {
                    
                    handleCreateDepartment({ department_name: departmentName });
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
                title={isEditModalVisible ? 'Edit Department' : 'Create New Department'}
                visible={isCreateModalVisible || isEditModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditModalVisible ? 'Save Changes' : 'Create Department'}
                cancelText="Cancel"
                destroyOnClose 
            >
                <Form form={form} layout="vertical" name="departmentForm">
                    <Form.Item
                        label="Department Name"
                        name="department_name"
                        rules={[
                            { required: true, message: 'Please enter a department name!' },
                            { min: 2, message: 'Department name must be at least 2 characters.' },
                        ]}
                    >
                        <Input placeholder="Enter department name (e.g., Computer Science)" />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    export default DepartmentModal;
