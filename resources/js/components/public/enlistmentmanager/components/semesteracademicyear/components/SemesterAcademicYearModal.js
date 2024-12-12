    import React, { useEffect, useState } from 'react';
    import { Modal, Input, Button, Form, message, Select } from 'antd';

    const SemesterAcademicYearModal = ({
        isCreateModalVisible,
        setIsCreateModalVisible,
        isEditModalVisible,
        setIsEditModalVisible,
        data,
        setData,
        modalData,
        setModalData,
        academicYears,
        semesters,
        reloadData,
    }) => {
        const [form] = Form.useForm();


        useEffect(() => {
            if (isEditModalVisible && modalData) {
                // Pre-fill the form with data when editing
                form.setFieldsValue({
                    academic_year: modalData.academic_year, // Updated field name
                    semester_id: modalData.semester_period,
                });
            }
        }, [isEditModalVisible, modalData, form]);

        const handleOk = () => {
            form.validateFields().then((values) => {
                const { academic_year, semester_id } = values;
            
                // Find the selected academic year object
                const selectedAcademicYear = academicYears.find((year) => year.id === academic_year);
            
                // Map academic_year ID to its name (or any descriptive field you need)
                const academicYearName = selectedAcademicYear ? selectedAcademicYear.academic_year : '';
            
                if (!academicYearName || !semester_id) {
                    message.error('Please fill in all required fields');
                    return;
                }
            
                const newEntry = {
                    semester_id,
                    academicyear_id: academic_year, // Use the academic_year ID here
                    status: false, // Or false based on your requirement, assuming status is a boolean
                };
                
                // Get the auth token from localStorage
                const authToken = localStorage.getItem('auth_token'); // Replace 'auth_token' with your actual token key in localStorage
                
                if (!authToken) {
                    message.error('Authentication token is missing');
                    return;
                }
        
                // Sending POST request with axios
                axios.post('/api/semesteracademicyear', newEntry, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Add Authorization header
                    },
                })
                .then((response) => {
                    message.success('New Semester Academic Year created successfully');
                    
                    reloadData();

                    setIsCreateModalVisible(false); // Close the create modal
                    form.resetFields(); // Reset form fields
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        message.error(`Error: ${error.response.data.message}`);
                    } else {
                        message.error('An unexpected error occurred');
                    }
                });
            });
        };
        
        
        
        
        
        

        const handleCancel = () => {
            setIsCreateModalVisible(false);
            setIsEditModalVisible(false);
            form.resetFields(); // Clear the form when the modal is canceled
        };

        return (
            <Modal
                title={isEditModalVisible ? 'Edit Semester Academic Year' : 'Create New Semester Academic Year'}
                visible={isEditModalVisible || isCreateModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditModalVisible ? 'Save Changes' : 'Create Entry'}
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical" name="semesterAcademicYearForm">
                <Form.Item
                    label="Academic Year"
                    name="academic_year"
                    rules={[{ required: true, message: 'Please enter the academic year!' }]}
                >
                    <Select>
                        {academicYears.map(academic_year => (
                            <Select.Option key={academic_year.id} value={academic_year.id}>
                                {academic_year.academic_year} {/* Adjust field based on your data */}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Semester"
                    name="semester_id"
                    rules={[{ required: true, message: 'Please select the semester!' }]}
                >
                    <Select>
                        {semesters.map(semester => (
                            <Select.Option key={semester.id} value={semester.id}>
                                {semester.semester_period} {/* Adjust field based on your data */}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                </Form>
            </Modal>
        );
    };

    export default SemesterAcademicYearModal;
