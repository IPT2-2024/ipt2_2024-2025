import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Dropdown, Menu, Typography } from "antd";
import { FilterOutlined, FileTextOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';  // Make sure to install axios if not already installed
import UserTable from './components/UserTable';
import UserModals from './components/UserModals';
import MainDashboard from '../dashboard/components/MainDashboard';  // Import MainDashboard

const { Text } = Typography;

const UserPageDashboard = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const [modalData, setModalData] = useState(null);

    // Fetch the data from the backend
    useEffect(() => {
        axios.get('/api/users')  // Adjust URL as per your backend
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);  // Run once on mount

    const handleSearch = (value) => {
        const filtered = data.filter((record) =>
            record.username.toLowerCase().includes(value.toLowerCase()) ||
            record.role.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered.length ? filtered : []);
    };

    const handleRoleFilter = (role) => {
        const filtered = data.filter((record) => record.role === role);
        setFilteredData(filtered.length ? filtered : data);
    };

    const roleMenu = (
        <Menu>
            <Menu.Item onClick={() => handleRoleFilter('Superadmin')}>Superadmin</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Admin')}>Admin</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Teacher')}>Teacher</Menu.Item>
            <Menu.Item onClick={() => handleRoleFilter('Student')}>Student</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={() => setFilteredData(data)}>Reset</Menu.Item>
        </Menu>
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <MainDashboard>  {/* Wrapping UserPageDashboard with MainDashboard */}
            <div style={{ padding: '20px', background: '#fff' }}>
                <h1>User Management</h1>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Space wrap>
                        <Input.Search
                            placeholder="Search by username or role"
                            style={{ width: '300px' }}
                            onSearch={handleSearch}
                            allowClear
                        />
                        <Dropdown overlay={roleMenu} trigger={['click']}>
                            <Button icon={<FilterOutlined />}>Filter by Role</Button>
                        </Dropdown>
                        <Button icon={<FileTextOutlined />}>Archives</Button>
                        <Button icon={<PrinterOutlined />}>Print</Button>
                    </Space>
                    <Space wrap>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>Create New</Button>
                        <Button disabled={selectedRowKeys.length === 0} onClick={() => setIsDeleteModalVisible(true)}>Remove</Button>
                    </Space>
                </div>
                {selectedRowKeys.length > 0 && (
                    <Text strong style={{ marginBottom: '10px', display: 'block' }}>
                        {selectedRowKeys.length} item(s) selected
                    </Text>
                )}
                <UserTable
                    rowSelection={rowSelection}
                    columns={UserTable.columns}
                    dataSource={filteredData}
                    setIsEditModalVisible={setIsEditModalVisible}
                    setIsDeleteModalVisible={setIsDeleteModalVisible}
                    setModalData={setModalData}
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
            </div>
        </MainDashboard>
    );
};

export default UserPageDashboard;
