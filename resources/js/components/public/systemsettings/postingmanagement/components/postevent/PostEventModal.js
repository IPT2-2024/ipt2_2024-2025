import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, DatePicker, TimePicker, message } from 'antd';
import moment from 'moment';

const PostEventModal = ({
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
    const [initialDate, setInitialDate] = useState(null);

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            setInitialDate(moment(modalData.date)); // Save the initial date for editing
            form.setFieldsValue({
                event_name: modalData.event_name,
                date: moment(modalData.date), // Set the selected date for editing
                time: moment(modalData.time, 'HH:mm'), // Format the time field
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const eventName = values.event_name.trim();
            const eventDate = values.date.format('YYYY-MM-DD');
            const eventTime = values.time.format('HH:mm');

            const eventExists = data.some(
                (event) =>
                    event.event_name.toLowerCase() === eventName.toLowerCase() &&
                    event.date === eventDate &&
                    !(isEditModalVisible && event.id === modalData.id)
            );

            if (eventExists) {
                message.error('An event with this name already exists on the same day.');
                return;
            }

            if (isEditModalVisible) {
                const updatedData = data.map((event) =>
                    event.id === modalData.id
                        ? {
                              ...event,
                              event_name: eventName,
                              date: eventDate,
                              time: eventTime,
                              updated_at: new Date().toISOString(),
                          }
                        : event
                );
                setData(updatedData);
                setIsEditModalVisible(false);
                message.success('Event updated successfully');
            } else {
                const newEvent = {
                    id: Date.now(),
                    event_name: eventName,
                    date: eventDate,
                    time: eventTime,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                setData([...data, newEvent]);
                setIsCreateModalVisible(false);
                message.success('New event created successfully');
            }
            form.resetFields(); // Reset the form fields
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Clear the form when the modal is canceled
    };

    const handleDateChange = (date) => {
        // Ensure the date only updates when explicitly changed by the user, not on hover
        setInitialDate(date);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Event' : 'Create New Event'}
            visible={isEditModalVisible || isCreateModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Event'}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" name="eventForm">
                <Form.Item
                    label="Event Name"
                    name="event_name"
                    rules={[{ required: true, message: 'Please enter an event name!' }]}
                >
                    <Input placeholder="Enter event name" />
                </Form.Item>
                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please select a date!' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        value={initialDate} // Use initialDate state to control the date
                        onChange={handleDateChange} // Ensure manual date change
                    />
                </Form.Item>
                <Form.Item
                    label="Time"
                    name="time"
                    rules={[{ required: true, message: 'Please select a time!' }]}
                >
                    <TimePicker style={{ width: '100%' }} format="hh:mm A" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PostEventModal;
