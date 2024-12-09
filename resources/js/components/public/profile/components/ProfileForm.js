import React from 'react';
import { Row, Col, Form, Input, Descriptions } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import DropdownSex from './DropdownSex';
import DropdownReligion from './DropdownReligion';
import DropdownMaritalStatus from './DropdownMaritalStatus';

const ProfileForm = ({ form, isEditing }) => {
    
    const items = [
        { key: '1', label: 'Firstname', children: form.getFieldValue('firstname') || 'N/A' },
        { key: '2', label: 'Middle Initial', children: form.getFieldValue('middleinitial') || 'N/A' },
        { key: '3', label: 'Lastname', children: form.getFieldValue('lastname') || 'N/A' },
        { key: '4', label: 'Sex', children: form.getFieldValue('sex') || 'N/A' },
        { key: '5', label: 'Marital Status', children: form.getFieldValue('maritalStatus') || 'N/A' },
        { key: '6', label: 'Religion', children: form.getFieldValue('religion') || 'N/A' },
        { key: '7', label: 'Age', children: form.getFieldValue('age') || 'N/A' },
        { key: '8', label: 'Phone Number', children: form.getFieldValue('phoneNumber') || 'N/A' },
        { key: '9', label: 'Address', children: form.getFieldValue('address') || 'N/A' },
    ];

    
    const formDisabled = !isEditing;

    return (
        <Form form={form} layout="vertical">
            {isEditing ? (
                
                <>
                    <Row gutter={[16, 24]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Firstname" name="firstname">
                                <Input placeholder="Firstname" prefix={<UserOutlined />} disabled={formDisabled} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Middle Initial" name="middleinitial">
                                <Input placeholder="Middle Initial" disabled={formDisabled} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Lastname" name="lastname">
                                <Input placeholder="Lastname" prefix={<UserOutlined />} disabled={formDisabled} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 24]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Sex" name="sex">
                                <DropdownSex
                                    value={form.getFieldValue('sex')}
                                    onChange={(val) => form.setFieldsValue({ sex: val })}
                                    disabled={formDisabled}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Marital Status" name="maritalStatus">
                                <DropdownMaritalStatus
                                    value={form.getFieldValue('maritalStatus')}
                                    onChange={(val) => form.setFieldsValue({ maritalStatus: val })}
                                    disabled={formDisabled}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Religion" name="religion">
                                <DropdownReligion
                                    value={form.getFieldValue('religion')}
                                    onChange={(val) => form.setFieldsValue({ religion: val })}
                                    disabled={formDisabled}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 24]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Age" name="age">
                                <Input placeholder="Age" disabled={formDisabled} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Phone Number" name="phoneNumber">
                                <Input placeholder="Phone Number" disabled={formDisabled} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Address" name="address">
                                <Input placeholder="Address" disabled={formDisabled} />
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            ) : (
                
                <Descriptions title="Profile Information" bordered>
                    {items.map(item => (
                        <Descriptions.Item label={item.label} key={item.key}>
                            {item.children}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            )}
        </Form>
    );
};

export default ProfileForm;
