import React, { useState } from 'react';
import { Card, List, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const TeacherProfiles = ({ teachers, searchQuery, fetchData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [form] = Form.useForm();

    
    const filteredTeachers = teachers.filter(
        teacher =>
            teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    
    const showModal = (teacher = null) => {
        setIsModalVisible(true);
        setCurrentTeacher(teacher);
        if (teacher) {
            form.setFieldsValue(teacher); 
        } else {
            form.resetFields(); 
        }
    };

    
    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentTeacher(null);
    };

    
    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (currentTeacher) {
                
                await axios.put(`https://api.example.com/teachers/${currentTeacher.id}`, values);
                message.success('Teacher profile updated successfully');
            } else {
                
                await axios.post('https://api.example.com/teachers', values);
                message.success('Teacher profile created successfully');
            }

            
            fetchData();
            setIsModalVisible(false);
        } catch (error) {
            message.error('Failed to save teacher profile');
        }
    };

    
    const handleDelete = async (teacherId) => {
        try {
            await axios.delete(`https://api.example.com/teachers/${teacherId}`);
            message.success('Teacher profile deleted successfully');
            fetchData();
        } catch (error) {
            message.error('Failed to delete teacher profile');
        }
    };

    return (
        <Card title="Teacher Profiles" bordered={false}>
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
                Add Teacher
            </Button>
            <List
                dataSource={filteredTeachers}
                renderItem={teacher => (
                    <List.Item
                        actions={[
                            <Button type="link" onClick={() => showModal(teacher)}>
                                Edit
                            </Button>,
                            <Button type="link" danger onClick={() => handleDelete(teacher.id)}>
                                Delete
                            </Button>
                        ]}
                    >
                        {teacher.name} - {teacher.subject} - {teacher.email}
                    </List.Item>
                )}
            />

            {}
            <Modal
                title={currentTeacher ? 'Edit Teacher' : 'Add Teacher'}
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                okText={currentTeacher ? 'Update' : 'Create'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: '',
                        subject: '',
                        email: ''
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the teacher name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[{ required: true, message: 'Please input the subject!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input the teacher email!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default TeacherProfiles;