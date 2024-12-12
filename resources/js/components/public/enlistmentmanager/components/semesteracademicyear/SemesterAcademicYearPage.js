// SemesterAcademicYearPage.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Modal, Spin } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import SemesterAcademicYearTable from './components/SemesterAcademicYearTable';
import SemesterAcademicYearModal from './components/SemesterAcademicYearModal';
import axios from 'axios';

const { Text } = Typography;

const SemesterAcademicYearPage = () => {
    const [data, setData] = useState([]); // Active data
    const [archivedData, setArchivedData] = useState([]); // Archived data
    const [filteredData, setFilteredData] = useState([]); // Displayed data based on filter
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view
    const [academicYears, setAcademicYears] = useState([]);  // State to store academic years
    const [semesters, setSemesters] = useState([]);  // State to store semesters

    // **Effect to Filter Data Based on Search and Archived View**
    useEffect(() => {
        const sourceData = showArchived ? archivedData : data;
        const filtered = sourceData.filter(semester => {
            const academicYear = semester.academic_year || '';
            return academicYear.toString().toLowerCase().includes(searchValue.toLowerCase());
        });
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    // **Search Handlers**
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    // **Initial Data Fetching: Academic Years and Semesters**
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.error('No token found');
                message.error('Authorization token is missing');
                setLoading(false); // End loading
                return;
            }

            try {
                // Fetch Academic Years
                const academicYearResponse = await axios.get('/api/academicyear', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setAcademicYears(academicYearResponse.data);

                // Fetch Semesters
                const semesterResponse = await axios.get('/api/semester', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSemesters(semesterResponse.data);
            } catch (error) {
                console.error('Error fetching academic data:', error);
                message.error('Failed to fetch academic years or semesters');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchData();
    }, []);

    // **Handle Status Change: Ensure Only One Active Record**
    const handleStatusChange = async (id, checked) => {
        setLoading(true); // Start loading
        const token = localStorage.getItem('auth_token');
        if (!token) {
            message.error('Authorization token is missing');
            setLoading(false); // End loading
            return;
        }

        try {
            if (checked) {
                // Set the target id's status to 1
                await axios.put(`/api/semesteracademicyear/${id}/status`, { status: 1 }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Set all other active records' status to 0
                const otherIds = data.filter(item => item.id !== id).map(item => item.id);
                const updatePromises = otherIds.map(otherId =>
                    axios.put(`/api/semesteracademicyear/${otherId}/status`, { status: 0 }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                );

                await Promise.all(updatePromises);

                message.success('Status updated successfully');
            } else {
                // If unchecked, set the target id's status to 0
                await axios.put(`/api/semesteracademicyear/${id}/status`, { status: 0 }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                message.success('Status updated successfully');
            }

            // Reload data to reflect changes
            fetchSemesterAcademicYears();
        } catch (error) {
            console.error('Error updating status:', error);
            message.error(`Failed to update status: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        } finally {
            setLoading(false); // End loading
        }
    };

    // **Fetch Semester Academic Years and Segregate Active/Archived**
    const fetchSemesterAcademicYears = async () => {
        setLoading(true); // Start loading
        const token = localStorage.getItem('auth_token'); // Retrieve auth_token from localStorage

        if (!token) {
            console.error('No token found');
            message.error('Authorization token is missing');
            setLoading(false); // End loading
            return;
        }

        try {
            const response = await axios.get('/api/semesteracademicyear', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in Authorization header
                }
            });

            const semesterAcademicYears = response.data;

            // **Segregate Active and Archived Records**
            const activeRecords = semesterAcademicYears.filter(semester => !semester.deleted_at);
            const archivedRecords = semesterAcademicYears.filter(semester => semester.deleted_at);

            setData(activeRecords);  // Active records
            setArchivedData(archivedRecords);  // Archived records

            // **Set Filtered Data Based on showArchived**
            const filtered = showArchived ? archivedRecords : activeRecords;
            setFilteredData(filtered);

            console.log('Fetched Semester Academic Years:', response.data);
        } catch (error) {
            console.error('Error fetching semester academic years:', error);
            message.error('Failed to fetch semester academic years');
        } finally {
            setLoading(false); // End loading
        }
    };

    // **Initial Fetch When Component Mounts and When showArchived Changes**
    useEffect(() => {
        fetchSemesterAcademicYears();  // Call the fetch function when the component mounts or showArchived changes
    }, [showArchived]);

    // **Reload Data Function: Re-fetch Semester Academic Years**
    const reloadData = () => {
        fetchSemesterAcademicYears();
    };

    // **Handle Delete (Archive) Single Record with Confirmation**
    const handleDeleteSemesterAcademicYear = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to archive this academic year?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Archive',
            cancelText: 'Cancel',
            onOk: () => {
                setLoading(true); // Start loading
                const semesterToDelete = data.find(semester => semester.id === id);
                if (semesterToDelete) {
                    const deletedAt = new Date().toISOString(); // Get current timestamp
                    axios.put(`/api/semesteracademicyear/${id}/archive`, { deleted_at: deletedAt }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
                    })
                    .then(() => {
                        setData(data.filter(semester => semester.id !== id)); // Remove from active data
                        setArchivedData([...archivedData, { ...semesterToDelete, isArchived: true, deleted_at: deletedAt }]); // Add to archived data with deleted_at
                        message.success('Semester Academic Year archived successfully');
                    })
                    .catch((error) => {
                        console.error('Error archiving semester academic year:', error);
                        message.error('Failed to archive Semester Academic Year.');
                    })
                    .finally(() => {
                        setLoading(false); // End loading
                    });
                } else {
                    setLoading(false); // End loading if semester not found
                }
            },
        });
    };

    // **Handle Delete (Archive) Selected Records with Confirmation**
    const handleDeleteSelected = () => {
        Modal.confirm({
            title: 'Are you sure you want to archive the selected academic years?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Archive',
            cancelText: 'Cancel',
            onOk: async () => {
                setLoading(true); // Start loading
                const token = localStorage.getItem('auth_token');
                try {
                    const deletePromises = selectedRowKeys.map(id =>
                        axios.put(`/api/semesteracademicyear/${id}/archive`, { deleted_at: new Date().toISOString() }, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    );

                    await Promise.all(deletePromises);

                    const archivedSemesters = data.filter(semester => selectedRowKeys.includes(semester.id));
                    const remainingSemesters = data.filter(semester => !selectedRowKeys.includes(semester.id));

                    setData(remainingSemesters); // Remove archived from active data
                    setArchivedData([...archivedData, ...archivedSemesters.map(semester => ({ ...semester, isArchived: true, deleted_at: new Date().toISOString() }))]); // Add to archived data

                    setSelectedRowKeys([]); // Clear selected keys
                    message.success(`${archivedSemesters.length} semester(s) archived successfully`);
                } catch (error) {
                    console.error('Error archiving selected semester academic years:', error);
                    message.error('Failed to archive selected Semester Academic Years.');
                } finally {
                    setLoading(false); // End loading
                }
            },
        });
    };

    // **Handle Restore Selected Archived Records with Confirmation**
    const handleRestoreSelected = () => {
        Modal.confirm({
            title: 'Are you sure you want to restore the selected academic years?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Restore',
            cancelText: 'Cancel',
            onOk: async () => {
                setLoading(true); // Start loading
                const token = localStorage.getItem('auth_token');
                try {
                    const restorePromises = selectedRowKeys.map(id =>
                        axios.post(`/api/semesteracademicyear/${id}/restore`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    );

                    await Promise.all(restorePromises);

                    const restoredSemesters = archivedData.filter(semester => selectedRowKeys.includes(semester.id));
                    const remainingArchivedSemesters = archivedData.filter(semester => !selectedRowKeys.includes(semester.id));

                    setArchivedData(remainingArchivedSemesters); // Remove restored from archived data
                    setData([...data, ...restoredSemesters.map(semester => ({ ...semester, isArchived: false, deleted_at: null }))]); // Add to active data

                    setSelectedRowKeys([]); // Clear selected keys
                    message.success(`${restoredSemesters.length} semester(s) restored successfully`);
                } catch (error) {
                    console.error('Error restoring selected semester academic years:', error);
                    message.error('Failed to restore selected Semester Academic Years.');
                } finally {
                    setLoading(false); // End loading
                }
            },
        });
    };

    // **Handle Create New Academic Year**
    const handleCreateSemesterAcademicYear = async (values) => {
        setLoading(true); // Start loading
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                message.error('Authorization token is missing');
                setLoading(false);
                return;
            }

            // **Duplicate Check**
            const duplicate = data.some(semester => 
                semester.academic_year.toLowerCase() === values.academic_year.trim().toLowerCase()
            ) || archivedData.some(semester => 
                semester.academic_year.toLowerCase() === values.academic_year.trim().toLowerCase()
            );

            if (duplicate) {
                message.error('An academic year with this name already exists.');
                setLoading(false);
                return; // Prevent further execution
            }

            const response = await axios.post('/api/semesteracademicyear', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData([...data, response.data.semesterAcademicYear]);
            setIsCreateModalVisible(false);
            message.success('Semester Academic Year created successfully');
            reloadData();
        } catch (error) {
            console.error('Failed to create Semester Academic Year:', error);
            message.error('Failed to create Semester Academic Year.');
        } finally {
            setLoading(false); // End loading
        }
    };

    // **Handle Edit Semester Academic Year**
    const handleEditSemesterAcademicYear = async (id, updatedValues) => {
        setLoading(true); // Start loading
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                message.error('Authorization token is missing');
                setLoading(false);
                return;
            }

            // **Duplicate Check**
            const duplicate = data.some(semester => 
                semester.academic_year.toLowerCase() === updatedValues.academic_year.trim().toLowerCase() && semester.id !== id
            ) || archivedData.some(semester => 
                semester.academic_year.toLowerCase() === updatedValues.academic_year.trim().toLowerCase() && semester.id !== id
            );

            if (duplicate) {
                message.error('An academic year with this name already exists.');
                setLoading(false);
                return; // Prevent further execution
            }

            const response = await axios.put(`/api/semesteracademicyear/${id}`, updatedValues, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the specific record in active or archived data
            const updatedRecord = response.data.semesterAcademicYear;
            if (updatedRecord.deleted_at) {
                // If updated to archived
                setData(data.filter(semester => semester.id !== id));
                setArchivedData([...archivedData, updatedRecord]);
            } else {
                // If updated to active
                setArchivedData(archivedData.filter(semester => semester.id !== id));
                setData([...data, updatedRecord]);
            }

            setIsEditModalVisible(false);
            message.success('Semester Academic Year updated successfully');
            reloadData();
        } catch (error) {
            console.error('Failed to update Semester Academic Year:', error);
            message.error('Failed to update Semester Academic Year.');
        } finally {
            setLoading(false); // End loading
        }
    };

    // **Print functionality**
    const printTable = () => {
        const printWindow = window.open('', '', 'height=650, width=900');
        if (!printWindow) return; // If popup blocked

        printWindow.document.write('<html><head><title>Semester Academic Year Table</title></head><body>');
        printWindow.document.write('<h2>Semester Academic Year Table</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">');
        printWindow.document.write('<thead><tr><th>Academic Year</th><th>Semester Period</th><th>Status</th><th>Created At</th><th>Updated At</th><th>Deleted At</th></tr></thead>');
        printWindow.document.write('<tbody>');
        filteredData.forEach((item) => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${item.academic_year ?? ''}</td>`);
            printWindow.document.write(`<td>${item.semester_period ?? ''}</td>`);
            printWindow.document.write(`<td>${item.status === 1 ? 'Active' : 'Inactive'}</td>`);
            const createdAtValue = item.created_at ? new Date(item.created_at).toLocaleString() : '';
            const updatedAtValue = item.updated_at ? new Date(item.updated_at).toLocaleString() : '';
            const deletedAtValue = item.deleted_at ? new Date(item.deleted_at).toLocaleString() : 'N/A';
            printWindow.document.write(`<td>${createdAtValue}</td>`);
            printWindow.document.write(`<td>${updatedAtValue}</td>`);
            printWindow.document.write(`<td>${deletedAtValue}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody>');
        printWindow.document.write('</table>');
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
        <Spin spinning={loading} tip="Loading...">
            <div style={{ padding: '20px', background: '#fff' }}>
                <div style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap', // Allow wrapping when screen size reduces
                }}>
                    {/* Search and Buttons container */}
                    <Space wrap style={{ display: 'flex', gap: '10px' }}>
                        <Input.Search
                            value={searchValue}
                            placeholder="Search by Academic Year"
                            style={{ minWidth: '200px', maxWidth: '300px' }}
                            onSearch={handleSearch}
                            onChange={(e) => setSearchValue(e.target.value)}
                            allowClear
                        />
                        <Button icon={<FileTextOutlined />} onClick={printTable} disabled={loading}>
                            Print
                        </Button>
                        <Button
                            icon={<UnorderedListOutlined />}
                            onClick={() => setShowArchived(!showArchived)}
                            disabled={loading}
                        >
                            {showArchived ? 'Show Active Academic Years' : 'Show Archived Academic Years'}
                        </Button>
                    </Space>

                    {/* Action buttons container */}
                    <Space wrap style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateModalVisible(true)}
                            disabled={loading}
                        >
                            Create New Academic Year
                        </Button>
                        <Button
                            danger
                            disabled={selectedRowKeys.length === 0 || loading} // Disable if no rows are selected or loading
                            onClick={handleDeleteSelected}
                        >
                            Remove Selected Academic Years
                        </Button>
                        {showArchived && (
                            <Button
                                disabled={selectedRowKeys.length === 0 || loading} // Disable if no rows are selected or loading
                                onClick={handleRestoreSelected}
                            >
                                Restore Selected Academic Years
                            </Button>
                        )}
                    </Space>
                </div>
                <SemesterAcademicYearTable
                    rowSelection={rowSelection}
                    data={filteredData}
                    setIsEditModalVisible={setIsEditModalVisible}
                    setModalData={setModalData}
                    handleDeleteSemesterAcademicYear={handleDeleteSemesterAcademicYear}
                    reloadData={reloadData}
                    showArchived={showArchived} // Pass the showArchived prop
                    handleStatusChange={handleStatusChange} // Pass the handleStatusChange function
                    loading={loading} // Pass the loading state
                />
                <SemesterAcademicYearModal
                   isEditModalVisible={isEditModalVisible}
                   setIsEditModalVisible={setIsEditModalVisible}
                   isCreateModalVisible={isCreateModalVisible}
                   setIsCreateModalVisible={setIsCreateModalVisible}
                   data={[...data, ...archivedData]} // Pass combined data for duplicate checks
                   setData={setData}
                   modalData={modalData}
                   setModalData={setModalData}
                   academicYears={academicYears}   // Pass academicYears
                   semesters={semesters}           // Pass semesters
                   handleCreateSemesterAcademicYear={handleCreateSemesterAcademicYear} // Pass create handler
                   handleEditSemesterAcademicYear={handleEditSemesterAcademicYear} // Pass edit handler
                   reloadData={reloadData}
                   loading={loading} // Pass the loading state
                />
            </div>
        </Spin>
    )};

    export default SemesterAcademicYearPage;
