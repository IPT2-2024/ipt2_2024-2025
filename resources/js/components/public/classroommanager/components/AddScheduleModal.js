import React, { useEffect } from 'react';
import { Modal, Form, Select, Button, Row, Col } from 'antd';
import { timeSlots, daysOfWeek, classroomOptions } from './constants';

const AddScheduleModal = ({ isModalOpen, setIsModalOpen, handleCreateSchedules, form }) => {
    useEffect(() => {
        if (isModalOpen) {
            form.resetFields();
        }
    }, [isModalOpen, form]);

    return (
        <Modal
            title="Add Multiple Schedules"
            visible={isModalOpen}
            onCancel={() => {
                setIsModalOpen(false);
                form.resetFields();
            }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => handleCreateSchedules(values))
                    .catch((info) => console.log('Validation Failed:', info));
            }}
            okText="Save All Schedules"
            width="80%" // Responsive width
            bodyStyle={{
                padding: '16px',
                maxHeight: '70vh',
                overflowY: 'auto', // Add scrolling for smaller devices
            }}
        >
            <Form form={form} layout="vertical">
                <Form.List
                    name="schedules"
                    initialValue={[{ day: '', classroom_id: '', time_start: '', time_end: '' }]}
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <div
                                    key={key}
                                    style={{
                                        marginBottom: 16,
                                        padding: '10px 15px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: 4,
                                        backgroundColor: '#fafafa',
                                    }}
                                >
                                    <Row
                                        gutter={[16, 16]} // Add spacing between fields
                                        style={{
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <Col xs={24} sm={12} md={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'day']}
                                                fieldKey={[fieldKey, 'day']}
                                                label="Day of the Week"
                                                rules={[{ required: true, message: 'Please select a day' }]}
                                            >
                                                <Select placeholder="Select Day">
                                                    {daysOfWeek.map((day) => (
                                                        <Select.Option key={day} value={day}>
                                                            {day}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'classroom_id']}
                                                fieldKey={[fieldKey, 'classroom_id']}
                                                label="Classroom ID"
                                                rules={[{ required: true, message: 'Please select a classroom' }]}
                                            >
                                                <Select placeholder="Select Classroom">
                                                    {classroomOptions.map((classroom) => (
                                                        <Select.Option key={classroom} value={classroom}>
                                                            {classroom}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'time_start']}
                                                fieldKey={[fieldKey, 'time_start']}
                                                label="Start Time"
                                                rules={[{ required: true, message: 'Please select start time' }]}
                                            >
                                                <Select placeholder="Select Start Time">
                                                    {timeSlots.map((time) => (
                                                        <Select.Option
                                                            key={time.format('HH:mm')}
                                                            value={time.format('HH:mm')}
                                                        >
                                                            {time.format('h:mm A')}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'time_end']}
                                                fieldKey={[fieldKey, 'time_end']}
                                                label="End Time"
                                                rules={[{ required: true, message: 'Please select end time' }]}
                                            >
                                                <Select placeholder="Select End Time">
                                                    {timeSlots.map((time) => (
                                                        <Select.Option
                                                            key={time.format('HH:mm')}
                                                            value={time.format('HH:mm')}
                                                        >
                                                            {time.format('h:mm A')}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Button
                                        type="danger"
                                        onClick={() => remove(name)}
                                        block
                                        style={{ marginTop: 10 }}
                                    >
                                        Remove Schedule
                                    </Button>
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block>
                                    Add Another Schedule
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default AddScheduleModal;
