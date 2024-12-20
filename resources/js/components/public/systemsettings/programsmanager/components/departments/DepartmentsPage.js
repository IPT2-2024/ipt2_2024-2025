// DepartmentsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';   
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import DepartmentTable from './components/DepartmentTable'; 
import DepartmentModal from './components/DepartmentModal'; 
import { debounce } from 'lodash'; // Import debounce for search optimization

const { Text } = Typography;

const DepartmentsPage = () => {
    const [data, setData] = useState([]); // Active departments
    const [archivedData, setArchivedData] = useState([]); // Archived departments
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for bulk actions
    const [searchValue, setSearchValue] = useState(''); // Search input
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Create modal visibility
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit modal visibility
    const [modalData, setModalData] = useState(null); // Data for editing
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const pageSize = 10; // Items per page

    const token = localStorage.getItem('auth_token'); 

    // Fetch active departments
    const fetchDepartments = async () => {
        setLoading(true);
        setError(null); 
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

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedDepartments : activeDepartments);
            setCurrentPage(1);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Failed to fetch department data.');
            message.error('Failed to fetch department data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch archived departments (if needed)
    const fetchArchivedDepartments = async () => {
        setLoading(true);
        setError(null); 
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
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Update filtered data based on search, data, archivedData, and showArchived
    useEffect(() => {
        const currentList = showArchived ? archivedData : data;
        const filtered = currentList.filter(dep =>
            String(dep.department_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    // Fetch data when showArchived changes
    useEffect(() => {
        if (showArchived) {
            fetchArchivedDepartments();
        } else {
            fetchDepartments();
        }
    }, [showArchived]);

    // Debounced search handler
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        debouncedHandleSearch(value);
    };

    // Handle single department deletion (archive)
    const handleDeleteDepartment = async (id) => {
        setError(null); 
        try {
            await axios.delete(`/api/department/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const departmentToDelete = data.find(dep => dep.id === id);
            if (departmentToDelete) {
                setData(data.filter(dep => dep.id !== id));
                setArchivedData([...archivedData, { ...departmentToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
                message.success('Department archived successfully');
            }
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error archiving department:', error);
            setError('Failed to archive department.');
            message.error('Failed to archive department.');
        }
    };

    // Handle multiple departments deletion (archive)
    const handleDeleteSelected = async () => {
        const selectedDepartments = data.filter(dep => selectedRowKeys.includes(dep.id));
        if (selectedDepartments.length === 0) return;

        setError(null); 
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
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error archiving selected departments:', error);
            setError('Failed to archive selected departments.');
            message.error('Failed to archive selected departments.');
        }
    };

    // Handle multiple departments restoration
    const handleRestoreSelected = async () => {
        const selectedDepartments = archivedData.filter(dep => selectedRowKeys.includes(dep.id));
        if (selectedDepartments.length === 0) return;

        setError(null); 
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
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring departments:', error);
            setError('Failed to restore departments.');
            message.error('Failed to restore departments.');
        }
    };

    // Handle single department restoration
    const handleRestoreDepartment = async (id) => {
        setError(null); 
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
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring department:', error);
            setError('Failed to restore department.');
            message.error('Failed to restore department.');
        }
    };

    // Handle data reload after create, edit, delete, or restore actions
    const reloadData = async () => {
        try {
            await fetchDepartments();
        } catch (error) {
            // fetchDepartments already handles errors
        }
    };

    // **Implement handleCreateDepartment with Duplicate Check**
    const handleCreateDepartment = async (departmentData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(dep => 
                dep.department_name.toLowerCase().trim() === departmentData.department_name.toLowerCase().trim()
            );

            if (duplicate) {
                message.error('A department with this name already exists.');
                setError('A department with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to create
            await axios.post('/api/department', departmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Department created successfully!');
            setIsCreateModalVisible(false);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error creating department:', error);
            setError('Failed to create department.');
            message.error('Failed to create department.');
        }
    };

    // **Implement handleEditDepartment with Duplicate Check**
    const handleEditDepartment = async (id, updatedData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(dep => 
                dep.department_name.toLowerCase().trim() === updatedData.department_name.toLowerCase().trim() && dep.id !== id
            );

            if (duplicate) {
                message.error('A department with this name already exists.');
                setError('A department with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to update
            await axios.put(`/api/department/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('Department updated successfully!');
            setIsEditModalVisible(false);
            setModalData(null);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error updating department:', error);
            setError('Failed to update department.');
            message.error('Failed to update department.');
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        if (printWindow) {
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
        }
    };

    // Row selection for bulk actions
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            {/* Search and Action Buttons */}
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
            
            {/* Departments Table */}
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

            {/* Department Modal */}
            <DepartmentModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateDepartment={handleCreateDepartment} 
                handleEditDepartment={handleEditDepartment}     
                data={[...data, ...archivedData]} // Pass combined data for duplicate checks
            />

            {/* Error Message */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

export default DepartmentsPage;
