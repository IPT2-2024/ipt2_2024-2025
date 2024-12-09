
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';   
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import DepartmentTable from './components/DepartmentTable'; 
import DepartmentModal from './components/DepartmentModal'; 


const { Text } = Typography;

const DepartmentsPage = () => {
    const [data, setData] = useState([]); 
    const [archivedData, setArchivedData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const pageSize = 10;

    const token = localStorage.getItem('auth_token'); 

    
    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/department', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const departments = response.data;
            const activeDepartments = departments.filter(dep => !dep.isArchived);
            const archivedDepartments = departments.filter(dep => dep.isArchived);

            setData(activeDepartments);
            setArchivedData(archivedDepartments);

            if (showArchived) {
                setFilteredData(archivedDepartments);
            } else {
                setFilteredData(activeDepartments);
            }
            setCurrentPage(1);
        } catch (err) {
            console.error('Error fetching departments:', err);
            message.error('Failed to fetch department data.');
        } finally {
            setLoading(false);
        }
    };

    
    const fetchArchivedDepartments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/department?deleted=only', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedDepartments = response.data.map(dep => ({
                ...dep,
                isArchived: true,
            }));

            setArchivedData(archivedDepartments);
            if (showArchived) {
                setFilteredData(archivedDepartments);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived departments:', err);
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        fetchDepartments();
    }, []);

    useEffect(() => {
        
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(dep =>
            String(dep.department_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    useEffect(() => {
        
        if (showArchived) {
            fetchArchivedDepartments();
        } else {
            fetchDepartments();
        }
    }, [showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleDeleteDepartment = async (id) => {
        const departmentToDelete = data.find(dep => dep.id === id);
        if (!departmentToDelete) return;

        try {
            await axios.delete(`/api/department/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(data.filter(dep => dep.id !== id));
            setArchivedData([...archivedData, { ...departmentToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
            message.success('Department archived successfully');
        } catch (error) {
            console.error('Error archiving department:', error);
            message.error('Failed to archive department.');
        }
    };

    const handleDeleteSelected = async () => {
        const selectedDepartments = data.filter(dep => selectedRowKeys.includes(dep.id));
        if (selectedDepartments.length === 0) return;

        try {
            await Promise.all(
                selectedDepartments.map(dep =>
                    axios.delete(`/api/department/${dep.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedDepartments.map(dep => ({ ...dep, isArchived: true, deleted_at: now }));
            const remainingDepartments = data.filter(dep => !selectedRowKeys.includes(dep.id));

            setData(remainingDepartments);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedDepartments.length} department(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected departments:', error);
            message.error('Failed to archive selected departments.');
        }
    };

    const handleRestoreSelected = async () => {
        const selectedDepartments = archivedData.filter(dep => selectedRowKeys.includes(dep.id));
        if (selectedDepartments.length === 0) return;

        try {
            await Promise.all(
                selectedDepartments.map(dep =>
                    axios.post(`/api/department/${dep.id}/restore`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedDepartments = archivedData.filter(dep => !selectedRowKeys.includes(dep.id));
            const restoredDepartments = selectedDepartments.map(dep => {
                const { deleted_at, ...rest } = dep;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedDepartments);
            setData([...data, ...restoredDepartments]);
            setSelectedRowKeys([]);
            message.success(`${selectedDepartments.length} department(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring departments:', error);
            message.error('Failed to restore departments.');
        }
    };

    const handleRestoreDepartment = async (id) => {
        try {
            await axios.post(`/api/department/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const departmentToRestore = archivedData.find(dep => dep.id === id);
            if (departmentToRestore) {
                const updatedArchived = archivedData.filter(dep => dep.id !== id);
                const restoredDepartment = { ...departmentToRestore, isArchived: false };
                delete restoredDepartment.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredDepartment]);
                message.success('Department restored successfully');
            }
        } catch (error) {
            console.error('Error restoring department:', error);
            message.error('Failed to restore department.');
        }
    };

    
    const handleEditDepartment = async (id, updatedData) => {
        try {
            await axios.put(`/api/department/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const updatedDepartments = data.map(dep => 
                dep.id === id ? { ...dep, ...updatedData, updated_at: new Date().toISOString() } : dep
            );
            setData(updatedDepartments);
            setIsEditModalVisible(false);
            message.success('Department updated successfully');
        } catch (error) {
            console.error('Error updating department:', error);
            message.error('Failed to update department.');
        }
    };

    const handleCreateDepartment = async (departmentData) => {
        try {
            const response = await axios.post('/api/department', departmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newDepartment = response.data; 

            message.success('New department created successfully');
            setIsCreateModalVisible(false);

            
            fetchDepartments();
        } catch (error) {
            console.error('Error creating department:', error);
            message.error('Failed to create department.');
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        printWindow.document.write('<html><head><title>Department Table</title></head><body>');
        printWindow.document.write('<h2>Department Data</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
        printWindow.document.write('<thead><tr><th>Department Name</th>');
        if (!showArchived) {
            printWindow.document.write('<th>Created At</th><th>Updated At</th>');
        } else {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        filteredData.forEach(dep => {
            printWindow.document.write('<tr>');
            // printWindow.document.write(`<td>${dep.id ?? ''}</td>`);
            printWindow.document.write(`<td>${dep.department_name ?? ''}</td>`);
            if (!showArchived) {
                printWindow.document.write(`<td>${dep.created_at ? new Date(dep.created_at).toLocaleString() : ''}</td>`);
                printWindow.document.write(`<td>${dep.updated_at ? new Date(dep.updated_at).toLocaleString() : ''}</td>`);
            } else {
                printWindow.document.write(`<td>${dep.deleted_at ? new Date(dep.deleted_at).toLocaleString() : ''}</td>`);
            }
            printWindow.document.write('</tr>');
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by department name"
                        style={{ width: '100%', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} style={{ width: '100%' }} onClick={handlePrint}>
                        Print
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Departments' : 'Show Archived Departments'}
                    </Button>
                </Space>
                <Space
                    wrap
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}
                >
                    {!showArchived && (
                        <>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalVisible(true)}
                                style={{ width: '100%' }}
                            >
                                Create New Department
                            </Button>
                            <Popconfirm
                            title="Are you sure you want to delete the selected departments?"
                            onConfirm={handleDeleteSelected}
                            okText="Yes"
                            cancelText="No"
                            >
                            <Button
                                danger
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Remove Selected Departments
                            </Button>
                            </Popconfirm>
                            
                        </>
                        
                    )}
                    {showArchived && (
                        <Popconfirm
                        title="Are you sure you want to restore the selected departments?"
                        onConfirm={handleRestoreSelected}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            disabled={selectedRowKeys.length === 0}
                            style={{ width: '100%' }}
                        >
                            Restore Selected Departments
                        </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            <DepartmentTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteDepartment={handleDeleteDepartment}
                handleRestoreDepartment={handleRestoreDepartment} 
                currentPage={currentPage}
                pageSize={pageSize} 
                setCurrentPage={setCurrentPage}
                showArchived={showArchived} 
                loading={loading}
            />
            <DepartmentModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateDepartment={handleCreateDepartment} 
                handleEditDepartment={handleEditDepartment}     
            />
            {error && <Text type="danger">{error}</Text>}
        </div>
    );

};

export default DepartmentsPage;
