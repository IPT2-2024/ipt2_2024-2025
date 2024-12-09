// BuildingModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { message } from 'antd';

const BuildingModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
    handleCreateBuilding, 
    reloadData,
}) => {
    const [form] = useForm(); 
    const [floors, setFloors] = useState([]); 
    const [loadingFloors, setLoadingFloors] = useState(false); 

    useEffect(() => {
        
        const fetchFloors = async () => {
            try {
                const response = await axios.get('/api/floor', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                setFloors(response.data); 
            } catch (error) {
                message.error('Failed to load floors');
            }
        };

        if (isCreateModalVisible || isEditModalVisible) {
            fetchFloors();
        }

        if (isEditModalVisible && modalData) {
            form.setFieldsValue({
                building_name: modalData.building_name, 
                floor_id: modalData.floor_id, 
            });
        }
    }, [isCreateModalVisible, isEditModalVisible, modalData, form]);

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            
            form.setFieldsValue({
                building_name: modalData.building_name, 
                floor_id: modalData.floor_id, 
            });
        } else {
            
            form.resetFields();
        }
    }, [isEditModalVisible, modalData, form]);

    const handleOk = async () => {
        form.validateFields().then(async (values) => {
            if (isEditModalVisible) {
                
                try {
                    const token = localStorage.getItem('auth_token');
                    const response = await axios.put(`/api/building/${modalData.id}`, values, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const updatedData = data.map((building) =>
                        building.id === modalData.id ? { ...building, ...response.data.building } : building
                    );
                    setData(updatedData);
                    setIsEditModalVisible(false);
                    message.success('Building updated successfully');
                    reloadData();
                } catch (error) {
                    message.error('Failed to update building');
                }
            } else {
                
                try {
                    const token = localStorage.getItem('auth_token');
                    const response = await axios.post('/api/building', values, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setData((prevData) => [...prevData, response.data.building]);
                    setIsCreateModalVisible(false);
                    message.success('Building created successfully');
                    reloadData();
                } catch (error) {
                    message.error('Failed to create building');
                }
            }
        });
    };
    

    const handleCancel = () => {
        setIsCreateModalVisible(false); 
        setIsEditModalVisible(false); 
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Building' : 'Create Building'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={() => {
                setIsCreateModalVisible(false);
                setIsEditModalVisible(false);
            }}
            onOk={handleOk}
            okText={isEditModalVisible ? 'Update' : 'Create'}
        >
            <Form form={form} layout="vertical" name="building_form">
                <Form.Item
                    label="Building Name"
                    name="building_name"
                    rules={[{ required: true, message: 'Please enter the building name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
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
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BuildingModal;
