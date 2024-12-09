import React, { useEffect } from 'react';
import { Modal, Form, Select, Button, Row, Col, notification } from 'antd';
import { timeSlots, daysOfWeek, classroomOptions } from './constants';

const EditScheduleModal = ({ isModalOpen, setIsModalOpen, handleEditSchedule, handleDeleteSchedule, form, editingSchedule }) => {
    useEffect(() => {
        if (isModalOpen && editingSchedule) {
            form.setFieldsValue(editingSchedule);
        }
    }, [isModalOpen, editingSchedule, form]);

    return (
        <Modal
            title="Edit Schedule"
            visible={isModalOpen}
            onCancel={() => {
                setIsModalOpen(false);
                form.resetFields();
            }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => handleEditSchedule({ ...editingSchedule, ...values }))
                    .catch((errorInfo) => console.error('Validation Failed:', errorInfo));
            }}
            okText="Save Changes"
            width={600}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="day" label="Day of the Week" rules={[{ required: true, message: 'Please select a day' }]}>
                            <Select placeholder="Select Day">
                                {daysOfWeek.map((day) => (
                                    <Select.Option key={day} value={day}>
                                        {day}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="classroom_id" label="Classroom ID" rules={[{ required: true, message: 'Please select a classroom' }]}>
                            <Select placeholder="Select Classroom">
                                {classroomOptions.map((classroom) => (
                                    <Select.Option key={classroom} value={classroom}>
                                        {classroom}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="time_start" label="Start Time" rules={[{ required: true, message: 'Please select start time' }]}>
                            <Select placeholder="Select Start Time">
                                {timeSlots.map((time) => (
                                    <Select.Option key={time.format('HH:mm')} value={time.format('HH:mm')}>
                                        {time.format('h:mm A')}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="time_end" label="End Time" rules={[{ required: true, message: 'Please select end time' }]}>
                            <Select placeholder="Select End Time">
                                {timeSlots.map((time) => (
                                    <Select.Option key={time.format('HH:mm')} value={time.format('HH:mm')}>
                                        {time.format('h:mm A')}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="danger" onClick={handleDeleteSchedule} block style={{ marginTop: 10 }}>
                    Delete Schedule
                </Button>
            </Form>
        </Modal>
    );
};

export default EditScheduleModal;
