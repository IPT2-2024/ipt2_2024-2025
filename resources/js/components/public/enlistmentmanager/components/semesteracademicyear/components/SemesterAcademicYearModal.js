// SemesterAcademicYearModal.js
import React, { useEffect } from 'react';
import { Modal, Input, Button, Form, message, Select, Spin } from 'antd';
import PropTypes from 'prop-types'; // For prop type checking
import axios from 'axios';

const SemesterAcademicYearModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data, // Combined active and archived data
    setData,
    modalData,
    setModalData,
    academicYears,
    semesters,
    reloadData,
    loading, // Loading state from parent
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Pre-fill the form with data when editing
            form.setFieldsValue({
                academic_year: modalData.academic_year, // Assuming this is the ID
                semester_id: modalData.semester_id,     // Assuming this is the ID
            });
        } else {
            form.resetFields();
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const { academic_year, semester_id } = values;

            // **Duplicate Check Logic**
            const isDuplicate = isEditModalVisible
                ? data.some(entry =>
                    entry.academic_year === academic_year &&
                    entry.semester_id === semester_id &&
                    entry.id !== modalData.id // Exclude current entry in edit mode
                  )
                : data.some(entry =>
                    entry.academic_year === academic_year &&
                    entry.semester_id === semester_id
                  );

            if (isDuplicate) {
                message.error('A Semester Academic Year with this combination already exists.');
                return; // Prevent further execution
            }

            // **Prepare the Entry for API Submission**
            const entryPayload = {
                semester_id,
                academicyear_id: academic_year, // Use the academic_year ID here
                status: false, // Or set based on your requirements
            };

            // **Get the Auth Token from localStorage**
            const authToken = localStorage.getItem('auth_token'); // Replace with your actual token key

            if (!authToken) {
                message.error('Authentication token is missing');
                return;
            }

            try {
                if (isEditModalVisible) {
                    // **Edit Existing Entry**
                    await axios.put(`/api/semesteracademicyear/${modalData.id}`, entryPayload, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });
                    message.success('Semester Academic Year updated successfully');
                } else {
                    // **Create New Entry**
                    await axios.post('/api/semesteracademicyear', entryPayload, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });
                    message.success('Semester Academic Year created successfully');
                }

                // **Reload Data to Reflect Changes**
                reloadData();

                // **Close the Modal and Reset Form**
                setIsCreateModalVisible(false);
                setIsEditModalVisible(false);
                form.resetFields();
            } catch (error) {
                console.error('Error submitting Semester Academic Year:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    message.error(`Error: ${error.response.data.message}`);
                } else {
                    message.error('An unexpected error occurred while submitting the form.');
                }
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        setModalData(null);
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
            footer={[
                <Button key="back" onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
                    {isEditModalVisible ? 'Save Changes' : 'Create Entry'}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" name="semesterAcademicYearForm">
                <Form.Item
                    label="Academic Year"
                    name="academic_year"
                    rules={[{ required: true, message: 'Please select the academic year!' }]}
                >
                    <Select placeholder="Select Academic Year">
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
                    <Select placeholder="Select Semester">
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

// **Prop Type Validation**
SemesterAcademicYearModal.propTypes = {
    isCreateModalVisible: PropTypes.bool.isRequired,
    setIsCreateModalVisible: PropTypes.func.isRequired,
    isEditModalVisible: PropTypes.bool.isRequired,
    setIsEditModalVisible: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired, // Combined active and archived data
    setData: PropTypes.func.isRequired,
    modalData: PropTypes.object, // Can be null
    setModalData: PropTypes.func.isRequired,
    academicYears: PropTypes.array.isRequired, // Array of academic year objects
    semesters: PropTypes.array.isRequired, // Array of semester objects
    reloadData: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired, // Loading state
};

export default SemesterAcademicYearModal;
