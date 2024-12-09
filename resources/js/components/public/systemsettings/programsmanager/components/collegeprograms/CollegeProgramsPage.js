import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import CollegeProgramsTable from './components/CollegeProgramsTable';
import CollegeProgramsModal from './components/CollegeProgramsModal';

const { Text } = Typography;

const CollegeProgramsPage = () => {
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

    
    useEffect(() => {
        fetchCollegePrograms();
    }, []);

    
    useEffect(() => {
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(program =>
            String(program.college_programs || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); 
    }, [searchValue, data, archivedData, showArchived]);

    
    useEffect(() => {
        if (showArchived) {
            fetchArchivedCollegePrograms();
        } else {
            fetchCollegePrograms();
        }
    }, [showArchived]);

    

    
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    
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
        } catch (error) {
            console.error('Error archiving college program:', error);
            setError('Failed to archive college program.');
            message.error('Failed to archive college program.');
        }
    };

    
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
        } catch (error) {
            console.error('Error archiving selected college programs:', error);
            setError('Failed to archive selected college programs.');
            message.error('Failed to archive selected college programs.');
        }
    };

    
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
        } catch (error) {
            console.error('Error restoring college program:', error);
            setError('Failed to restore college program.');
            message.error('Failed to restore college program.');
        }
    };

    
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
        } catch (error) {
            console.error('Error restoring college programs:', error);
            setError('Failed to restore college programs.');
            message.error('Failed to restore college programs.');
        }
    };

    
    const handleCreateCollegeProgram = async (programData) => {
        setError(null); 
        try {
            const response = await axios.post('/api/collegeprogram', programData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newProgram = response.data; 

            message.success('New college program created successfully');
            setIsCreateModalVisible(false);

            
            fetchCollegePrograms();
        } catch (error) {
            console.error('Error creating college program:', error);
            setError('Failed to create college program.');
            message.error('Failed to create college program.');
        }
    };

    
    const handleEditCollegeProgram = async (id, updatedData) => {
        setError(null); 
        try {
            await axios.put(`/api/collegeprogram/${id}`, updatedData, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const updatedPrograms = data.map(program => 
                program.id === id ? { ...program, ...updatedData, updated_at: new Date().toISOString() } : program
            );
            setData(updatedPrograms);
            setIsEditModalVisible(false);
            message.success('College program updated successfully');
        } catch (error) {
            console.error('Error updating college program:', error);
            setError('Failed to update college program.');
            message.error('Failed to update college program.');
        }
    };

    
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
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
    };

    
    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            {}
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
                        title="Are you sure you want to delete the selected year levels?"
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
                        title="Are you sure you want to restore the selected year levels?"
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
            {}
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
            {}
            <CollegeProgramsModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateCollegeProgram={handleCreateCollegeProgram} 
                handleEditCollegeProgram={handleEditCollegeProgram}    
            />
            {}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default CollegeProgramsPage;

