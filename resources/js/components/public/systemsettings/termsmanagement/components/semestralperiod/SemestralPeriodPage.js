// SemesterPage.js (SemestralPeriodPage.js)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import moment from 'moment';
import SemestralPeriodTable from './components/SemestralPeriodTable';
import SemesterModal from './components/SemestralPeriodModal'; // Corrected import
import { debounce } from 'lodash'; // Import debounce for search optimization

const { Text } = Typography;

const SemesterPage = () => {
    const [data, setData] = useState([]); // Active semesters
    const [archivedData, setArchivedData] = useState([]); // Archived semesters
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for bulk actions
    const [searchValue, setSearchValue] = useState(''); // Search input
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Create modal visibility
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit modal visibility
    const [modalData, setModalData] = useState(null); // Data for editing
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    const pageSize = 10; // Items per page
    const token = localStorage.getItem('auth_token'); // Retrieve token once

    // Fetch active semesters
    const fetchSemesters = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/semester', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    deleted: showArchived ? 'true' : 'false',
                },
            });

            const semesters = response.data;
            const activeSemesters = semesters.filter(semester => !semester.deleted_at);
            const archivedSemesters = semesters.filter(semester => semester.deleted_at);

            setData(activeSemesters);
            setArchivedData(archivedSemesters);

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedSemesters : activeSemesters);
        } catch (err) {
            console.error('Error fetching semesters:', err);
            setError('Failed to fetch semester data.');
            message.error('Failed to fetch semester data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch archived semesters (if needed)
    const fetchArchivedSemesters = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/semester?deleted=only', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const archivedSemesters = response.data.map(semester => ({
                ...semester,
                isArchived: true,
            }));

            setArchivedData(archivedSemesters);

            if (showArchived) {
                setFilteredData(archivedSemesters);
            }
        } catch (err) {
            console.error('Error fetching archived semesters:', err);
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchSemesters();
    }, []);

    // Update filtered data based on search, data, archivedData, and showArchived
    useEffect(() => {
        const currentList = showArchived ? archivedData : data;
        const filtered = currentList.filter(semester =>
            String(semester.semester_period || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    // Fetch data when showArchived changes
    useEffect(() => {
        if (showArchived) {
            fetchArchivedSemesters();
        } else {
            fetchSemesters();
        }
    }, [showArchived]);

    // Debounced search handler
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        debouncedHandleSearch(value);
    };

    // Handle single semester deletion (archive)
    const handleDeleteSemester = async (id) => {
        setError(null);
        try {
            await axios.delete(`/api/semester/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const semesterToDelete = data.find(semester => semester.id === id);
            if (semesterToDelete) {
                setData(data.filter(semester => semester.id !== id));
                setArchivedData([...archivedData, { ...semesterToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
                message.success('Semester archived successfully');
            }
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error archiving semester:', error);
            setError('Failed to archive semester.');
            message.error('Failed to archive semester.');
        }
    };

    // Handle multiple semesters deletion (archive)
    const handleDeleteSelected = async () => {
        const selectedSemesters = data.filter(semester => selectedRowKeys.includes(semester.id));
        if (selectedSemesters.length === 0) return;

        setError(null);
        try {
            await Promise.all(
                selectedSemesters.map(semester =>
                    axios.delete(`/api/semester/${semester.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedSemesters.map(semester => ({ ...semester, isArchived: true, deleted_at: now }));
            const remainingSemesters = data.filter(semester => !selectedRowKeys.includes(semester.id));

            setData(remainingSemesters);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedSemesters.length} semester(s) archived successfully`);
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error archiving selected semesters:', error);
            setError('Failed to archive selected semesters.');
            message.error('Failed to archive selected semesters.');
        }
    };

    // Handle single semester restoration
    const handleRestoreSemester = async (id) => {
        setError(null);
        try {
            await axios.post(`/api/semester/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const semesterToRestore = archivedData.find(semester => semester.id === id);
            if (semesterToRestore) {
                const updatedArchived = archivedData.filter(semester => semester.id !== id);
                const restoredSemester = { ...semesterToRestore, isArchived: false };
                delete restoredSemester.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredSemester]);
                message.success('Semester restored successfully');
            }
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring semester:', error);
            setError('Failed to restore semester.');
            message.error('Failed to restore semester.');
        }
    };

    // Handle multiple semesters restoration
    const handleRestoreSelected = async () => {
        const selectedSemesters = archivedData.filter(semester => selectedRowKeys.includes(semester.id));
        if (selectedSemesters.length === 0) return;

        setError(null);
        try {
            await Promise.all(
                selectedSemesters.map(semester =>
                    axios.post(`/api/semester/${semester.id}/restore`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedSemesters = archivedData.filter(semester => !selectedRowKeys.includes(semester.id));
            const restoredSemesters = selectedSemesters.map(semester => {
                const { deleted_at, ...rest } = semester;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedSemesters);
            setData([...data, ...restoredSemesters]);
            setSelectedRowKeys([]);
            message.success(`${selectedSemesters.length} semester(s) restored successfully`);
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring semesters:', error);
            setError('Failed to restore semesters.');
            message.error('Failed to restore semesters.');
        }
    };

    // Handle data reload after create, edit, delete, or restore actions
    const reloadData = async () => {
        try {
            await fetchSemesters();
        } catch (error) {
            // fetchSemesters already handles errors
        }
    };

    // **Implement handleCreateSemester with Duplicate Check**
    const handleCreateSemester = async (semesterData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(semester => 
                semester.semester_period.toLowerCase().trim() === semesterData.semester_period.toLowerCase().trim()
            );

            if (duplicate) {
                message.error('A semester period with this name already exists.');
                setError('A semester period with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to create
            await axios.post('/api/semester', semesterData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Semester period created successfully!');
            setIsCreateModalVisible(false);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error creating semester period:', error);
            setError('Failed to create semester period.');
            message.error('Failed to create semester period.');
        }
    };

    // **Implement handleEditSemester with Duplicate Check**
    const handleEditSemester = async (id, updatedData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(semester => 
                semester.semester_period.toLowerCase().trim() === updatedData.semester_period.toLowerCase().trim() && semester.id !== id
            );

            if (duplicate) {
                message.error('A semester period with this name already exists.');
                setError('A semester period with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to update
            await axios.put(`/api/semester/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('Semester period updated successfully!');
            setIsEditModalVisible(false);
            setModalData(null);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error updating semester period:', error);
            setError('Failed to update semester period.');
            message.error('Failed to update semester period.');
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=1300');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Semester Periods</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
            `);
            printWindow.document.write('</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h2>Semester Periods</h2>');
            printWindow.document.write('<table>');
            printWindow.document.write('<thead><tr>');
            printWindow.document.write('<th>Semester Period</th><th>Created At</th><th>Updated At</th>');
            if (showArchived) {
                printWindow.document.write('<th>Deleted At</th>');
            }
            printWindow.document.write('</tr></thead><tbody>');

            // Iterate over filteredData to populate the table
            filteredData.forEach(semester => {
                printWindow.document.write('<tr>');
                printWindow.document.write(`<td>${semester.semester_period || ''}</td>`);
                printWindow.document.write(`<td>${semester.created_at ? moment(semester.created_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
                printWindow.document.write(`<td>${semester.updated_at ? moment(semester.updated_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
                if (showArchived) {
                    printWindow.document.write(`<td>${semester.deleted_at ? moment(semester.deleted_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
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
                        placeholder="Search by semester period"
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
                        {showArchived ? 'Show Active Semesters' : 'Show Archived Semesters'}
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
                                Create New Semester Period
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected semesters?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Remove Selected Semesters
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected semesters?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Semesters
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>

            {/* Semestral Period Table */}
            <SemestralPeriodTable
                rowSelection={rowSelectionConfig}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSemester={handleDeleteSemester}
                handleRestoreSemester={handleRestoreSemester}
                loading={loading}
            />

            {/* Semester Modal */}
            <SemesterModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateSemester={handleCreateSemester}
                handleEditSemester={handleEditSemester}
                data={[...data, ...archivedData]} // Pass combined data for duplicate checks
            />

            {/* Error Message */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    );

};

export default SemesterPage;
