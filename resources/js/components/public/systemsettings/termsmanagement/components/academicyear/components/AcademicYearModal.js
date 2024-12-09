import React, { useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';

const AcademicYearModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateAcademicYear, 
    handleEditAcademicYear,   
    modalData,                
    existingAcademicYears,    
}) => {
    const [form] = Form.useForm();

    // Define the current academic year start
    // You can make this dynamic based on the current date if needed
    const currentStartYear = 2024;

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                academic_year: modalData.academic_year,
            });
        } else if (isCreateModalVisible) {
            form.resetFields(); 
        }
    }, [isEditModalVisible, isCreateModalVisible, modalData, form]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const academicYear = values.academic_year.trim();

                // Validate the academic year format and logic
                const academicYearRegex = /^\d{4}-\d{4}$/;
                if (!academicYearRegex.test(academicYear)) {
                    message.error('Please enter a valid academic year in the format YYYY-YYYY.');
                    return;
                }

                const [startYear, endYear] = academicYear.split('-').map((year) => parseInt(year, 10));
                if (isNaN(startYear) || isNaN(endYear)) {
                    message.error('Academic year must contain valid years.');
                    return;
                }

                if (startYear < currentStartYear) {
                    message.error(`The start year must be ${currentStartYear} or later.`);
                    return;
                }

                if (endYear !== startYear + 1) {
                    message.error('The end year must be exactly one year after the start year.');
                    return;
                }

                // Proceed with create or edit based on modal visibility
                if (isEditModalVisible) {
                    handleEditAcademicYear(modalData.id, { 
                        academic_year: academicYear,
                    });
                } else {
                    handleCreateAcademicYear({ 
                        academic_year: academicYear,
                    });
                }

                form.resetFields(); 
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); 
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Academic Year' : 'Create New Academic Year'}
            visible={isCreateModalVisible || isEditModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditModalVisible ? 'Save Changes' : 'Create Academic Year'}
            cancelText="Cancel"
            destroyOnClose 
        >
            <Form form={form} layout="vertical" name="academicYearForm">
                <Form.Item
                    label="Academic Year"
                    name="academic_year"
                    rules={[
                        { required: true, message: 'Please enter an academic year!' },
                        { pattern: /^\d{4}-\d{4}$/, message: 'Academic year must be in the format YYYY-YYYY.' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                const [startYearStr, endYearStr] = value.split('-');
                                const startYear = parseInt(startYearStr, 10);
                                const endYear = parseInt(endYearStr, 10);

                                // Check if the years are valid numbers
                                if (isNaN(startYear) || isNaN(endYear)) {
                                    return Promise.reject(new Error('Academic year must contain valid years.'));
                                }

                                // Ensure the start year is not in the past
                                if (startYear < currentStartYear) {
                                    return Promise.reject(new Error(`The start year must be ${currentStartYear} or later.`));
                                }

                                // Ensure the end year is exactly one year after the start year
                                if (endYear !== startYear + 1) {
                                    return Promise.reject(new Error('The end year must be exactly one year after the start year.'));
                                }

                                // Check for duplicates (excluding the current item if editing)
                                const duplicate = existingAcademicYears.some(year => 
                                    year.academic_year.toLowerCase() === value.toLowerCase() && year.id !== (modalData ? modalData.id : null)
                                );

                                if (duplicate) {
                                    return Promise.reject(new Error('This Academic Year already exists.'));
                                }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input 
                        placeholder="Enter academic year (e.g., 2024-2025)" 
                        maxLength={9} 
                        onChange={(e) => {
                            let inputValue = e.target.value.replace(/\D/g, ''); 

                            if (inputValue.length > 8) {
                                inputValue = inputValue.substring(0, 8); 
                            }

                            if (inputValue.length > 4) {
                                inputValue = `${inputValue.slice(0, 4)}-${inputValue.slice(4, 8)}`;
                            }

                            form.setFieldsValue({ academic_year: inputValue });
                        }}
                        inputMode="numeric" 
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AcademicYearModal;
