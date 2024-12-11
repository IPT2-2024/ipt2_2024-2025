import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;

const ClassScheduleModal = ({ visible, onClose, onSubmit, defaultValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (defaultValues) {
            form.setFieldsValue(defaultValues);
        } else {
            form.resetFields();
        }
    }, [defaultValues, form]);

    const handleSubmit = (values) => {
        onSubmit(defaultValues ? { ...defaultValues, ...values } : values);
        form.resetFields();
        onClose();
        message.success(
            defaultValues ? 'Class schedule updated successfully!' : 'Class schedule created successfully!'
        );
    };
// testing only -tishia
    return (
        <Modal
            title={defaultValues ? 'Edit Class Schedule' : 'Create New Class Schedule'}
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
                        {defaultValues ? 'Save Changes' : 'Create Schedule'}
                    </Button>
                    <Button style={{ marginLeft: '10px' }} onClick={onClose}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ClassScheduleModal;
