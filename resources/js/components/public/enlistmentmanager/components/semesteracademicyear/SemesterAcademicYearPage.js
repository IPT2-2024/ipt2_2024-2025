// SemesterAcademicYearPage.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Modal } from 'antd';
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
    const [loading, setLoading] = useState(false);
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
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.error('No token found');
                message.error('Authorization token is missing');
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
            }
        };

        fetchData();
    }, []);

    // **Handle Status Change: Ensure Only One Active Record**
    const handleStatusChange = async (id, checked) => {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
            message.error('Authorization token is missing');
            setLoading(false);
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
            setLoading(false);
        }
    };

    // **Fetch Semester Academic Years and Segregate Active/Archived**
    const fetchSemesterAcademicYears = async () => {
        const token = localStorage.getItem('auth_token'); // Retrieve auth_token from localStorage

        if (!token) {
            console.error('No token found');
            message.error('Authorization token is missing');
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
                const semesterToDelete = data.find(semester => semester.id === id);
                if (semesterToDelete) {
                    const deletedAt = new Date().toISOString(); // Get current timestamp
                    setData(data.filter(semester => semester.id !== id)); // Remove from active data
                    setArchivedData([...archivedData, { ...semesterToDelete, isArchived: true, deleted_at: deletedAt }]); // Add to archived data with deleted_at
                    message.success('Semester Academic Year archived successfully');
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
            onOk: () => {
                const selectedSemesters = data.filter(semester => selectedRowKeys.includes(semester.id));
                const remainingSemesters = data.filter(semester => !selectedRowKeys.includes(semester.id));

                const deletedAt = new Date().toISOString(); // Get current timestamp
                setData(remainingSemesters); // Remove selected from active data
                setArchivedData([...archivedData, ...selectedSemesters.map(semester => ({ ...semester, isArchived: true, deleted_at: deletedAt }))]); // Archive selected with deleted_at
                setSelectedRowKeys([]); // Clear selected keys

                message.success(`${selectedSemesters.length} semester(s) archived successfully`);
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
            onOk: () => {
                const selectedSemesters = archivedData.filter(semester => selectedRowKeys.includes(semester.id));
                const remainingArchivedSemesters = archivedData.filter(semester => !selectedRowKeys.includes(semester.id));

                setArchivedData(remainingArchivedSemesters); // Remove selected from archived data
                setData([...data, ...selectedSemesters.map(semester => ({ ...semester, isArchived: false, deleted_at: null }))]); // Add back to active data
                setSelectedRowKeys([]); // Clear selected keys

                message.success(`${selectedSemesters.length} semester(s) restored successfully`);
            },
        });
    };

    // **Handle Create New Academic Year**
    const handleCreateSemesterAcademicYear = () => {
        setIsCreateModalVisible(true); // Show the Create Modal
    };    

    // **Row Selection Configuration**
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
                flexWrap: 'wrap', // Allow wrapping when screen size reduces
            }}>
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by academic year"
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />}>Print</Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Academic Years' : 'Show Archived Academic Years'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateSemesterAcademicYear}
                    >
                        Create New Academic Year
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Academic Years
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
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
                setData={setData}
                reloadData={reloadData}
                showArchived={showArchived} // Pass the showArchived prop
                handleStatusChange={handleStatusChange} // Pass the handleStatusChange function
            />
            <SemesterAcademicYearModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                academicYears={academicYears}   // Pass academicYears
                semesters={semesters}           // Pass semesters
                reloadData={reloadData}
            />
        </div>
    )};

    export default SemesterAcademicYearPage;
