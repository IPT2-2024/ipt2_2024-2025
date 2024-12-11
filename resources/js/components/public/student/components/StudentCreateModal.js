import React, { useState } from 'react';
import { Modal, Input, Form, DatePicker, Select, Row, Col, message } from 'antd';
import axios from 'axios';
import DropdownReligion from '../../profile/components/DropdownReligion'; // Ensure the path is correct

const { Option } = Select;

const StudentCreateModal = ({ isVisible, onCancel, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // To handle loading state

    const handleCreate = async () => {
        try {
            setLoading(true); // Start loading
            const values = await form.validateFields();

            // Ensure date_of_birth and admission_date are formatted correctly, only if they exist
            const formattedValues = {
                ...values,
                admission_date: values.admission_date
                    ? values.admission_date.format('YYYY-MM-DD')
                    : null, // If no admission date, set to null
                date_of_birth: values.date_of_birth
                    ? values.date_of_birth.format('YYYY-MM-DD')
                    : null, // If no date of birth, set to null
            };

            // Automatically generate school email based on first and last name
            if (values.first_name && values.last_name) {
                const schoolEmail = `${values.first_name.toLowerCase()}.${values.last_name.toLowerCase()}@urios.edu.ph`;
                formattedValues.school_email = schoolEmail;
            }

            const authToken = localStorage.getItem('auth_token');

            if (!authToken) {
                message.error('Authorization token not found.');
                return;
            }

            // Log the values being sent to ensure they're correct
            console.log('Form Values:', formattedValues);

            // Make API request to create the student profile
            const response = await axios.post('/api/profiles/students/add', formattedValues, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 201 || response.status === 200) {
                message.success('Student profile created successfully.');
                form.resetFields();
                onCreate();  // Trigger the onCreate callback
                onCancel();  // Close the modal
            } else {
                message.warning('Profile creation did not succeed. Please check the data.');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Log the validation errors from the API response
                console.log('Validation Errors:', error.response.data.errors); // Logs field-specific errors

                message.error(
                    `Error: ${error.response.status} - ${
                        error.response.data.message || 'Unable to create profile.'
                    }`
                );
            } else {
                message.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return (
        <Modal
            visible={isVisible}
            title="Add New Student"
            onCancel={onCancel}
            onOk={handleCreate}
            okText="Create"
            cancelText="Cancel"
            width={800}
            style={{ top: 20 }}
            bodyStyle={{ padding: '20px 40px' }}
            destroyOnClose
            confirmLoading={loading} // Show loading state on OK button
        >
            <Form form={form} layout="vertical" requiredMark="optional">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter the first name!' }]} >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter the last name!' }]} >
                            <Input placeholder="Enter last name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="middle_initial" label="Middle Initial">
                            <Input placeholder="Enter middle initial" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item name="suffix" label="Suffix">
                            <Select placeholder="Select suffix">
                                <Option value="Jr.">Jr.</Option>
                                <Option value="Sr.">Sr.</Option>
                                <Option value="III">III</Option>
                                <Option value="IV">IV</Option>
                                <Option value="V">V</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="admission_date"
                            label="Admission Date"
                            rules={[{ required: true, message: 'Please select the admission date!' }]} >
                            <DatePicker style={{ width: '100%' }} placeholder="Select admission date" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="religion"
                            label="Religion"
                            rules={[{ required: true, message: 'Please select a religion!' }]} >
                            <DropdownReligion
                                value={form.getFieldValue('religion')}
                                onChange={(value) => form.setFieldsValue({ religion: value })}
                                style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please enter the address!' }]} >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="sex"
                            label="Sex/Gender"
                            rules={[{ required: true, message: 'Please select gender!' }]} >
                            <Select placeholder="Select gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please enter the phone number!' }]} >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="marital_status"
                            label="Marital Status"
                            rules={[{ required: true, message: 'Please select marital status!' }]} >
                            <Select placeholder="Select marital status">
                                <Option value="single">Single</Option>
                                <Option value="married">Married</Option>
                                <Option value="divorced">Divorced</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default StudentCreateModal;
