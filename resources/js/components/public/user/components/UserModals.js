import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Row, Col, Select } from 'antd';
import axios from 'axios';
import DropdownReligion from '../../profile/components/DropdownReligion';  

const { Option } = Select;

const UserModals = ({
    isEditModalVisible,
    setIsEditModalVisible,
    isCreateModalVisible,
    setIsCreateModalVisible,
    reloadData,
    data,
    setData,
    modalData,
    setModalData,
    roles = [],
}) => {
    const [form] = Form.useForm();
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (modalData) {
            
            form.setFieldsValue({
                username: modalData.username || '',
                role_id: modalData.role_id,
                password: modalData.password || '',
                first_name: modalData.first_name || '',
                middle_initial: modalData.middle_initial || '',
                last_name: modalData.last_name || '',
                sex: modalData.sex || '',
                marital_status: modalData.marital_status || '',
                religion: modalData.religion || '',
                age: modalData.age || '',
                phone_number: modalData.phone_number || '',
                address: modalData.address || '',
            });

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

    const handleCreateUser = () => {
        form.validateFields()
            .then((values) => {
                const userData = {
                    username: values.username,
                    email: `${values.username}@urios.edu.ph`,
                    password: values.password,
                    role_id: values.role_id, 
                    first_name: values.first_name,
                    last_name: values.last_name,
                    middle_initial: values.middle_initial,
                    sex: values.sex,
                    marital_status: values.marital_status,
                    religion: values.religion,
                    age: values.age,
                    phone_number: values.phone_number,
                    address: values.address,
                };
    
               
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    message.error('No auth token found. Please log in.');
                    return;
                }
    
                
                axios.post('/api/user-with-profile', userData, {
                    headers: {
                        Authorization: `Bearer ${token}`,  
                    },
                })
                    .then((response) => {
                        message.success('User created successfully!');
                        setIsCreateModalVisible(false); 
                        setModalData(null); 
    
                        
                        reloadData(); 

                        form.resetFields();
    
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 422) {
                            
                            const errors = error.response.data.errors; 
                            Object.keys(errors).forEach((field) => {
                                
                                message.error(`${field}: ${errors[field].join(', ')}`);
                            });
                        } else {
                            
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
            title={isCreateModalVisible ? 'Create User' : 'Edit User'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={() => {
                setIsCreateModalVisible(false);
                setIsEditModalVisible(false);
                setModalData(null);
            }}
            onOk={handleCreateUser}
            okText={isCreateModalVisible ? 'Create' : 'Update'}
            width={1000}  
        >
            <Form form={form} layout="vertical" name="userForm">
                <Row gutter={24}>
                    <Col span={12}>
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
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input the password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            rules={[{ required: true, message: 'Please input the first name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="middle_initial"
                            label="Middle Initial"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please input the last name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

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

                    <Col span={12}>
                        <Form.Item
                            name="religion"
                            label="Religion"
                            rules={[{ required: true, message: 'Please select a religion!' }]}
                        >
                            <DropdownReligion value={form.getFieldValue('religion')} onChange={(value) => form.setFieldsValue({ religion: value })} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="age"
                            label="Age"
                            rules={[{ required: true, message: 'Please input the age!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please input the address!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="role_id"
                            label="Role"
                            rules={[{ required: true, message: 'Please select a role!' }]}
                        >
                            <Select>
                                <Option value="1">Superadmin</Option>
                                <Option value="2">Admin</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UserModals;
