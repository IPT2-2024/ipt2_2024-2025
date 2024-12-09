
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import moment from 'moment'; 
import SemestralPeriodTable from './components/SemestralPeriodTable';
import SemestralPeriodModal from './components/SemestralPeriodModal';
//import { semestralPeriodData } from './components/SemestralPeriodData'; // Replace with your initial semestral period data

const { Text } = Typography;

const SemestralPeriodPage = () => {
    const [data, setData] = useState([]); 
    const [archivedData, setArchivedData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); 
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(period =>
            period.semester_period.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    
    const authToken = localStorage.getItem('auth_token');

    const fetchSemesters = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/semester', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    deleted: showArchived ? 'true' : 'false', 
                },
            });

            
            const activeData = response.data.filter(semester => !semester.deleted_at);
            const archivedData = response.data.filter(semester => semester.deleted_at);

            
            setData(activeData);
            setArchivedData(archivedData);

            
            const filtered = (showArchived ? archivedData : activeData).filter(semester =>
                semester.semester_period.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);

        } catch (error) {
            message.error('Error fetching semesters: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, [showArchived, searchValue]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleCreateSemester = async (values) => {
        try {
            const token = localStorage.getItem('auth_token');

            const response = await axios.post('/api/semester', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData((prevData) => [...prevData, response.data.semester]); 
            message.success('Semester Period created successfully');
            setIsCreateModalVisible(false); 
        } catch (error) {
            message.error('Failed to create Semester Period: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteSemester = async (id) => {
        const authToken = localStorage.getItem('auth_token'); 

        try {
            
            await axios.delete(`/api/semester/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            
            setData((prevData) => prevData.filter((semester) => semester.id !== id));
            message.success('Semester deleted successfully');
        } catch (error) {
            message.error('Failed to delete semester');
        }
    };

    const handleDeleteSelected = async () => {
        const authToken = localStorage.getItem('auth_token'); 

        try {
            
            const deletePromises = selectedRowKeys.map((id) => {
                return axios.delete(`/api/semester/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, 
                    },
                });
            });

            
            await Promise.all(deletePromises);

            
            fetchSemesters();

            message.success(`${selectedRowKeys.length} Semester(s) deleted.`);
        } catch (error) {
            message.error('Failed to delete semesters: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); 
        }
    };

    const handleEditSemester = async (id, values) => {
        try {
            const token = localStorage.getItem('auth_token');

            const response = await axios.put(`/api/semester/${id}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedData = data.map((semester) =>
                semester.id === id ? { ...semester, ...response.data.semester } : semester
            );
            setData(updatedData); 
            message.success('Semester Period updated successfully');
            setIsEditModalVisible(false); 
        } catch (error) {
            message.error('Failed to update Semester Period: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRestoreSemester = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            
            const response = await axios.post(`/api/semester/${id}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            
            fetchSemesters(); 
            message.success('Semester restored successfully.');
        } catch (error) {
            message.error('Failed to restore semester: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreSelected = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            
            const restorePromises = selectedRowKeys.map((id) => {
                return axios.post(`/api/semester/${id}/restore`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
            });

            
            await Promise.all(restorePromises);

            
            fetchSemesters();

            message.success(`${selectedRowKeys.length} Semester(s) restored.`);
        } catch (error) {
            message.error('Failed to restore semesters: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); 
            setLoading(false);
        }
    };

    
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=1300');
        printWindow.document.write('<html><head><title>Semester Periods</title>');
        
        printWindow.document.write(`
            <style>
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
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>Semester Periods</h2>');
        printWindow.document.write('<table>');
        printWindow.document.write('<thead><tr>');
        
        printWindow.document.write('<th>Semester Period</th><th>Created At</th><th>Updated At</th>');
        if (showArchived) {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        
        filteredData.forEach(semester => {
            printWindow.document.write('<tr>');
            // printWindow.document.write(`<td>${semester.id ?? ''}</td>`);
            printWindow.document.write(`<td>${semester.semester_period ?? ''}</td>`);
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
            }}>
                {}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by semester period"
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} onClick={handlePrint}>
                        Print
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Semesters' : 'Show Archived Semesters'}
                    </Button>
                </Space>

                {}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)} 
                    >
                        Create New Semester Period
                    </Button>
                    {!showArchived && (
                        <Button
                            danger
                            disabled={selectedRowKeys.length === 0} 
                        >
                            <Popconfirm
                                title="Are you sure to delete the selected semesters?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                Remove Selected Semesters
                            </Popconfirm>
                        </Button>
                    )}
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} 
                        >
                            <Popconfirm
                                title="Are you sure to restore the selected semesters?"
                                onConfirm={handleRestoreSelected} 
                                okText="Yes"
                                cancelText="No"
                            >
                                Restore Selected Semesters
                            </Popconfirm>
                        </Button>
                    )}
                </Space>
            </div>
            <SemestralPeriodTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSemester={handleDeleteSemester}
                handleRestoreSemester={handleRestoreSemester}
                handleDeleteSelected={handleDeleteSelected}
                handleRestoreSelected={handleRestoreSelected}
                loading={loading} 
            />
            <SemestralPeriodModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateSemester={handleCreateSemester}
                handleEditSemester={handleEditSemester}
            />
            {}
            {/* {error && <Text type="danger">{error}</Text>} */}
        </div>
    );
};

export default SemestralPeriodPage;
