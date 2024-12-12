// BuildingModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { message } from 'antd';
import axios from 'axios'; // Ensure axios is imported

const BuildingModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data, // Combined active and archived data for duplicate checks
    setData,
    modalData,
    setModalData,
    handleCreateBuilding, 
    handleEditBuilding,
    reloadData,
}) => {
    const [form] = useForm(); 
    const [floors, setFloors] = useState([]); 
    const [loadingFloors, setLoadingFloors] = useState(false); 

    useEffect(() => {
        // const fetchFloors = async () => {
        //     setLoadingFloors(true);
        //     try {
        //         const token = localStorage.getItem('auth_token');
        //         const response = await axios.get('/api/floor', {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //         });
        //         setFloors(response.data); 
        //     } catch (error) {
        //         message.error('Failed to load floors');
        //     } finally {
        //         setLoadingFloors(false);
        //     }
        // };

        // if (isCreateModalVisible || isEditModalVisible) {
        //     fetchFloors();
        // }

        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                building_name: modalData.building_name, 
                // floor_id: modalData.floor_id, 
            });
        }
    }, [isCreateModalVisible, isEditModalVisible, modalData, form]);

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            // Set form values when editing
            form.setFieldsValue({
                building_name: modalData.building_name, 
                // floor_id: modalData.floor_id, 
            });
        } else {
            // Reset form when creating
            form.resetFields();
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = async () => {
        form.validateFields().then(async (values) => {
            if (isEditModalVisible) {
                // **Use handleEditBuilding**
                await handleEditBuilding(modalData.id, values);
            } else {
                // **Use handleCreateBuilding**
                await handleCreateBuilding(values);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        form.resetFields(); // Reset the form fields
        setIsCreateModalVisible(false); 
        setIsEditModalVisible(false); 
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Building' : 'Create Building'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Update' : 'Create'}
        >
            <Form form={form} layout="vertical" name="building_form">
                <Form.Item
                    label="Building Name"
                    name="building_name"
                    rules={[
                        { required: true, message: 'Please enter the building name' },
                        {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                const existingNames = data.map(building => building.building_name.toLowerCase());
                                if (isEditModalVisible && modalData) {
                                    // Exclude the current building's name when editing
                                    const filteredNames = existingNames.filter(name => name !== modalData.building_name.toLowerCase());
                                    if (filteredNames.includes(value.trim().toLowerCase())) {
                                        return Promise.reject(new Error('A building with this name already exists.'));
                                    }
                                } else {
                                    if (existingNames.includes(value.trim().toLowerCase())) {
                                        return Promise.reject(new Error('A building with this name already exists.'));
                                    }
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    label="Floor Level"
                    name="floor_id"
                    rules={[{ required: true, message: 'Please select a floor' }]}
                >
                    <Select loading={loadingFloors} placeholder="Select floor">
                        {floors.map((floor) => (
                            <Select.Option key={floor.id} value={floor.id}>
                                {floor.floor_level}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item> */}
            </Form>
        </Modal>
    );
};

export default BuildingModal;
