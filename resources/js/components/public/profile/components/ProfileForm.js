import React from 'react';
import { Row, Col, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import DropdownSex from './DropdownSex';
import DropdownReligion from './DropdownReligion';
import DropdownMaritalStatus from './DropdownMaritalStatus';

const ProfileForm = ({ form, userData, isEditing }) => {
    return (
        <Form form={form} layout="vertical" initialValues={userData}>
            <Row gutter={[16, 24]}>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Firstname" name="firstname" initialValue={userData?.first_name}>
                        <Input placeholder="Firstname" prefix={<UserOutlined />} disabled={!isEditing} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Middle Initial" name="middleinitial" initialValue={userData?.middle_initial}>
                        <Input placeholder="Middle Initial" disabled={!isEditing} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Lastname" name="lastname" initialValue={userData?.last_name}>
                        <Input placeholder="Lastname" prefix={<UserOutlined />} disabled={!isEditing} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 24]}>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Sex" name="sex" initialValue={userData?.sex}>
                        <DropdownSex 
                            value={userData?.sex} 
                            onChange={(val) => form.setFieldsValue({ sex: val })} 
                            disabled={!isEditing} 
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Marital Status" name="maritalStatus" initialValue={userData?.marital_status}>
                        <DropdownMaritalStatus 
                            value={userData?.marital_status} 
                            onChange={(val) => form.setFieldsValue({ maritalStatus: val })} 
                            disabled={!isEditing} 
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Religion" name="religion" initialValue={userData?.religion}>
                        <DropdownReligion 
                            value={userData?.religion} 
                            onChange={(val) => form.setFieldsValue({ religion: val })} 
                            disabled={!isEditing} 
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 24]}>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Age" name="age" initialValue={userData?.age}>
                        <Input type="number" placeholder="Age" disabled={!isEditing} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Phone Number" name="phoneNumber" initialValue={userData?.phone_number}>
                        <Input placeholder="Phone Number" disabled={!isEditing} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Address" name="address" initialValue={userData?.address}>
                        <Input.TextArea placeholder="Address" rows={4} disabled={!isEditing} />
                    </Form.Item>

                    
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileForm;
