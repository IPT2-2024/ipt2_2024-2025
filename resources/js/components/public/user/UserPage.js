import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Dropdown, Menu, Typography, message, Modal } from "antd";
import { FilterOutlined, FileTextOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import UserTable from './components/UserTable';
import UserModals from './components/UserModals';
import MainDashboard from '../dashboard/components/MainDashboard';
import { userData } from './components/UserData'; // Importing initial user data

const { Text } = Typography;

const UserPage = () => {
    const [data, setData] = useState(userData);
    const [filteredData, setFilteredData] = useState(userData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [showArchived, setShowArchived] = useState(false);  // Flag to toggle between active and archived users
    const [modalData, setModalData] = useState(null);

    // State for the confirmation delete modal
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

    // Effect to filter data based on search and archived flag
    useEffect(() => {
        let filtered = data.filter((user) =>
            user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.role.toLowerCase().includes(searchValue.toLowerCase())
        );

        // Show archived or active users based on the toggle
        if (showArchived) {
            filtered = filtered.filter(user => user.archived);
        } else {
            filtered = filtered.filter(user => !user.archived);
        }

        setFilteredData(filtered);
    }, [searchValue, showArchived, data]); // Dependencies

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleRoleFilter = (role) => {
        const filtered = data.filter((record) => record.role === role);
        setFilteredData(filtered.length ? filtered : data);
    };

    const handleReset = () => {
        setFilteredData(data);
        setSearchValue('');  // Reset search filter
    };

    const handleArchiveToggle = () => {
        setShowArchived(!showArchived); // Toggle between active and archived users
    };

    const handleDelete = () => {
        // Open the confirmation modal when delete is clicked
        setConfirmDeleteModalVisible(true);
    };

    const confirmDeleteUser = () => {
        // Mark selected users as archived
        const newData = data.map((user) =>
            selectedRowKeys.includes(user.id) ? { ...user, archived: true } : user
        );
        setData(newData);
        message.success(`${selectedRowKeys.length} user(s) moved to archives`);
        setConfirmDeleteModalVisible(false);  // Close the modal after confirming
        setSelectedRowKeys([]); // Reset selected rows after deletion
    };

    const handleRestore = (userId) => {
        setData((prevData) =>
            prevData.map((user) =>
                user.id === userId ? { ...user, archived: false } : user
            )
        );
        message.success('User restored');
    };

    const handleRestoreSelected = () => {
        // Restore selected users only
        const newData = data.map((user) =>
            selectedRowKeys.includes(user.id) ? { ...user, archived: false } : user
        );
        setData(newData);
        message.success(`${selectedRowKeys.length} user(s) restored`);
        setSelectedRowKeys([]); // Reset selected rows after restoration
    };

    const roleMenu = (
        <Menu>
            <Menu.Item onClick={() => handleRoleFilter('Superadmin')}>Superadmin</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Admin')}>Admin</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Teacher')}>Teacher</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Student')}>Student</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={handleReset}>Reset</Menu.Item>
        </Menu>
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
        getCheckboxProps: (record) => ({
            // Allow selection of archived users as well
            disabled: false,  // Remove the condition that disables archived users
        }),
    };

    return (
        <MainDashboard>
            <div style={{ padding: '20px', background: '#fff' }}>
                <h1>User Management</h1>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Space wrap>
                        <Input.Search
                            value={searchValue}
                            placeholder="Search by username or role"
                            style={{ width: '300px' }}
                            onSearch={handleSearch}
                            onChange={(e) => setSearchValue(e.target.value)}
                            allowClear
                        />
                        <Dropdown overlay={roleMenu} trigger={['click']}>
                            <Button icon={<FilterOutlined />}>Filter by Role</Button>
                        </Dropdown>
                        <Button icon={<FileTextOutlined />} onClick={handleArchiveToggle}>
                            {showArchived ? 'View Active Users' : 'View Archived Users'}
                        </Button>
                        <Button icon={<PrinterOutlined />}>Print</Button>
                    </Space>
                    <Space wrap>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>Create New</Button>
                        <Button
                            disabled={selectedRowKeys.length === 0}
                            onClick={handleDelete}
                        >
                            Remove
                        </Button>
                        {showArchived && (
                            <Button
                                type="default"
                                onClick={handleRestoreSelected}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Restore Selected
                            </Button>
                        )}
                    </Space>
                </div>
                {selectedRowKeys.length > 0 && (
                    <Text strong style={{ marginBottom: '1px', display: 'block' }}>
                        {selectedRowKeys.length} item(s) selected
                    </Text>
                )}
                <UserTable
                    rowSelection={rowSelection}
                    data={filteredData}
                    setIsEditModalVisible={setIsEditModalVisible}
                    setIsDeleteModalVisible={setIsDeleteModalVisible}
                    setModalData={setModalData}
                    handleDelete={handleDelete} // Use the updated delete handler
                    handleRestore={handleRestore}
                />
                <UserModals
                    isEditModalVisible={isEditModalVisible}
                    setIsEditModalVisible={setIsEditModalVisible}
                    isDeleteModalVisible={isDeleteModalVisible}
                    setIsDeleteModalVisible={setIsDeleteModalVisible}
                    isCreateModalVisible={isCreateModalVisible}
                    setIsCreateModalVisible={setIsCreateModalVisible}
                    data={data}
                    setData={setData}
                    modalData={modalData}
                    setModalData={setModalData}
                />
                {/* Confirmation Modal for Deleting */}
                <Modal
                    title="Confirm Deletion"
                    visible={confirmDeleteModalVisible}
                    onOk={confirmDeleteUser}
                    onCancel={() => setConfirmDeleteModalVisible(false)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p>Are you sure you want to move the selected users to the archived state?</p>
                </Modal>
            </div>
        </MainDashboard>
    );
};

export default UserPage;
