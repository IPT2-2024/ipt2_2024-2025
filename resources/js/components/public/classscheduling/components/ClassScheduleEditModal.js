import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;

const ClassScheduleEditModal = ({ visible, onClose, scheduleData, onUpdate }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (scheduleData) {
            form.setFieldsValue(scheduleData);
        } else {
            form.resetFields();
        }
    }, [scheduleData, form]);

    const handleSubmit = (values) => {
        // Update the schedule data dynamically
        onUpdate({ ...scheduleData, ...values });
        message.success('Class schedule updated successfully!');
        onClose();
    };
// testing only -tishia
    return (
        <Modal
            title="Edit Class Schedule"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="className"
                    label="Class Name"
                    rules={[{ required: true, message: 'Please enter the class name!' }]}
                >
                    <Input placeholder="Enter class name" />
                </Form.Item>

                <Form.Item
                    name="day"
                    label="Day"
                    rules={[{ required: true, message: 'Please select a day!' }]}
                >
                    <Select placeholder="Select a day">
                        <Option value="Monday">Monday</Option>
                        <Option value="Tuesday">Tuesday</Option>
                        <Option value="Wednesday">Wednesday</Option>
                        <Option value="Thursday">Thursday</Option>
                        <Option value="Friday">Friday</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="time"
                    label="Time"
                    rules={[{ required: true, message: 'Please enter the time!' }]}
                >
                    <Input placeholder="Enter time (e.g., 9:00 AM - 10:00 AM)" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                    <Button style={{ marginLeft: '10px' }} onClick={onClose}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ClassScheduleEditModal;

