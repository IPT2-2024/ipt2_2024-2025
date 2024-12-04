import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;

const UserModals = ({
    isEditModalVisible,
    setIsEditModalVisible,
    isCreateModalVisible,
    setIsCreateModalVisible,
    data,
    setData,
    modalData,
    setModalData,
}) => {
    const [form] = Form.useForm();
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (modalData) {
            // Pre-fill form fields only when modalData is not null
            form.setFieldsValue({
                firstName: modalData.firstName || '',
                lastName: modalData.lastName || '',
                role: modalData.role,
                password: modalData.password || '', // Password field can be empty when editing
            });
            
            // Handle first name and last name generation
            if (modalData.firstName && modalData.lastName) {
                const firstNameParts = modalData.firstName.split(' '); // Split first name into parts
                const lastNameParts = modalData.lastName.split(' '); // Split last name into parts
                
                const firstName = firstNameParts[0]; // Use the first part as the first name
                const lastName = lastNameParts[lastNameParts.length - 1]; // Use the last part as the last name

                setUsername(`${firstName}.${lastName}@gmail.com`);
            }
        } else {
            form.resetFields();
            setUsername('');
        }
    }, [modalData, form]); // Re-run this effect whenever modalData changes

    const handleFirstNameChange = (value) => {
        const lastName = form.getFieldValue('lastName') || '';
        setUsername(`${value.split(' ')[0]}.${lastName}@gmail.com`); // Only take the first word of firstName
    };

    const handleLastNameChange = (value) => {
        const firstName = form.getFieldValue('firstName') || '';
        setUsername(`${firstName.split(' ')[0]}.${value.split(' ')[value.split(' ').length - 1]}@gmail.com`); // Only take the last word of lastName
    };

    const handleCreateOrUpdate = () => {
        form.validateFields()
            .then((values) => {
                if (isCreateModalVisible) {
                    // Add new user
                    const newUser = {
                        ...values,
                        username: username,
                        id: Math.random().toString(36).substring(2, 9), // Generate random ID
                        created: new Date().toLocaleString(),
                        updated: new Date().toLocaleString(),
                        archived: false,
                    };
                    setData((prevData) => [...prevData, newUser]);
                    message.success('User created successfully!');
                } else if (isEditModalVisible) {
                    // Update existing user
                    setData((prevData) =>
                        prevData.map((user) =>
                            user.id === modalData.id
                                ? { ...user, ...values, username, updated: new Date().toLocaleString() }
                                : user
                        )
                    );
                    message.success('User updated successfully!');
                }
                closeModal();
            })
            .catch((info) => {
                console.error('Validation Failed:', info);
            });
    };

    const closeModal = () => {
        form.resetFields();
        setModalData(null);
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
    };

    return (
        <Modal
            title={isCreateModalVisible ? 'Create User' : 'Edit User'}
            visible={isCreateModalVisible || isEditModalVisible}
            onOk={handleCreateOrUpdate}
            onCancel={closeModal}
            okText={isCreateModalVisible ? 'Create' : 'Update'}
        >
            <Form form={form} layout="vertical">
                {/* First Name */}
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                        { 
                            required: !(isEditModalVisible && (modalData?.role === 'Teacher' || modalData?.role === 'Student')), 
                            message: 'Please input the first name!' 
                        }
                    ]}
                >
                    <Input
                        onChange={(e) => handleFirstNameChange(e.target.value)}
                        disabled={isEditModalVisible && (modalData?.role === 'Teacher' || modalData?.role === 'Student')}
                    />
                </Form.Item>

                {/* Last Name */}
                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                        { 
                            required: !(isEditModalVisible && (modalData?.role === 'Teacher' || modalData?.role === 'Student')), 
                            message: 'Please input the last name!' 
                        }
                    ]}
                >
                    <Input
                        onChange={(e) => handleLastNameChange(e.target.value)}
                        disabled={isEditModalVisible && (modalData?.role === 'Teacher' || modalData?.role === 'Student')}
                    />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input the password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                {/* Role */}
                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select the role!' }]}
                >
                    <Select disabled={isEditModalVisible && (modalData?.role === 'Teacher' || modalData?.role === 'Student')}>
                        <Option value="Superadmin">Superadmin</Option>
                        <Option value="Admin">Admin</Option>
                        {isCreateModalVisible && (
                            <>
                                {/* Removed Teacher and Student roles from the Create modal */}
                            </>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserModals;
