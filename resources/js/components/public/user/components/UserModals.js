// UserModals.js
import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const UserModals = ({
    isEditModalVisible,
    setIsEditModalVisible,
    isDeleteModalVisible,
    setIsDeleteModalVisible,
    isCreateModalVisible,
    setIsCreateModalVisible,
    data,
    setData,
    modalData,
    setModalData
}) => {

    const handleCreateOk = (values) => {
        // Simply add the new user to the data (no API call)
        const newUser = { ...values, key: Date.now() }; // Use Date.now() for a unique key
        setData([...data, newUser]);
        setIsCreateModalVisible(false);
    };

    const handleEditOk = (values) => {
        // Simply update the user data (no API call)
        const updatedData = data.map(item =>
            item.key === modalData.key ? { ...item, ...values } : item
        );
        setData(updatedData);
        setIsEditModalVisible(false);
    };

    const handleDeleteOk = () => {
        // Simply remove the user from data (no API call)
        const updatedData = data.filter(item => item.key !== modalData.key);
        setData(updatedData);
        setIsDeleteModalVisible(false);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
        setIsDeleteModalVisible(false);
    };

    return (
        <>
            <Modal
                title="Create New User"
                visible={isCreateModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleCreateOk}>
                    <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input the username!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select the role!' }]}>
                        <Select>
                            <Option value="Superadmin">Superadmin</Option>
                            <Option value="Admin">Admin</Option>
                            <Option value="Teacher">Teacher</Option>
                            <Option value="Student">Student</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit User"
                visible={isEditModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form initialValues={modalData} onFinish={handleEditOk}>
                    <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input the username!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select the role!' }]}>
                        <Select>
                            <Option value="Superadmin">Superadmin</Option>
                            <Option value="Admin">Admin</Option>
                            <Option value="Teacher">Teacher</Option>
                            <Option value="Student">Student</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Delete User"
                visible={isDeleteModalVisible}
                onOk={handleDeleteOk}
                onCancel={handleCancel}
                footer={null}
            >
                <p>Are you sure you want to delete this user?</p>
                <Button type="danger" onClick={handleDeleteOk}>Yes</Button>
                <Button onClick={handleCancel}>No</Button>
            </Modal>
        </>
    );
};

export default UserModals;
