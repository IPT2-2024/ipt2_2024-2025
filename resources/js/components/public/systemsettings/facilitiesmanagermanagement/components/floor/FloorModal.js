import React, { useState } from 'react';
import { Modal, Input, Form, Button } from 'antd';

const FloorModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    handleCreateFloor,
    modalData,
}) => {
    const [floorLevel, setFloorLevel] = useState(modalData ? modalData.floor_level : '');

    const handleSave = () => {
        const floorData = {
            floor_level: floorLevel,
        };
        handleCreateFloor(floorData); // Handle the floor creation
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
    };

    return (
        <Modal
            title={isEditModalVisible ? 'Edit Floor' : 'Create New Floor'}
            visible={isCreateModalVisible || isEditModalVisible}
            onCancel={() => {
                setIsCreateModalVisible(false);
                setIsEditModalVisible(false);
            }}
            footer={[
                <Button key="cancel" onClick={() => {
                    setIsCreateModalVisible(false);
                    setIsEditModalVisible(false);
                }}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save
                </Button>,
            ]}
        >
            <Form>
                <Form.Item label="Floor Level" required>
                    <Input
                        value={floorLevel}
                        onChange={(e) => setFloorLevel(e.target.value)}
                        placeholder="Enter Floor Level"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FloorModal;
