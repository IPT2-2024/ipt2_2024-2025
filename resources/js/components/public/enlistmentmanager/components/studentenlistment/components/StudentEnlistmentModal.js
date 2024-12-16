import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, message, Select, Row, Col } from 'antd';
import axios from 'axios';

const { Option } = Select;


const StudentEnlistmentModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
    enlistedProfiles,
    reloadData,
}) => {
    const [form] = Form.useForm();
    const [profiles, setProfiles] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sectionsAndSchedules, setSectionsAndSchedules] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [activeAcademicYear, setActiveAcademicYear] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);
    const [selectedProfileStatus, setSelectedProfileStatus] = useState('');
    const [enlistedSubjects, setEnlistedSubjects] = useState([]);



    useEffect(() => {
        if (isEditModalVisible && modalData) {
            const rawProfileId = modalData.raw_profile_id;
    
            // Pre-fill the form with modal data
            form.setFieldsValue({
                profile_id: rawProfileId,
                status: modalData.status,
                academicyear_id: modalData.academic_year,
                semester_id: modalData.semester,
            });
    
            // Fetch enlisted subjects using raw profile ID
            fetchEnlistedSubjects(rawProfileId);
        }
    }, [isEditModalVisible, modalData, form]);
    

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

    const handleProfileChange = (profileId) => {
        const selectedProfile = profiles.find((profile) => profile.id === profileId);
        if (selectedProfile) {
            form.setFieldsValue({ status: selectedProfile.status });
        } else {
            form.setFieldsValue({ status: null });
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
            console.log('Fetched subjects:', response.data); // Debugging log
        } catch (error) {
            message.error('Failed to fetch subjects');
        }
    };
    
    const fetchEnlistedSubjects = async (profileId) => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/enlistments/${profileId}/subjects`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
    
            setEnlistedSubjects(response.data);
        } catch (error) {
            console.error('Error fetching enlisted subjects:', error);
            message.error('Failed to fetch enlisted subjects.');
        }
    };
    
    console.log('modalData:', modalData);
    console.log('rawProfileId:', modalData?.raw_profile_id || modalData?.profile_id);

    

    const fetchSectionsAndSchedules = async (subjectId) => {
        try {
            const authToken = localStorage.getItem('auth_token'); // Retrieve the token
            const response = await axios.get('/api/enlistments-data', {
                params: { type: 'sections_and_schedules', subject_id: subjectId },
                headers: { Authorization: `Bearer ${authToken}` }, // Add Authorization header
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
    
            // Update states for rendering
            setActiveAcademicYear({ id: academic_year_id, name: academic_year });
            setActiveSemester({ id: semester_id, name: semester });
    
            // Populate the form fields with the fetched data
            form.setFieldsValue({
                academicyear_id: `${academic_year}`, // Show name and ID
                semester_id: semester, // Show semester name directly
            });
        } catch (error) {
            console.error('Error fetching active academic year and semester:', error);
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
    
            // Prepare the payload for the POST request
            const requestPayload = selectedSubjects.map((subject) => ({
                profile_id: form.getFieldValue('profile_id'), // Profile ID from form
                subject_id: subject.subject_id, // Subject ID from selected subjects
                section_and_schedule_id: subject.section_id, // Section and Schedule ID
                academicyear_id: activeAcademicYear?.id, // Active Academic Year ID
                semester_id: activeSemester?.id, // Active Semester ID
                status: form.getFieldValue('status'),
            }));
            
            console.log('Payload:', requestPayload);
            // Make the POST request
            const response = await axios.post('/api/enlistments/multiple/data', requestPayload, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
    
            // Update the parent component's data state
            setData((prev) => [...prev, ...response.data.enlistments]);
    
            // Clear the modal state
            setSelectedSubjects([]); // Clear selected subjects
            form.resetFields(); // Reset the form
            setIsCreateModalVisible(false); // Close the modal
            
            reloadData();
            message.success('Enlistments created successfully');
        } catch (error) {
            console.error('Error creating enlistments:', error.response?.data || error.message);
            message.error('Failed to create enlistments. Please try again.');
        }
    };
    

    useEffect(() => {
        if (isCreateModalVisible) {
            fetchProfiles();
            fetchSubjects();
            fetchActiveAcademicYearAndSemester(); // Fetch active academic year and semester
        }
    }, [isCreateModalVisible]);
    
    const handleUpdateEnlistment = async () => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const updatedData = form.getFieldsValue();
    
            // Validate the form
            await form.validateFields();
    
            const response = await axios.put(`/api/enlistments/${modalData.id}`, updatedData, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
    
            // Success response
            message.success('Enlistment updated successfully.');
            reloadData(); // Reload the table
            setIsEditModalVisible(false); // Close the modal
        } catch (error) {
            if (error.response?.data?.message) {
                message.error(`Update failed: ${error.response.data.message}`);
            } else {
                message.error('An unexpected error occurred.');
            }
        }
    };
    
    

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); // Clear the form when the modal is canceled
        setSelectedSubjects([]);
        setSelectedProfileStatus(''); // Reset profile status
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Student Enlistment' : 'Create New Student Enlistment'}
            visible={isEditModalVisible || isCreateModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={isEditModalVisible ? handleUpdateEnlistment : handleCreateEnlistments}
                >
                    {isEditModalVisible ? 'Save Changes' : 'Create Enlistments'}
                </Button>,
            ]}
            width={800} // Increase width to accommodate horizontal layout
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Form form={form} layout="vertical" name="studentEnlistmentForm">
                    {/* Use Rows and Columns */}
                    <Row gutter={24}>
                        {/* Academic Year */}
                        <Col span={8}>
                            <Form.Item
                                label="Academic Year"
                                name="academicyear_id"
                                rules={[{ required: true, message: 'Academic year is required.' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        {/* Semester */}
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
                        {/* Profile Dropdown */}
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
                                    {profiles
                                        .filter((profile) => !enlistedProfiles.includes(profile.id)) // Exclude enlisted profiles
                                        .map((profile) => (
                                            <Option key={profile.id} value={profile.id}>
                                                {`${profile.formatted_profile_id} - ${profile.full_name}`}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
    
                        
                    </Row>
    
                    <Row gutter={24}>
                        {/* Subject Dropdown */}
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
                                    onChange={(value) => fetchSectionsAndSchedules(value)} // Fetch sections when a subject is selected
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
                        {/* Section and Schedule Dropdown */}
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
    
                    {/* Add Subject Button */}
                    <Row>
                        <Col span={24}>
                            <Button type="dashed" onClick={handleAddSubject} block>
                                Add Subject to Enlistment
                            </Button>
                        </Col>
                    </Row>
                </Form>
    
                {/* Display Selected Subjects */}
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {/* Previously Enlisted Subjects */}
                    {isEditModalVisible &&
                        enlistedSubjects.map((subject, index) => (
                            <div
                                key={`enlisted-${index}`}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '5px',
                                    backgroundColor: '#f0f5ff',
                                    flex: '1 0 45%',
                                }}
                            >
                                <strong>{subject.formatted_subject}</strong> <br />
                                {subject.section_name} - {subject.schedule}
                            </div>
                        ))}
                    
                    {/* Newly Added Subjects */}
                    {selectedSubjects.map((subject, index) => (
                        <div
                            key={`new-${index}`}
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

            </div>
        </Modal>
    );
    
    

};

export default StudentEnlistmentModal;
