// UserPage.js (new working functionality on filter by role)
import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Input,
    Space,
    Dropdown,
    Menu,
    Typography,
    message,
    Modal,
    Row,
    Col,
    Popconfirm,
} from 'antd';
import {
    FilterOutlined,
    FileTextOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import UserTable from './components/UserTable';
import UserCreateModal from './components/UserCreateModal';
import UserEditModal from './components/UserEditModal';
import MainDashboard from '../dashboard/components/MainDashboard';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;

const UserPage = () => {
    const [data, setData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    const [roles, setRoles] = useState([]); 
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [searchValue, setSearchValue] = useState(''); 
    const [loading, setLoading] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All'); 


    
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

    
    const [selectedRole, setSelectedRole] = useState('All');

    
    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        filterData(); 
    }, [searchValue, showArchived, selectedRole, data, filterData]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/roles', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data)) {
                    setRoles(response.data);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching roles: ' + (error.response?.data?.message || error.message));
            }
        };

        fetchRoles();
    }, []);

    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('API Response:', response.data); 

                if (Array.isArray(response.data)) {
                    const users = response.data.map(user => {
                        
                        const role = roles.find(role => role.id === user.role_id);
                        return {
                            ...user,
                            status: user.deleted_at 
                            ? 'archived' 
                            : user.status === 'regular' 
                            ? 'regular' 
                            : user.status === 'irregular' 
                            ? 'irregular' 
                            : 'active',  
                            role_name: role ? role.role_name : 'No Role',  
                        };
                    });

                    setData(users);
                    setFilteredData(users);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching user data: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roles]);

    const reloadData = () => {
        
        setSearchValue(''); 
        setSelectedRole('All'); 
        setShowArchived(false); 
    
        const fetchData = async () => {
            setLoading(true); 
    
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/building', { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                console.log('API Response:', response.data); 
    
                
                if (Array.isArray(response.data)) {
                    const buildings = response.data.map(building => ({
                        ...building,
                        status: building.deleted_at
                            ? 'archived'
                            : 'active', 
                        floor_name: building.floor ? building.floor.floor_level : 'No Floor', 
                    }));
    
                    
                    setData(buildings);
                    setFilteredData(buildings);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching building data: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false); 
            }
        };
    
        fetchData(); 
    };
    

    
    const filterData = useCallback(() => {
        let filtered = data.filter((user) => {
            const matchesSearch =
                (user.username && user.username.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.role_name && user.role_name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchValue.toLowerCase()));

            const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;

            const matchesRole = selectedRole === 'All' || user.role_name === selectedRole;

            return matchesSearch && matchesStatus && matchesRole;
        });

        setFilteredData(filtered); 
    }, [searchValue, showArchived, selectedRole, data]);

    
    const debouncedFilter = useCallback(
        debounce(() => {
            filterData();
        }, 300),
        [filterData]
    );

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value); 
        debouncedFilter();
    };

    const handleSearch = () => {
        filterData(); 
    };

    
    const roleMenu = (
        <Menu>
            {roles.map(role => (
                <Menu.Item key={role.id} onClick={() => handleRoleFilter(role.role_name)}>
                    {role.role_name}
                </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item onClick={() => handleRoleFilter('All')}>All Roles</Menu.Item> {}
        </Menu>
    );
    
    const handleRoleFilter = (role) => {
        setSelectedRole(role); 
    };

    
    const handleReset = () => {
        setFilteredData(data);
        setSearchValue(''); 
        setSelectedRole('All'); 
    };

    
    const handleArchiveToggle = () => {
        setShowArchived(!showArchived);  
    
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        deleted: showArchived ? 'false' : 'only',  
                    },
                });
    
                console.log('API Response:', response.data);  
    
                if (Array.isArray(response.data)) {
                    const users = response.data.map(user => {
                        const role = roles.find(role => role.id === user.role_id);
                        return {
                            ...user,
                            status: user.deleted_at 
                                ? 'archived' 
                                : user.status === 'regular' 
                                ? 'regular' 
                                : user.status === 'irregular' 
                                ? 'irregular' 
                                : 'active',  
                            role_name: role ? role.role_name : 'No Role', 
                        };
                    });
    
                    setData(users);
                    setFilteredData(users);
                } else {
                    message.error('Error: Data received is not an array.');
                }
            } catch (error) {
                message.error('Error fetching user data: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }; 

    
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            console.log("Selected IDs for Delete:", selectedRowKeys); 
    
            
            const deletePromises = selectedRowKeys.map(async (id) => {
                return axios.delete(`/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
    
            
            await Promise.all(deletePromises);
    
            
            reloadData(); 
    
            message.success(`${selectedRowKeys.length} user(s) deleted`);
        } catch (error) {
            message.error('Failed to delete users: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); 
        }
    };

    const handleSpecificDelete = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            
            setData(prevData => prevData.filter(user => user.id !== id));
            message.success('User deleted successfully');
        } catch (error) {
            message.error('Failed to delete user: ' + (error.response?.data?.message || error.message));
        }
    };
    

    
    const handleRestore = async (userId) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            await axios.post(`/api/users/${userId}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            reloadData(); 
            
            setData((prevData) =>
                prevData.map((user) =>
                    user.id === userId ? { ...user, status: 'active' } : user
                )
            );
    
            message.success('User restored'); 
        } catch (error) {
            message.error('Failed to restore user: ' + (error.response?.data?.message || error.message)); // Error handling
        }
    };
    

    
    const confirmDeleteUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            await axios.patch('/api/users/archive', { ids: selectedRowKeys }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            
            const newData = data.map((user) =>
                selectedRowKeys.includes(user.id) ? { ...user, status: 'archived' } : user
            );
            setData(newData); 
            setFilteredData(newData); 
    
            message.success(`${selectedRowKeys.length} user(s) moved to archives`);
        } catch (error) {
            message.error('Failed to archive users: ' + (error.response?.data?.message || error.message)); 
        } finally {
            setConfirmDeleteModalVisible(false);
            setSelectedRowKeys([]); 
        }
    };
    
    

    
    const handleRestoreSelected = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            console.log("Selected IDs for Restore:", selectedRowKeys);  
    
            
            const restorePromises = selectedRowKeys.map(async (id) => {
                return axios.post(`/api/users/${id}/restore`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
    
            
            await Promise.all(restorePromises);

            reloadData(); 
    
            
            const newData = data.map((user) =>
                selectedRowKeys.includes(user.id) ? { ...user, status: 'active' } : user
            );
            setData(newData);  
            message.success(`${selectedRowKeys.length} user(s) restored`);
        } catch (error) {
            message.error('Failed to restore users: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); 
        }
    };
    

    
    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
        getCheckboxProps: (record) => ({
            disabled: false, 
        }),
    };

    
    useEffect(() => {
        filterData();
    }, [filterData]);

    return (
        <MainDashboard>
            
            <div className="user-page" style={{ padding: '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {}
                    <h3 style={{ marginBottom: '14px' }}>Users Management</h3>
                    <Row
                        gutter={[16, 16]}
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: 16 }}
                    >
                        <Col xs={24} sm={24} md={12}>
                            <Space wrap>
                                <Input.Search
                                    value={searchValue}
                                    placeholder="Search by username, role, or email"
                                    style={{ width: '100%', maxWidth: 300 }}
                                    onSearch={handleSearch}
                                    onChange={handleSearchChange}
                                    allowClear
                                />
                                <Dropdown overlay={roleMenu} trigger={['click']}>
                                    <Button icon={<FilterOutlined />}>
                                        {selectedRole === 'All' ? 'Filter by Role' : `Role: ${selectedRole}`}
                                    </Button>
                                </Dropdown>
                                <Button
                                    icon={<FileTextOutlined />}
                                    onClick={handleArchiveToggle}
                                >
                                    {showArchived ? 'View Active Users' : 'View Archived Users'}
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    disabled={searchValue === '' && selectedRole === 'All'}
                                >
                                    Reset Filters
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} sm={24} md={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                            <Space wrap>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsCreateModalVisible(true)}
                                >
                                    Create New
                                </Button>
                                {!showArchived && (
                                <Popconfirm
                                    title="Are you sure to delete this user/s?"
                                    onConfirm={() => handleDelete()} 
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        disabled={selectedRowKeys.length === 0} 
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                                )}
                                {showArchived && (
                                <Popconfirm
                                    title="Are you sure to restore this user/s?"
                                    onConfirm={() => handleRestoreSelected()} 
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="default"
                                        disabled={selectedRowKeys.length === 0}
                                    >
                                        Restore Selected
                                    </Button>
                                </Popconfirm>
                                )}
                            </Space>
                        </Col>
                    </Row>

                    {}
                    {selectedRowKeys.length > 0 && (
                        <Text strong style={{ marginBottom: '1px', display: 'block' }}>
                            {selectedRowKeys.length} item(s) selected
                        </Text>
                    )}

                    {}
                    <UserTable
                        rowSelection={rowSelectionConfig}
                        data={filteredData}
                        loading={loading}
                        setIsEditModalVisible={setIsEditModalVisible}
                        setIsDeleteModalVisible={setIsDeleteModalVisible}
                        setModalData={setModalData}
                        handleDelete={handleDelete}
                        handleRestore={handleRestore}
                        handleSpecificDelete={handleSpecificDelete}
                        reloadData={reloadData} 
                    />
                </Space>

                {}
                <UserCreateModal
                    isVisible={isCreateModalVisible}
                    setIsVisible={setIsCreateModalVisible}
                    reloadData={reloadData}
                    roles={roles}
                />

                <UserEditModal
                    isVisible={isEditModalVisible}
                    setIsVisible={setIsEditModalVisible}
                    reloadData={reloadData}
                    modalData={modalData}
                    setModalData={setModalData}
                    roles={roles}
                />

                {}
                <Modal
                    title="Confirm Archive"
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
