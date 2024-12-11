import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const StudentEditModal = ({ visible, onEdit, onCancel, student }) => {
    const [form] = Form.useForm();

    // Set form fields when the modal is visible or student data is updated
    useEffect(() => {
        if (student) {
            form.setFieldsValue({
                first_name: student.first_name,
                last_name: student.last_name,
                suffix: student.suffix,
                age: student.age,
                address: student.address,
                date_of_birth: student.date_of_birth ? moment(student.date_of_birth) : null,
                gender: student.gender,
                phone_number: student.phone_number,
                marital_status: student.marital_status,
                religion: student.religion,
            });
        }
    }, [student, form]);

    // Handle form submission and send updated data to the server
    const handleUpdate = () => {
        form.validateFields().then((values) => {
            // Make an API call to update the student
            axios
                .put(`/api/profile/${student.id}`, values) // Update endpoint
                .then((response) => {
                    onEdit(); // Callback to notify parent component of the update
                    onCancel(); // Close the modal
                    form.resetFields(); // Reset form fields
                })
                .catch((error) => {
                    console.error('Error updating student', error);
                });
        });
    };

    return (
        <Modal
            visible={visible}
            title="Edit Student"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={handleUpdate}
        >
            <Form form={form} layout="vertical" name="student_edit">
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter the first name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter the last name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="suffix"
                    label="Suffix"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="age"
                    label="Age"
                    rules={[{ required: true, message: 'Please enter the age!' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please enter the address!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="date_of_birth"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'Please select the date of birth!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Sex/Gender"
                    rules={[{ required: true, message: 'Please select gender!' }]}
                >
                    <Select placeholder="Select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="phone_number"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter the phone number!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="marital_status"
                    label="Marital Status"
                    rules={[{ required: true, message: 'Please select marital status!' }]}
                >
                    <Select placeholder="Select marital status">
                        <Option value="single">Single</Option>
                        <Option value="married">Married</Option>
                        <Option value="divorced">Divorced</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="religion"
                    label="Religion"
                    rules={[{ required: true, message: 'Please enter religion!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StudentEditModal;
