import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Row, Col, Select, Button } from 'antd';
import axios from 'axios';
import DropdownReligion from '../../profile/components/DropdownReligion';  // Adjust the path as necessary

const { Option } = Select;

const UserCreateModal = ({
    isVisible,
    setIsVisible,
    reloadData,
    roles = [],
}) => {
    const [form] = Form.useForm();
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (!isVisible) {
            form.resetFields();
            setUsername('');
        }
    }, [isVisible, form]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleCreateUser = () => {
        form.validateFields()
            .then((values) => {
                const userData = {
                    username: values.username,
                    email: `${values.username}@urios.edu.ph`, // Assuming email is based on username
                    password: values.password,
                    role_id: values.role_id,
                    first_name: values.first_name,
                    middle_initial: values.middle_initial,
                    last_name: values.last_name,
                    sex: values.sex,
                    marital_status: values.marital_status,
                    religion: values.religion,
                    age: values.age,
                    phone_number: values.phone_number,
                    address: values.address,
                };

                // Get the auth token from localStorage
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    message.error('No auth token found. Please log in.');
                    return;
                }

                // Perform the POST request to create user and profile
                axios.post('/api/user-with-profile', userData, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Attach token to the request header
                    },
                })
                    .then((response) => {
                        message.success('User created successfully!');
                        setIsVisible(false); // Close the modal
                        reloadData(); // Refresh the user list
                        form.resetFields(); // Reset the form
                        setUsername('');
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 422) {
                            // If validation errors occur, show them to the user
                            const errors = error.response.data.errors; // Adjust based on your response structure
                            Object.keys(errors).forEach((field) => {
                                // Display error messages for each field
                                message.error(`${field}: ${errors[field].join(', ')}`);
                            });
                        } else {
                            // Generic error message for other types of errors
                            message.error('Failed to create user and profile');
                        }
                        console.error('Error:', error);
                    });
            })
            .catch((error) => {
                message.error('Form validation failed');
            });
    };

    return (
        <Modal
            title="Create User"
            visible={isVisible}
            onCancel={() => setIsVisible(false)}
            onOk={handleCreateUser}
            okText="Create"
            width={1000}  // Set width for landscape mode
            destroyOnClose
        >
            <Form form={form} layout="vertical" name="userCreateForm">
                <Row gutter={24}>
                    {/* Username */}
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please input the username!' }]}
                        >
                            <Input
                                value={username}
                                onChange={handleUsernameChange}
                                placeholder="Enter username"
                            />
                        </Form.Item>
                    </Col>

                    {/* Password */}
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input the password!' }]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    </Col>

                    {/* First Name */}
                    <Col span={12}>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            rules={[{ required: true, message: 'Please input the first name!' }]}
                        >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                    </Col>

                    {/* Middle Initial */}
                    <Col span={12}>
                        <Form.Item
                            name="middle_initial"
                            label="Middle Initial"
                        >
                            <Input placeholder="Enter middle initial" />
                        </Form.Item>
                    </Col>

                    {/* Last Name */}
                    <Col span={12}>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please input the last name!' }]}
                        >
                            <Input placeholder="Enter last name" />
                        </Form.Item>
                    </Col>

                    {/* Sex */}
                    <Col span={12}>
                        <Form.Item
                            name="sex"
                            label="Sex"
                            rules={[{ required: true, message: 'Please select sex!' }]}
                        >
                            <Select placeholder="Select Sex">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Marital Status */}
                    <Col span={12}>
                        <Form.Item
                            name="marital_status"
                            label="Marital Status"
                            rules={[{ required: true, message: 'Please select your marital status!' }]}
                        >
                            <Select placeholder="Select Marital Status">
                                <Option value="single">Single</Option>
                                <Option value="married">Married</Option>
                                <Option value="widowed">Widowed</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Religion */}
                    <Col span={12}>
                        <Form.Item
                            name="religion"
                            label="Religion"
                            rules={[{ required: true, message: 'Please select a religion!' }]}
                        >
                            <DropdownReligion
                                value={form.getFieldValue('religion')}
                                onChange={(value) => form.setFieldsValue({ religion: value })}
                            />
                        </Form.Item>
                    </Col>

                    {/* Age */}
                    <Col span={12}>
                        <Form.Item
                            name="age"
                            label="Age"
                            rules={[{ required: true, message: 'Please input the age!' }]}
                        >
                            <Input placeholder="Enter age" />
                        </Form.Item>
                    </Col>

                    {/* Phone Number */}
                    <Col span={12}>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please input the phone number!' }]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </Col>

                    {/* Address */}
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please input the address!' }]}
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                    </Col>

                    {/* Role */}
                    <Col span={12}>
                        <Form.Item
                            name="role_id"
                            label="Role"
                            rules={[{ required: true, message: 'Please select a role!' }]}
                        >
                            <Select placeholder="Select Role">
                                {roles.map((role) => (
                                    <Option key={role.id} value={role.id}>
                                        {role.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

    export default UserCreateModal;