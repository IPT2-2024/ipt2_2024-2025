// CollegeProgramsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';   
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import CollegeProgramsTable from './components/CollegeProgramsTable'; 
import CollegeProgramsModal from './components/CollegeProgramsModal'; 
import { debounce } from 'lodash'; // Import debounce for search optimization

const { Text } = Typography;

const CollegeProgramsPage = () => {
    const [data, setData] = useState([]); // Active college programs
    const [archivedData, setArchivedData] = useState([]); // Archived college programs
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

    // Fetch active college programs
    const fetchCollegePrograms = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/collegeprogram', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const programs = response.data;
            const activePrograms = programs.filter(program => !program.isArchived);
            const archivedPrograms = programs.filter(program => program.isArchived);

            setData(activePrograms);
            setArchivedData(archivedPrograms);

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedPrograms : activePrograms);
            setCurrentPage(1); 
        } catch (err) {
            console.error('Error fetching college programs:', err);
            setError('Failed to fetch college program data.');
            message.error('Failed to fetch college program data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch archived college programs (if needed)
    const fetchArchivedCollegePrograms = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/collegeprogram?deleted=only', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedPrograms = response.data.map(program => ({
                ...program,
                isArchived: true,
            }));

            setArchivedData(archivedPrograms);

            if (showArchived) {
                setFilteredData(archivedPrograms);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived college programs:', err);
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchCollegePrograms();
    }, []);

    // Update filtered data based on search, data, archivedData, and showArchived
    useEffect(() => {
        const currentList = showArchived ? archivedData : data;
        const filtered = currentList.filter(program =>
            String(program.college_programs || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    // Fetch data when showArchived changes
    useEffect(() => {
        if (showArchived) {
            fetchArchivedCollegePrograms();
        } else {
            fetchCollegePrograms();
        }
    }, [showArchived]);

    // Debounced search handler
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        debouncedHandleSearch(value);
    };

    // Handle single college program deletion (archive)
    const handleDeleteCollegeProgram = async (id) => {
        setError(null); 
        try {
            await axios.delete(`/api/collegeprogram/${id}`, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const programToDelete = data.find(program => program.id === id);
            if (programToDelete) {
                setData(data.filter(program => program.id !== id));
                setArchivedData([...archivedData, { ...programToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
                message.success('College Program archived successfully');
            }
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error archiving college program:', error);
            setError('Failed to archive college program.');
            message.error('Failed to archive college program.');
        }
    };

    // Handle multiple college programs deletion (archive)
    const handleDeleteSelected = async () => {
        const selectedPrograms = data.filter(program => selectedRowKeys.includes(program.id));
        if (selectedPrograms.length === 0) return;

        setError(null); 
        try {
            await Promise.all(
                selectedPrograms.map(program =>
                    axios.delete(`/api/collegeprogram/${program.id}`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedPrograms.map(program => ({ ...program, isArchived: true, deleted_at: now }));
            const remainingPrograms = data.filter(program => !selectedRowKeys.includes(program.id));

            setData(remainingPrograms);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedPrograms.length} college program(s) archived successfully`);
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error archiving selected college programs:', error);
            setError('Failed to archive selected college programs.');
            message.error('Failed to archive selected college programs.');
        }
    };

    // Handle single college program restoration
    const handleRestoreCollegeProgram = async (id) => {
        setError(null); 
        try {
            await axios.post(`/api/collegeprogram/${id}/restore`, {}, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            const programToRestore = archivedData.find(program => program.id === id);
            if (programToRestore) {
                const updatedArchived = archivedData.filter(program => program.id !== id);
                const restoredProgram = { ...programToRestore, isArchived: false };
                delete restoredProgram.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredProgram]);
                message.success('College Program restored successfully');
            }
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring college program:', error);
            setError('Failed to restore college program.');
            message.error('Failed to restore college program.');
        }
    };

    // Handle multiple college programs restoration
    const handleRestoreSelected = async () => {
        const selectedPrograms = archivedData.filter(program => selectedRowKeys.includes(program.id));
        if (selectedPrograms.length === 0) return;

        setError(null); 
        try {
            await Promise.all(
                selectedPrograms.map(program =>
                    axios.post(`/api/collegeprogram/${program.id}/restore`, {}, { 
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedPrograms = archivedData.filter(program => !selectedRowKeys.includes(program.id));
            const restoredPrograms = selectedPrograms.map(program => {
                const { deleted_at, ...rest } = program;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedPrograms);
            setData([...data, ...restoredPrograms]);
            setSelectedRowKeys([]);
            message.success(`${selectedPrograms.length} college program(s) restored successfully`);
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring college programs:', error);
            setError('Failed to restore college programs.');
            message.error('Failed to restore college programs.');
        }
    };

    // Handle data reload after create, edit, delete, or restore actions
    const reloadData = async () => {
        try {
            await fetchCollegePrograms();
        } catch (error) {
            // fetchCollegePrograms already handles errors
        }
    };

    // **Implement handleCreateCollegeProgram with Duplicate Check**
    const handleCreateCollegeProgram = async (programData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(program => 
                program.college_programs.toLowerCase().trim() === programData.college_programs.toLowerCase().trim()
            );

            if (duplicate) {
                message.error('A college program with this name already exists.');
                setError('A college program with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to create
            await axios.post('/api/collegeprogram', programData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('College program created successfully!');
            setIsCreateModalVisible(false);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error creating college program:', error);
            setError('Failed to create college program.');
            message.error('Failed to create college program.');
        }
    };

    // **Implement handleEditCollegeProgram with Duplicate Check**
    const handleEditCollegeProgram = async (id, updatedData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(program => 
                program.college_programs.toLowerCase().trim() === updatedData.college_programs.toLowerCase().trim() && program.id !== id
            );

            if (duplicate) {
                message.error('A college program with this name already exists.');
                setError('A college program with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to update
            await axios.put(`/api/collegeprogram/${id}`, updatedData, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('College program updated successfully!');
            setIsEditModalVisible(false);
            setModalData(null);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error updating college program:', error);
            setError('Failed to update college program.');
            message.error('Failed to update college program.');
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        if (printWindow) {
            printWindow.document.write('<html><head><title>College Programs</title></head><body>');
            printWindow.document.write('<h2>College Programs Data</h2>');
            printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
            printWindow.document.write('<thead><tr><th>Program Name</th><th>Study Type</th>');
            if (!showArchived) {
                printWindow.document.write('<th>Created At</th><th>Updated At</th>');
            } else {
                printWindow.document.write('<th>Deleted At</th>');
            }
            printWindow.document.write('</tr></thead><tbody>');

            filteredData.forEach(program => {
                printWindow.document.write('<tr>');
                // printWindow.document.write(`<td>${program.id ?? ''}</td>`);
                printWindow.document.write(`<td>${program.college_programs ?? ''}</td>`);
                printWindow.document.write(`<td>${program.study_type ?? ''}</td>`);
                if (!showArchived) {
                    printWindow.document.write(`<td>${program.created_at ? new Date(program.created_at).toLocaleString() : ''}</td>`);
                    printWindow.document.write(`<td>${program.updated_at ? new Date(program.updated_at).toLocaleString() : ''}</td>`);
                } else {
                    printWindow.document.write(`<td>${program.deleted_at ? new Date(program.deleted_at).toLocaleString() : ''}</td>`);
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
    const rowSelectionConfig = {
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
                        placeholder="Search by program name"
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
                        {showArchived ? 'Show Active Programs' : 'Show Archived Programs'}
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
                                Create New College Program
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected college programs?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Remove Selected Programs
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected college programs?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Programs
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            
            {/* College Programs Table */}
            <CollegeProgramsTable
                rowSelection={rowSelectionConfig}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteProgram={handleDeleteCollegeProgram}
                handleRestoreCollegeProgram={handleRestoreCollegeProgram} 
                currentPage={currentPage}
                pageSize={pageSize} 
                setCurrentPage={setCurrentPage}
                showArchived={showArchived} 
                loading={loading}
            />

            {/* College Programs Modal */}
            <CollegeProgramsModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateCollegeProgram={handleCreateCollegeProgram} 
                handleEditCollegeProgram={handleEditCollegeProgram}    
                data={[...data, ...archivedData]} // Pass combined data for duplicate checks
            />

            {/* Error Message */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

export default CollegeProgramsPage;
