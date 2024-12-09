import React, { useEffect } from 'react';
import { Modal, Input, Form, message, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs'; // Import dayjs (no need for moment anymore)

const PostEventModal = ({
  isCreateModalVisible,
  setIsCreateModalVisible,
  isEditModalVisible,
  setIsEditModalVisible,
  handleCreateEvent, // Prop for creating a new event
  handleEditEvent,   // Prop for editing an existing event
  modalData,         // Data of the event being edited
  existingEvents,    // Array of existing events for duplicate check
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditModalVisible && modalData) {
      // Pre-fill the form with existing event data when editing
      form.setFieldsValue({
        event_name: modalData.event_name,
        date_start: modalData.date_start ? dayjs(modalData.date_start, 'YYYY-MM-DD') : null,
        date_end: modalData.date_end ? dayjs(modalData.date_end, 'YYYY-MM-DD') : null,
        time_start: modalData.time_start ? dayjs(modalData.time_start, 'HH:mm') : null,
        time_end: modalData.time_end ? dayjs(modalData.time_end, 'HH:mm') : null,
      });
    } else if (isCreateModalVisible) {
      form.resetFields(); // Reset form fields when creating a new event
    }
  }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

  // Handle form submission
  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        // Extract and format form values
        const eventData = {
          event_name: values.event_name.trim(),
          date_start: values.date_start.format('YYYY-MM-DD'), // Format date_start
          date_end: values.date_end ? values.date_end.format('YYYY-MM-DD') : null, // Format date_end or set to null
          time_start: values.time_start ? values.time_start.format('HH:mm') : null, // Format time_start to 24-hour
          time_end: values.time_end ? values.time_end.format('HH:mm') : null,       // Format time_end to 24-hour
        };

        // Validate that date_end is not before date_start
        if (eventData.date_end && dayjs(eventData.date_end).isBefore(eventData.date_start)) {
          message.error('Date End cannot be before Date Start.');
          return;
        }

        // If both time_start and time_end are provided, validate that time_end is not before time_start
        if (eventData.time_start && eventData.time_end) {
          const startDateTime = dayjs(`${eventData.date_start} ${eventData.time_start}`, 'YYYY-MM-DD HH:mm');
          const endDateTime = dayjs(`${eventData.date_end || eventData.date_start} ${eventData.time_end}`, 'YYYY-MM-DD HH:mm');
          if (endDateTime.isBefore(startDateTime)) {
            message.error('Time End cannot be before Time Start.');
            return;
          }
        }

        if (isEditModalVisible) {
          // Invoke the edit handler with event ID and updated data
          handleEditEvent(modalData.id, eventData);
        } else {
          // Invoke the create handler with new event data
          handleCreateEvent(eventData);
        }

        form.resetFields(); // Reset the form after submission
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // Handle modal cancellation
  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields(); // Reset the form when the modal is closed
  };

  return (
    <Modal
      title={isEditModalVisible ? 'Edit Event' : 'Create New Event'}
      visible={isCreateModalVisible || isEditModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEditModalVisible ? 'Save Changes' : 'Create Event'}
      cancelText="Cancel"
      destroyOnClose // Ensure form is reset when modal is closed
    >
      <Form form={form} layout="vertical" name="postEventForm">
        {/* Event Name */}
        <Form.Item
          label="Event Name"
          name="event_name"
          rules={[
            { required: true, message: 'Please enter an event name!' },
            { min: 2, message: 'Event name must be at least 2 characters.' },
            { max: 100, message: 'Event name cannot exceed 100 characters.' },
            // Custom validator for duplicate event names
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const formattedValue = value.trim().toLowerCase();
                const duplicate = existingEvents.some(event =>
                  event.event_name.toLowerCase() === formattedValue && event.id !== (modalData ? modalData.id : null)
                );
                if (duplicate) {
                  return Promise.reject(new Error('This Event already exists.'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            placeholder="Enter event name (e.g., Annual Meeting)"
            maxLength={100}
            aria-label="Event Name"
          />
        </Form.Item>

        {/* Date Start */}
        <Form.Item
          label="Date Start"
          name="date_start"
          rules={[{ required: true, message: 'Please select a start date!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            aria-label="Date Start"
            disabledDate={(current) => current && current < dayjs().startOf('day')} // Optional: Disable past dates
          />
        </Form.Item>

        {/* Date End */}
        <Form.Item
          label="Date End"
          name="date_end"
          rules={[
            // Date End is optional, but if provided, it must not be before Date Start
            ({ getFieldValue }) => ({
              validator(_, value) {
                const dateStart = getFieldValue('date_start');
                if (value && dateStart && value.isBefore(dateStart, 'day')) {
                  return Promise.reject(new Error('Date End cannot be before Date Start.'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            aria-label="Date End"
            disabledDate={(current) => {
              const dateStart = form.getFieldValue('date_start');
              if (!dateStart) {
                return false;
              }
              return current && current < dayjs(dateStart).startOf('day');
            }} // Optional: Disable dates before date_start
          />
        </Form.Item>

        {/* Time Start */}
        <Form.Item
          label="Time Start"
          name="time_start"
        >
          <TimePicker
            style={{ width: '100%' }}
            format="hh:mm A"
            aria-label="Time Start"
            use12Hours
            allowClear
          />
        </Form.Item>

        {/* Time End */}
        <Form.Item
          label="Time End"
          name="time_end"
        >
          <TimePicker
            style={{ width: '100%' }}
            format="hh:mm A"
            aria-label="Time End"
            use12Hours
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostEventModal;
