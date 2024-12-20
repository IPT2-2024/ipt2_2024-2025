import React, { useState } from 'react';
import { Table, Modal, Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;

const ClassScheduleTables = () => {
    const [schedules, setSchedules] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    const handleCreate = (newSchedule) => {
        setSchedules([...schedules, { id: Date.now(), ...newSchedule }]);
        message.success('Class schedule created successfully!');
    };

    const handleEdit = (updatedSchedule) => {
        setSchedules(schedules.map(schedule => schedule.id === updatedSchedule.id ? updatedSchedule : schedule));
        message.success('Class schedule updated successfully!');
    };

    const handleDelete = (id) => {
        setSchedules(schedules.filter(schedule => schedule.id !== id));
        message.success('Class schedule deleted successfully!');
    };

    const columns = [
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'className',
        },
        {
            title: 'Day',
            dataIndex: 'day',
            key: 'day',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => {
                        setEditingSchedule(record);
                        setIsEditModalVisible(true);
                    }}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];
// testing only -tishia
    return (
        <div>
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                Create New Schedule
            </Button>
            <Table dataSource={schedules} columns={columns} rowKey="id" />

            {isCreateModalVisible && (
                <ClassScheduleModal
                    visible={isCreateModalVisible}
                    onClose={() => setIsCreateModalVisible(false)}
                    onSubmit={handleCreate}
                />
            )}

            {isEditModalVisible && editingSchedule && (
                <ClassScheduleModal
                    visible={isEditModalVisible}
                    onClose={() => {
                        setIsEditModalVisible(false);
                        setEditingSchedule(null);
                    }}
                    onSubmit={handleEdit}
                    defaultValues={editingSchedule}
                />
            )}
        </div>
    );
};

const ClassScheduleModal = ({ visible, onClose, onSubmit, defaultValues }) => {
    const [form] = Form.useForm();

    useState(() => {
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
    };

    return (
        <Modal
            title={defaultValues ? "Edit Class Schedule" : "Create New Class Schedule"}
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
                        {defaultValues ? "Save Changes" : "Create Schedule"}
                    </Button>
                    <Button style={{ marginLeft: '10px' }} onClick={onClose}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ClassScheduleTables;
