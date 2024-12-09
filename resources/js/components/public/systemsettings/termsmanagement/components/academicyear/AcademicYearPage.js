
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import AcademicYearTable from './components/AcademicYearTable';
import AcademicYearModal from './components/AcademicYearModal';

const { Text } = Typography;

const AcademicYearPage = () => {
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

    
    const fetchAcademicYears = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/academicyear', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const academicYears = response.data;
            const activeAcademicYears = academicYears.filter(year => !year.isArchived);
            const archivedAcademicYears = academicYears.filter(year => year.isArchived);

            setData(activeAcademicYears);
            setArchivedData(archivedAcademicYears);

            
            setFilteredData(showArchived ? archivedAcademicYears : activeAcademicYears);
            setCurrentPage(1); 
        } catch (err) {
            console.error('Error fetching academic years:', err);
            setError('Failed to fetch academic year data.');
            message.error('Failed to fetch academic year data.');
        } finally {
            setLoading(false);
        }
    };

    
    const fetchArchivedAcademicYears = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/academicyear?deleted=only', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedAcademicYears = response.data.map(year => ({
                ...year,
                isArchived: true,
            }));

            setArchivedData(archivedAcademicYears);

            if (showArchived) {
                setFilteredData(archivedAcademicYears);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived academic years:', err);
            setError('Failed to fetch archived academic years.');
            message.error('Failed to fetch archived academic years.');
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchAcademicYears();
    }, []);

    
    useEffect(() => {
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(year =>
            String(year.academic_year || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); 
    }, [searchValue, data, archivedData, showArchived]);

    
    useEffect(() => {
        if (showArchived) {
            fetchArchivedAcademicYears();
        } else {
            fetchAcademicYears();
        }
    }, [showArchived]);

    

    
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    
    const handleDeleteAcademicYear = async (id) => {
        setError(null); 
        try {
            await axios.delete(`/api/academicyear/${id}`, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const academicYearToDelete = data.find(year => year.id === id);
            if (academicYearToDelete) {
                setData(data.filter(year => year.id !== id));
                setArchivedData([...archivedData, { ...academicYearToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
                message.success('Academic year archived successfully');
            }
        } catch (error) {
            console.error('Error archiving academic year:', error);
            setError('Failed to archive academic year.');
            message.error('Failed to archive academic year.');
        }
    };

    
    const handleDeleteSelected = async () => {
        const selectedYears = data.filter(year => selectedRowKeys.includes(year.id));
        if (selectedYears.length === 0) return;

        setError(null); 
        try {
            await Promise.all(
                selectedYears.map(year =>
                    axios.delete(`/api/academicyear/${year.id}`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedYears.map(year => ({ ...year, isArchived: true, deleted_at: now }));
            const remainingYears = data.filter(year => !selectedRowKeys.includes(year.id));

            setData(remainingYears);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedYears.length} academic year(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected academic years:', error);
            setError('Failed to archive selected academic years.');
            message.error('Failed to archive selected academic years.');
        }
    };

    
    const handleRestoreAcademicYear = async (id) => {
        setError(null); 
        try {
            await axios.post(`/api/academicyear/${id}/restore`, {}, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            const academicYearToRestore = archivedData.find(year => year.id === id);
            if (academicYearToRestore) {
                const updatedArchived = archivedData.filter(year => year.id !== id);
                const restoredAcademicYear = { ...academicYearToRestore, isArchived: false };
                delete restoredAcademicYear.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredAcademicYear]);
                message.success('Academic year restored successfully');
            }
        } catch (error) {
            console.error('Error restoring academic year:', error);
            setError('Failed to restore academic year.');
            message.error('Failed to restore academic year.');
        }
    };

    
    const handleRestoreSelected = async () => {
        const selectedYears = archivedData.filter(year => selectedRowKeys.includes(year.id));
        if (selectedYears.length === 0) return;

        setError(null); 
        try {
            await Promise.all(
                selectedYears.map(year =>
                    axios.post(`/api/academicyear/${year.id}/restore`, {}, { 
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedYears = archivedData.filter(year => !selectedRowKeys.includes(year.id));
            const restoredYears = selectedYears.map(year => {
                const { deleted_at, ...rest } = year;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedYears);
            setData([...data, ...restoredYears]);
            setSelectedRowKeys([]);
            message.success(`${selectedYears.length} academic year(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring academic years:', error);
            setError('Failed to restore academic years.');
            message.error('Failed to restore academic years.');
        }
    };

    
    const handleCreateAcademicYear = async (yearData) => {
        setError(null); 
        
        const duplicate = data.some(year => year.academic_year.toLowerCase() === yearData.academic_year.toLowerCase()) ||
                          archivedData.some(year => year.academic_year.toLowerCase() === yearData.academic_year.toLowerCase());

        if (duplicate) {
            message.error('This Academic Year already exists.');
            return;
        }

        try {
            const response = await axios.post('/api/academicyear', yearData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newAcademicYear = response.data; 

            message.success('New academic year created successfully');
            setIsCreateModalVisible(false);

            
            fetchAcademicYears();
        } catch (error) {
            console.error('Error creating academic year:', error);
            if (error.response && error.response.status === 409) { 
                message.error('This Academic Year already exists.');
            } else {
                setError('Failed to create academic year.');
                message.error('Failed to create academic year.');
            }
        }
    };

    
    const handleEditAcademicYear = async (id, updatedData) => {
        setError(null); 
        
        const duplicate = data.some(year => 
            year.academic_year.toLowerCase() === updatedData.academic_year.toLowerCase() && year.id !== id
        ) ||
        archivedData.some(year => 
            year.academic_year.toLowerCase() === updatedData.academic_year.toLowerCase() && year.id !== id
        );

        if (duplicate) {
            message.error('This Academic Year already exists.');
            return;
        }

        try {
            await axios.put(`/api/academicyear/${id}`, updatedData, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const updatedAcademicYears = data.map(year => 
                year.id === id ? { ...year, ...updatedData, updated_at: new Date().toISOString() } : year
            );
            setData(updatedAcademicYears);
            setIsEditModalVisible(false);
            message.success('Academic year updated successfully');
        } catch (error) {
            console.error('Error updating academic year:', error);
            if (error.response && error.response.status === 409) { 
                message.error('This Academic Year already exists.');
            } else {
                setError('Failed to update academic year.');
                message.error('Failed to update academic year.');
            }
        }
    };

    
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        printWindow.document.write('<html><head><title>Academic Year Table</title></head><body>');
        printWindow.document.write('<h2>Academic Year Data</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
        printWindow.document.write('<thead><tr><th>Academic Year</th>');
        if (!showArchived) {
            printWindow.document.write('<th>Created At</th><th>Updated At</th>');
        } else {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');

        filteredData.forEach(year => {
            printWindow.document.write('<tr>');
            // printWindow.document.write(`<td>${year.id ?? ''}</td>`);
            printWindow.document.write(`<td>${year.academic_year ?? ''}</td>`);
            if (!showArchived) {
                printWindow.document.write(`<td>${year.created_at ? new Date(year.created_at).toLocaleString() : ''}</td>`);
                printWindow.document.write(`<td>${year.updated_at ? new Date(year.updated_at).toLocaleString() : ''}</td>`);
            } else {
                printWindow.document.write(`<td>${year.deleted_at ? new Date(year.deleted_at).toLocaleString() : ''}</td>`);
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
                        placeholder="Search by academic year"
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
                        {showArchived ? 'Show Active Academic Years' : 'Show Archived Academic Years'}
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
                                Create New Academic Year
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected academic years?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Remove Selected Academic Years
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected academic years?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Academic Years
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            {}
            <AcademicYearTable
                rowSelection={rowSelectionConfig}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteAcademicYear={handleDeleteAcademicYear}
                handleRestoreAcademicYear={handleRestoreAcademicYear} 
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading}
            />
            {}
            <AcademicYearModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateAcademicYear={handleCreateAcademicYear} 
                handleEditAcademicYear={handleEditAcademicYear}     
                existingAcademicYears={[...data, ...archivedData]} 
            />
            {}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default AcademicYearPage;