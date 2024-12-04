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
                username: modalData.username || '', // Only use the username field now
                role: modalData.role,
                password: modalData.password || '', // Password field can be empty when editing
            });
            
            // Set username if modalData exists
            if (modalData.username) {
                setUsername(modalData.username);
            }
        } else {
            form.resetFields();
            setUsername('');
        }
    }, [modalData, form]);

    const handleUsernameChange = (value) => {
        setUsername(value);
    };

    const handleCreateOrUpdate = () => {
        form.validateFields()
            .then((values) => {
                if (isCreateModalVisible) {
                    // Add new user
                    const newUser = {
                        ...values,
                        username: `${username}@gmail.com`, // Ensure username is used for email
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
                                ? { ...user, ...values, username: `${username}@gmail.com`, updated: new Date().toLocaleString() }
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
                {/* Username */}
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input the username!' }]}
                >
                    <Input
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="Enter username"
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
                        {/* Removed Teacher and Student roles from the Create modal */}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserModals;
