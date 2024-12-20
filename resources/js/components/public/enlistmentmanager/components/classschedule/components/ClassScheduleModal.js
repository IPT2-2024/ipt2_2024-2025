import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, Select, message, TimePicker } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const ClassScheduleModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                start_time: dayjs(modalData.start_time, 'HH:mm'),
                end_time: dayjs(modalData.end_time, 'HH:mm'),
                day_of_week: modalData.day_of_week,
                classifiedsection_id: modalData.classifiedsection_id,
                academicprogram_id: modalData.academicprogram_id,
                classroomscheduling_id: modalData.classroomscheduling_id,
                profile_id: modalData.profile_id,
                semacyear_id: modalData.semacademic_id,
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const { start_time, end_time, day_of_week, classifiedsection_id, academicprogram_id, classroomscheduling_id, profile_id, semacyear_id } = values;

            // Validate that all fields have values
            if (!start_time || !end_time || !day_of_week || !classifiedsection_id || !academicprogram_id || !classroomscheduling_id) {
                message.error('Please fill in all required fields');
                return;
            }

            const formattedValues = {
                ...values,
                start_time: start_time.format('HH:mm'),
                end_time: end_time.format('HH:mm'),
                updated_at: new Date().toISOString(),
            };

            if (isEditModalVisible) {
                // Handle update logic for an existing schedule
                const updatedData = data.map((schedule) =>
                    schedule.id === modalData.id
                        ? { ...schedule, ...formattedValues }
                        : schedule
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Class Schedule updated successfully');
            } else {
                // Handle create logic for a new schedule
                const newSchedule = {
                    id: Date.now(), // Auto-generate unique ID using timestamp
                    ...formattedValues,
                    created_at: new Date().toISOString(),
                };
                setData([...data, newSchedule]);
                setIsCreateModalVisible(false);
                message.success('New Class Schedule created successfully');
            }
            form.resetFields(); // Reset the form fields
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Clear the form when the modal is canceled
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Class Schedule' : 'Create New Class Schedule'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Class Schedule'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="classScheduleForm">
                <Form.Item
                    label="Start Time"
                    name="start_time"
                    rules={[{ required: true, message: 'Please select the start time!' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    label="End Time"
                    name="end_time"
                    rules={[{ required: true, message: 'Please select the end time!' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    label="Day of Week"
                    name="day_of_week"
                    rules={[{ required: true, message: 'Please select the day of the week!' }]}
                >
                    <Select placeholder="Select day of the week">
                        <Option value="M">Monday</Option>
                        <Option value="T">Tuesday</Option>
                        <Option value="W">Wednesday</Option>
                        <Option value="TH">Thursday</Option>
                        <Option value="F">Friday</Option>
                        <Option value="S">Saturday</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Classified Section ID"
                    name="classifiedsection_id"
                    rules={[{ required: true, message: 'Please enter the classified section ID!' }]}
                >
                    <Input placeholder="Enter classified section ID" />
                </Form.Item>
                <Form.Item
                    label="Academic Program ID"
                    name="academicprogram_id"
                    rules={[{ required: true, message: 'Please enter the academic program ID!' }]}
                >
                    <Input placeholder="Enter academic program ID" />
                </Form.Item>
                <Form.Item
                    label="Classroom Scheduling ID"
                    name="classroomscheduling_id"
                    rules={[{ required: true, message: 'Please enter the classroom scheduling ID!' }]}
                >
                    <Input placeholder="Enter classroom scheduling ID" />
                </Form.Item>
                <Form.Item
                    label="Profile ID"
                    name="profile_id"
                >
                    <Input placeholder="Enter profile ID (optional)" />
                </Form.Item>
                <Form.Item
                    label="Semester Academic Year ID"
                    name="semacyear_id"
                >
                    <Input placeholder="Enter semester academic year ID (optional)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ClassScheduleModal;
