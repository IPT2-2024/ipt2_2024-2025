import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, message, Select, Row, Col } from 'antd';
import axios from 'axios';

const { Option } = Select;

const StudentEnlistmentModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    data,
    setData,
    enlistedProfiles,
    reloadData,
}) => {
    const [form] = Form.useForm();
    const [profiles, setProfiles] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sectionsAndSchedules, setSectionsAndSchedules] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
    const [activeAcademicYear, setActiveAcademicYear] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);

    const fetchProfiles = async () => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get('/api/enlistments-data', {
                params: { type: 'profiles' },
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const filteredProfiles = response.data.filter(
                (profile) => !enlistedProfiles.includes(profile.id) // Exclude enlisted profiles
            );
            setProfiles(filteredProfiles);
        } catch (error) {
            message.error('Failed to fetch profiles');
        } finally {
            setIsLoadingProfiles(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get('/api/enlistments-data', {
                params: { type: 'subjects' },
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setSubjects(response.data);
        } catch (error) {
            message.error('Failed to fetch subjects');
        }
    };

    const fetchSectionsAndSchedules = async (subjectId) => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get('/api/enlistments-data', {
                params: { type: 'sections_and_schedules', subject_id: subjectId },
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setSectionsAndSchedules(response.data);
        } catch (error) {
            message.error('Failed to fetch sections and schedules');
        }
    };

    const fetchActiveAcademicYearAndSemester = async () => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get('/api/enlistments/active/academic-year-semester', {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const { academic_year_id, academic_year, semester_id, semester } = response.data;

            setActiveAcademicYear({ id: academic_year_id, name: academic_year });
            setActiveSemester({ id: semester_id, name: semester });

            form.setFieldsValue({
                academicyear_id: `${academic_year}`,
                semester_id: semester,
            });
        } catch (error) {
            message.error('Failed to fetch active academic year and semester.');
        }
    };

    const handleAddSubject = () => {
        form.validateFields().then((values) => {
            const selectedSubject = subjects.find((subject) => subject.id === values.subject_id);
            console.log('Selected Subject:', selectedSubject); // Debugging log
            const selectedSectionAndSchedule = sectionsAndSchedules.find(
                (section) => section.id === values.section_and_schedule_id
            );
    
            // Check for duplicate subject
            const isDuplicateSubject = selectedSubjects.some(
                (subject) => subject.subject_id === values.subject_id
            );
            if (isDuplicateSubject) {
                message.error('This subject has already been added.');
                return;
            }
    
            // Check for schedule conflict
            const isScheduleConflict = selectedSubjects.some((subject) => {
                return (
                    subject.day_of_week === selectedSectionAndSchedule.day_of_week &&
                    ((subject.start_time <= selectedSectionAndSchedule.start_time &&
                        selectedSectionAndSchedule.start_time < subject.end_time) || // Overlaps at the start
                        (subject.start_time < selectedSectionAndSchedule.end_time &&
                            selectedSectionAndSchedule.end_time <= subject.end_time)) // Overlaps at the end
                );
            });
    
            if (isScheduleConflict) {
                message.error('Schedule conflict detected. Please choose a different schedule.');
                return;
            }
    
            // Add the subject to the list
            const newEnlistment = {
                subject_id: values.subject_id,
                section_id: values.section_and_schedule_id,
                formatted_subject: selectedSubject.formatted_subject,
                section_name: selectedSectionAndSchedule.section,
                day_of_week: selectedSectionAndSchedule.day_of_week,
                start_time: selectedSectionAndSchedule.start_time,
                end_time: selectedSectionAndSchedule.end_time,
                schedule: `${selectedSectionAndSchedule.day_of_week} | ${selectedSectionAndSchedule.start_time} - ${selectedSectionAndSchedule.end_time}`,
            };
    
            setSelectedSubjects((prev) => [...prev, newEnlistment]);
            form.resetFields(['subject_id', 'section_and_schedule_id']); // Clear specific fields
        });
    };
    

    const handleCreateEnlistments = async () => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const requestPayload = selectedSubjects.map((subject) => ({
                profile_id: form.getFieldValue('profile_id'),
                subject_id: subject.subject_id,
                section_and_schedule_id: subject.section_id,
                academicyear_id: activeAcademicYear?.id,
                semester_id: activeSemester?.id,
                status: form.getFieldValue('status'),
            }));

            const response = await axios.post('/api/enlistments/multiple/data', requestPayload, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            setData((prev) => [...prev, ...response.data.enlistments]);
            setSelectedSubjects([]);
            form.resetFields();
            setIsCreateModalVisible(false);
            reloadData();
            message.success('Enlistments created successfully');
        } catch (error) {
            message.error('Failed to create enlistments. Please try again.');
        }
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
        setSelectedSubjects([]);
    };

    useEffect(() => {
        if (isCreateModalVisible) {
            fetchProfiles();
            fetchSubjects();
            fetchActiveAcademicYearAndSemester();
        }
    }, [isCreateModalVisible]);

    return (
        <Modal
            title="Create New Student Enlistment"
            visible={isCreateModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateEnlistments}>
                    Create Enlistments
                </Button>,
            ]}
            width={800}
        >
            <Form form={form} layout="vertical" name="studentEnlistmentForm">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            label="Academic Year"
                            name="academicyear_id"
                            rules={[{ required: true, message: 'Academic year is required.' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Semester"
                            name="semester_id"
                            rules={[{ required: true, message: 'Semester is required.' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Status is required.' }]}
                        >
                            <Select placeholder="Select a status">
                                <Option value="active">Active</Option>
                                <Option value="archived">Archived</Option>
                                <Option value="regular">Regular</Option>
                                <Option value="irregular">Irregular</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label="Profile"
                            name="profile_id"
                            rules={[{ required: true, message: 'Please select a profile!' }]}
                        >
                            <Select
                                placeholder="Search or select a profile"
                                showSearch
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {profiles.map((profile) => (
                                    <Option key={profile.id} value={profile.id}>
                                        {`${profile.formatted_profile_id} - ${profile.full_name}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label="Subject"
                            name="subject_id"
                            rules={[{ required: true, message: 'Please select a subject!' }]}
                        >
                            <Select
                                placeholder="Search or select a subject"
                                showSearch
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => fetchSectionsAndSchedules(value)}
                            >
                                {subjects.map((subject) => (
                                    <Option key={subject.id} value={subject.id}>
                                        {subject.formatted_subject}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label="Section and Schedule"
                            name="section_and_schedule_id"
                            rules={[{ required: true, message: 'Please select a section and schedule!' }]}
                        >
                            <Select placeholder="Select a section and schedule">
                                {sectionsAndSchedules.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {`${item.section} - ${item.day_of_week} | ${item.start_time} - ${item.end_time}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Button type="dashed" onClick={handleAddSubject} block>
                            Add Subject to Enlistment
                        </Button>
                    </Col>
                </Row>
            </Form>

            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {selectedSubjects.map((subject, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '10px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '5px',
                            backgroundColor: '#fafafa',
                            flex: '1 0 45%',
                        }}
                    >
                        <strong>{subject.formatted_subject}</strong> <br />
                        {subject.section_name} - {subject.schedule}
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default StudentEnlistmentModal;
