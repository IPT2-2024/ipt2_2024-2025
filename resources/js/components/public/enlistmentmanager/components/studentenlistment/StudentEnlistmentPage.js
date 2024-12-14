import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import StudentEnlistmentTable from './components/StudentEnlistmentTable'; // Replace with your student enlistment table component
import StudentEnlistmentModal from './components/StudentEnlistmentModal'; // Replace with your student enlistment modal component
import axios from 'axios';

const { Text } = Typography;

const StudentEnlistmentPage = () => {
    const [data, setData] = useState([]); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = data.filter((item) => {
            const isArchived = item.status === 'Archived';
            const profileId = item.profile_id ? String(item.profile_id) : '';
            const matchesSearch = profileId.toLowerCase().includes(searchValue.toLowerCase());
    
            return matchesSearch && (showArchived ? isArchived : !isArchived);
        });
    
        setFilteredData(filtered);
    }, [searchValue, data, showArchived]);
    
    
    

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const fetchData = async () => {
        setLoading(true); // Start the loading spinner
        try {
            // Retrieve the token from local storage
            const authToken = localStorage.getItem('auth_token');
            
            // Axios GET request with Authorization header
            const response = await axios.get('/api/enlistments', {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Attach token as Bearer
                },
            });
    
            // Set data if the request is successful
            setData(response.data);
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                message.error(`Failed to fetch enlistments: ${error.response.status} - ${error.response.data.message || 'Error'}`);
            } else if (error.request) {
                // No response received
                message.error('Failed to fetch enlistments: No response from server');
            } else {
                // Something else went wrong in setting up the request
                message.error(`Failed to fetch enlistments: ${error.message}`);
            }
        } finally {
            setLoading(false); // Stop the spinner
        }
    };
    
    // Fetch the data on component mount
    useEffect(() => {
        fetchData();
    }, []);
    

  
    const handleDeleteStudentEnlistment = (id) => {
        const studentToDelete = data.find(student => student.id === id);
        if (studentToDelete) {
            setData(data.filter(student => student.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...studentToDelete, isArchived: true }]); // Add to archived data
            message.success('Student enlistment archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedStudents = data.filter(student => selectedRowKeys.includes(student.id));
        const remainingStudents = data.filter(student => !selectedRowKeys.includes(student.id));

        setData(remainingStudents); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedStudents.map(student => ({ ...student, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedStudents.length} student(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedStudents = archivedData.filter(student => selectedRowKeys.includes(student.id));
        const remainingArchivedStudents = archivedData.filter(student => !selectedRowKeys.includes(student.id));

        setArchivedData(remainingArchivedStudents); // Remove selected from archived data
        setData([...data, ...selectedStudents.map(student => ({ ...student, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedStudents.length} student(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateStudentEnlistment = () => {
        setIsCreateModalVisible(true); // Show the Create Student Enlistment Modal
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
                flexWrap: 'wrap', // Allow wrapping when screen size reduces
            }}>
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by student name"
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
                        {showArchived ? 'Show Active Enlistments' : 'Show Archived Enlistments'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateStudentEnlistment}
                    >
                        Create New Enlistment
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Enlistments
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Enlistments
                        </Button>
                    )}
                </Space>
            </div>
            <StudentEnlistmentTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteStudentEnlistment={handleDeleteStudentEnlistment}
            />
            <StudentEnlistmentModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
            />
        </div>
    );
};

export default StudentEnlistmentPage;
