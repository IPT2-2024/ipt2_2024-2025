import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, DatePicker, Select, Row, Col, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import DropdownReligion from '../../profile/components/DropdownReligion'; // Ensure the path is correct

const { Option } = Select;

const StudentCreateModal = ({ isVisible, onCancel, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // To handle loading state
    const [programs, setPrograms] = useState([]); // Store the list of programs
    const [filteredPrograms, setFilteredPrograms] = useState([]); // Filtered list for dropdown
    const [loadingPrograms, setLoadingPrograms] = useState(false); // Loading state for programs
    const [yearLevels, setYearLevels] = useState([]); // To store fetched year levels
    const [loadingYearLevels, setLoadingYearLevels] = useState(false); // To handle loading year levels

    useEffect(() => {
        if (isVisible) {
            fetchPrograms();
            fetchYearLevels();
            form.resetFields(); // Reset form fields when modal becomes visible
        }
    }, [isVisible]);

    const handleCreate = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const formattedValues = {
                ...values,
                admission_date: values.admission_date ? values.admission_date.format('YYYY-MM-DD') : null,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
                program_department_id: values.program_department_id,
                yearlevel_id: values.yearlevel_id,
                phone_number: `+63${values.phone_number}`, // Combine prefix with phone number
            };

            if (values.first_name && values.last_name) {
                const username = `${values.first_name.toLowerCase()}.${values.last_name.toLowerCase()}`;
                const email = `${username}@urios.edu.ph`;

                formattedValues.username = username;
                formattedValues.email = email;
            }

            formattedValues.role_id = 4;

            const authToken = localStorage.getItem('auth_token');

            if (!authToken) {
                message.error('Authorization token not found.');
                return;
            }

            console.log('Form Values:', formattedValues);

            const response = await axios.post('/api/user-with-profile/students/create', formattedValues, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 201 || response.status === 200) {
                message.success('Student profile created successfully.');
                form.resetFields();
                onCreate();
                onCancel();
            } else {
                message.warning('Profile creation did not succeed. Please check the data.');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An unexpected error occurred.');
        } finally {
            setLoading(false); 
        }
    };

    const fetchPrograms = async (search = '') => {
        try {
            setLoadingPrograms(true);

            const authToken = localStorage.getItem('auth_token');

            if (!authToken) {
                message.error('Authorization token not found.');
                return;
            }

            const response = await axios.get('/api/collegeprogramdepartment/filter/programs', {
                params: { search },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            setPrograms(response.data.programs || []);
            setFilteredPrograms(response.data.programs || []);
        } catch (error) {
            console.error('Failed to fetch programs:', error);
            message.error('Unable to fetch programs. Please try again.');
        } finally {
            setLoadingPrograms(false);
        }
    };

    const fetchYearLevels = async () => {
        try {
            setLoadingYearLevels(true);
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                message.error('Authorization token not found.');
                return;
            }
            
            const response = await axios.get('/api/yearlevel', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            setYearLevels(response.data || []);
        } catch (error) {
            console.error('Failed to fetch year levels:', error);
            message.error('Unable to fetch year levels. Please try again.');
        } finally {
            setLoadingYearLevels(false);
        }
    };

    // Custom validator to ensure phone number has exactly 10 digits
    const validatePhoneNumber = (_, value) => {
        if (!value) {
            return Promise.reject('');
        }
        const regex = /^\d{10}$/;
        if (!regex.test(value)) {
            return Promise.reject('Phone number must be exactly 10 digits!');
        }
        return Promise.resolve();
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
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical" requiredMark="optional">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter the first name!' }]} 
                        >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter the last name!' }]} 
                        >
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
                            rules={[{ required: true, message: 'Please select the admission date!' }]} 
                            initialValue={moment()}
                        >
                            <DatePicker 
                                style={{ width: '100%' }} 
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="religion"
                            label="Religion"
                            rules={[{ required: true, message: 'Please select a religion!' }]} 
                        >
                            <DropdownReligion
                                value={form.getFieldValue('religion')}
                                onChange={(value) => form.setFieldsValue({ religion: value })}
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="date_of_birth"
                            label="Date of Birth"
                            rules={[
                                { required: true, message: 'Please select the date of birth!' },
                                {
                                    validator: (_, value) => {
                                        if (!value) return Promise.resolve();

                                        // Check if the chosen date is after today's date minus 16 years
                                        if (value.isAfter(moment().subtract(16, 'years'))) {
                                            return Promise.reject('Please choose a date at least 16 years before today!');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
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
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="sex"
                            label="Sex/Gender"
                            rules={[{ required: true, message: 'Please select gender!' }]} 
                        >
                            <Select placeholder="Select gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[
                                { required: true, message: 'Please enter the phone number!' },
                                { validator: validatePhoneNumber },
                            ]}
                        >
                            <Input
                                addonBefore="+63"
                                placeholder="Enter phone number"
                                maxLength={10}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please enter the address!' }]} 
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={16}>
                        <Form.Item
                            name="program_department_id"
                            label="Program"
                            rules={[{ required: true, message: 'Please select a program!' }]}
                        >
                            <Select
                                placeholder="Select program"
                                style={{ width: '100%' }}
                                loading={loadingPrograms}
                            >
                                {filteredPrograms && filteredPrograms.length > 0 ? (
                                    filteredPrograms.map((program) => (
                                        <Select.Option key={program.program_department_id} value={program.program_department_id}>
                                            {program.program_name}
                                        </Select.Option>
                                    ))
                                ) : (
                                    <Select.Option disabled key="no-programs">
                                        No programs available
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="yearlevel_id"
                            label="Year Level"
                            rules={[{ required: true, message: 'Please select a year level!' }]} 
                        >
                            <Select placeholder="Select year level" loading={loadingYearLevels}>
                                {yearLevels.map((level) => (
                                    <Option key={level.id} value={level.id}>
                                        {level.year_level}
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

export default StudentCreateModal;
