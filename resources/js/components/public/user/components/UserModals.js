import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import axios from 'axios';  // Ensure axios is installed for API requests

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
    // Fetch user data for Edit modal
    useEffect(() => {
        if (isEditModalVisible && modalData?.key) {
            // Make API call to fetch data based on modalData key
            axios.get(`/api/users/${modalData.key}`)
                .then(response => {
                    setModalData(response.data);
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [isEditModalVisible, modalData?.key, setModalData]);

    // Handle the Edit form submit (update user)
    const handleEditOk = (values) => {
        axios.put(`/api/users/${modalData.key}`, values)
            .then(response => {
                const updatedData = data.map(item =>
                    item.key === modalData.key ? { ...item, ...values } : item
                );
                setData(updatedData);
                setIsEditModalVisible(false);
            })
            .catch(error => {
                console.error("Error updating user:", error);
            });
    };

    // Handle Create form submit (create new user)
    const handleCreateOk = (values) => {
        axios.post('/api/users', values)
            .then(response => {
                setData([...data, response.data]);
                setIsCreateModalVisible(false);
            })
            .catch(error => {
                console.error("Error creating user:", error);
            });
    };

    // Handle Delete action (delete user)
    const handleDeleteOk = () => {
        axios.delete(`/api/users/${modalData.key}`)
            .then(response => {
                setData(data.filter(item => item.key !== modalData.key));
                setIsDeleteModalVisible(false);
            })
            .catch(error => {
                console.error("Error deleting user:", error);
            });
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
        setIsDeleteModalVisible(false);
    };

    return (
        <>
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
        </>
    );
};

export default UserModals;
