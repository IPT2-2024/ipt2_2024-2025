// PostEventModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, Typography, DatePicker, TimePicker, message } from 'antd';
import moment from 'moment'; // Ensure consistent use of moment

const { Text } = Typography;

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
  const [isDateStartSet, setIsDateStartSet] = useState(false);
  const [isTimeStartSet, setIsTimeStartSet] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false); // Loading state for form submission

  useEffect(() => {
    if (isEditModalVisible && modalData) {
      // Pre-fill the form with existing event data when editing
      form.setFieldsValue({
        event_name: modalData.event_name,
        date_start: modalData.date_start ? moment(modalData.date_start, 'YYYY-MM-DD') : null,
        date_end: modalData.date_end ? moment(modalData.date_end, 'YYYY-MM-DD') : null,
        time_start: modalData.time_start ? moment(modalData.time_start, 'HH:mm') : null,
        time_end: modalData.time_end ? moment(modalData.time_end, 'HH:mm') : null,
      });
      setIsDateStartSet(!!modalData.date_start);
      setIsTimeStartSet(!!modalData.time_start);
    } else if (isCreateModalVisible) {
      form.resetFields(); // Reset form fields when creating a new event
      setIsDateStartSet(false);
      setIsTimeStartSet(false);
    }
  }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

  // Define the validateEventName function
  const validateEventName = (_, value) => {
    if (!value) {
      return Promise.reject('Please enter an event name');
    }

    const eventNameLower = value.toLowerCase().trim();

    // Check for duplicates in combined data
    const duplicate = existingEvents.some(event => 
      event.event_name.toLowerCase().trim() === eventNameLower && 
      (isEditModalVisible ? event.id !== modalData.id : true)
    );

    if (duplicate) {
      return Promise.reject('An event with this name already exists.');
    }

    // Additional validation can be added here (e.g., regex for allowed characters)

    return Promise.resolve();
  };

  // Handle form value changes to manage disabling of end fields
  const handleValuesChange = (changedValues, allValues) => {
    if ('date_start' in changedValues) {
      setIsDateStartSet(!!allValues.date_start);
      // Reset date_end if date_start is cleared
      if (!allValues.date_start) {
        form.setFieldsValue({ date_end: null });
      }
    }
    if ('time_start' in changedValues) {
      setIsTimeStartSet(!!allValues.time_start);
      // Reset time_end if time_start is cleared
      if (!allValues.time_start) {
        form.setFieldsValue({ time_end: null });
      }
    }
  };

  // Handle form submission
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const eventName = values.event_name.trim();
      const dateStart = values.date_start ? values.date_start.format('YYYY-MM-DD') : null;
      const dateEnd = values.date_end ? values.date_end.format('YYYY-MM-DD') : null;
      const timeStart = values.time_start ? values.time_start.format('HH:mm') : null;
      const timeEnd = values.time_end ? values.time_end.format('HH:mm') : null;

      // Validate that date_end is not before date_start
      if (dateEnd && moment(dateEnd).isBefore(dateStart, 'day')) {
        form.setFields([
          {
            name: 'date_end',
            errors: ['Date End cannot be before Date Start.'],
          },
        ]);
        return;
      }

      // If both time_start and time_end are provided, validate that time_end is not before time_start
      if (timeStart && timeEnd) {
        const startDateTime = moment(`${dateStart} ${timeStart}`, 'YYYY-MM-DD HH:mm');
        const endDateTime = moment(`${dateEnd || dateStart} ${timeEnd}`, 'YYYY-MM-DD HH:mm');
        if (endDateTime.isBefore(startDateTime)) {
          form.setFields([
            {
              name: 'time_end',
              errors: ['Time End cannot be before Time Start.'],
            },
          ]);
          return;
        }
      }

      const eventData = {
        event_name: eventName,
        date_start: dateStart,
        date_end: dateEnd,
        time_start: timeStart,
        time_end: timeEnd,
      };

      setSubmissionLoading(true); // Start loading

      if (isEditModalVisible) {
        // Use handleEditEvent
        await handleEditEvent(modalData.id, eventData);
      } else {
        // Use handleCreateEvent
        await handleCreateEvent(eventData);
      }

      form.resetFields(); // Reset the form after successful submission
    } catch (error) {
      if (error.name !== 'ValidationError') { // Ignore validation errors as they are handled above
        console.error('Error submitting form:', error);
        message.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmissionLoading(false); // Stop loading
    }
  };

  // Handle modal cancellation
  const handleCancel = () => {
    form.resetFields(); 
    setIsCreateModalVisible(false); 
    setIsEditModalVisible(false); 
    setIsDateStartSet(false);
    setIsTimeStartSet(false);
  };

  return (
    <Modal
      title={isEditModalVisible ? 'Edit Event' : 'Create New Event'}
      visible={isCreateModalVisible || isEditModalVisible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEditModalVisible ? 'Save Changes' : 'Create Event'}
      cancelText="Cancel"
      destroyOnClose 
      confirmLoading={submissionLoading} // Show loading indicator on submit
    >
      <Form 
        form={form} 
        layout="vertical" 
        name="postEventForm" 
        onValuesChange={handleValuesChange} // Attach the values change handler
      >
        {/* Event Name */}
        <Form.Item
          label="Event Name"
          name="event_name"
          rules={[
            { required: true, message: 'Please enter an event name!' },
            { min: 2, message: 'Event name must be at least 2 characters.' },
            { max: 100, message: 'Event name cannot exceed 100 characters.' },
            { validator: validateEventName }, // Custom validator for duplicates
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
            disabledDate={(current) => current && current < moment().startOf('day')} // Optional: Disable past dates
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
            disabled={!isDateStartSet} // Disable if Date Start is not set
            disabledDate={(current) => {
              const dateStart = form.getFieldValue('date_start');
              if (!dateStart) {
                return false;
              }
              return current && current < moment(dateStart).startOf('day');
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
          rules={[
            // Time End is optional, but if provided, it must not be before Time Start
            ({ getFieldValue }) => ({
              validator(_, value) {
                const timeStart = getFieldValue('time_start');
                const dateStart = getFieldValue('date_start');
                const dateEnd = getFieldValue('date_end') || dateStart;
                if (value && timeStart && dateStart) {
                  const startDateTime = moment(`${dateStart.format('YYYY-MM-DD')} ${timeStart.format('HH:mm')}`, 'YYYY-MM-DD HH:mm');
                  const endDateTime = moment(`${dateEnd.format('YYYY-MM-DD')} ${value.format('HH:mm')}`, 'YYYY-MM-DD HH:mm');
                  if (endDateTime.isBefore(startDateTime)) {
                    return Promise.reject(new Error('Time End cannot be before Time Start.'));
                  }
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <TimePicker
            style={{ width: '100%' }}
            format="hh:mm A"
            aria-label="Time End"
            use12Hours
            allowClear
            disabled={!isTimeStartSet} // Disable if Time Start is not set
          />
        </Form.Item>
      </Form>
      {/* Optional: Display form-level error messages */}
      {/* {form.getFieldsError().some(field => field.errors.length > 0) && (
        <Text type="danger">Please fix the errors above before submitting.</Text>
      )} */}
    </Modal>
  );
};

export default PostEventModal;
