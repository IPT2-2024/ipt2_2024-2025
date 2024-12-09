import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm  } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import FloorTable from './components/FloorTable';
import FloorModal from './components/FloorModal';

const { Text } = Typography;

const FloorPage = () => {
    const [data, setData] = useState([]); 
    const [archivedData, setArchivedData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const token = localStorage.getItem('auth_token'); 


    const fetchFloors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/floor', {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            const floors = response.data;
            const activeFloors = floors.filter(floor => !floor.isArchived);
            const archivedFloors = floors.filter(floor => floor.isArchived);

            setData(activeFloors);
            setArchivedData(archivedFloors);

            if (showArchived) {
                setFilteredData(archivedFloors);
            } else {
                setFilteredData(activeFloors);
            }
            setCurrentPage(1);
        } catch (err) {
            console.error('Error fetching floors:', err);
            setError('Failed to fetch floor data.');
            message.error('Failed to fetch floor data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchArchivedData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/floor?deleted=only`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const archivedFloors = response.data.map(floor => ({
                ...floor,
                isArchived: true,
            }));

            setArchivedData(archivedFloors);
            if (showArchived) {
                setFilteredData(archivedFloors);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Error fetching archived floors:', error);
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        fetchFloors();
    }, []);

    useEffect(() => {
        
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(floor =>
            String(floor.floor_level || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    useEffect(() => {
        
        if (showArchived) {
            fetchArchivedData();
        } else {
            fetchFloors();
        }
    }, [showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleDeleteFloor = async (id) => {
        const floorToDelete = data.find(floor => floor.id === id);
        if (!floorToDelete) return;

        try {
            await axios.delete(`/api/floor/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(data.filter(floor => floor.id !== id));
            setArchivedData([...archivedData, { ...floorToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
            message.success('Floor archived successfully');
        } catch (error) {
            console.error('Error archiving floor:', error);
            message.error('Failed to archive floor.');
        }
    };

    const handleDeleteSelected = async () => {
        const selectedFloors = data.filter(floor => selectedRowKeys.includes(floor.id));
        if (selectedFloors.length === 0) return;

        try {
            await Promise.all(
                selectedFloors.map(floor =>
                    axios.delete(`/api/floor/${floor.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedFloors.map(floor => ({ ...floor, isArchived: true, deleted_at: now }));
            const remainingFloors = data.filter(floor => !selectedRowKeys.includes(floor.id));

            setData(remainingFloors);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedFloors.length} floor(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected floors:', error);
            message.error('Failed to archive selected floors.');
        }
    };

    const handleRestoreSelected = async () => {
        const selectedFloors = archivedData.filter(floor => selectedRowKeys.includes(floor.id));
        if (selectedFloors.length === 0) return;

        try {
            await Promise.all(
                selectedFloors.map(floor =>
                    axios.post(`/api/floor/${floor.id}/restore`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedFloors = archivedData.filter(floor => !selectedRowKeys.includes(floor.id));
            const restoredFloors = selectedFloors.map(floor => {
                const { deleted_at, ...rest } = floor;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedFloors);
            setData([...data, ...restoredFloors]);
            setSelectedRowKeys([]);
            message.success(`${selectedFloors.length} floor(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring floors:', error);
            message.error('Failed to restore floors.');
        }
    };

    const handleRestoreFloor = async (id) => {
        try {
            await axios.post(`/api/floor/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const floorToRestore = archivedData.find(floor => floor.id === id);
            if (floorToRestore) {
                const updatedArchived = archivedData.filter(floor => floor.id !== id);
                const restoredFloor = { ...floorToRestore, isArchived: false };
                delete restoredFloor.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredFloor]);
                message.success('Floor restored successfully');
            }
        } catch (error) {
            console.error('Error restoring floor:', error);
            message.error('Failed to restore floor.');
        }
    };

    const handleCreateFloor = async (floorData) => {
        try {
            await axios.post('/api/floor', floorData, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            message.success('New floor created successfully');
            setIsCreateModalVisible(false);
            setIsEditModalVisible(false);

            if (showArchived) {
                fetchArchivedData();
            } else {
                fetchFloors();
            }
        } catch (error) {
            console.error('Error creating floor:', error);
            message.error('Failed to create floor.');
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        
        // Format Date function
        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            const options = {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            };
            return d.toLocaleString('en-US', options);
        };
    
        printWindow.document.write('<html><head><title>Floor Table</title></head><body>');
        printWindow.document.write('<h2>Floor Data</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
        printWindow.document.write('<thead><tr><th>Floor Level</th>');
        
        if (!showArchived) {
            printWindow.document.write('<th>Created At</th><th>Updated At</th>');
        } else {
            printWindow.document.write('<th>Deleted At</th>');
        }
        printWindow.document.write('</tr></thead><tbody>');
    
        filteredData.forEach(floor => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${floor.floor_level ?? ''}</td>`);
            
            if (!showArchived) {
                printWindow.document.write(`<td>${formatDate(floor.created_at)}</td>`);
                printWindow.document.write(`<td>${formatDate(floor.updated_at)}</td>`);
            } else {
                printWindow.document.write(`<td>${formatDate(floor.deleted_at)}</td>`);
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
            <div
                style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}
            >
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by floor level"
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
                        {showArchived ? 'Show Active Floors' : 'Show Archived Floors'}
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
                                Create New Floor
                            </Button>
                            <Popconfirm
                        title="Are you sure you want to delete the selected floors?"
                        onConfirm={handleDeleteSelected}
                        okText="Yes"
                        cancelText="No"
                    >
                            <Button
                                danger
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Remove Selected Floors
                            </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                         <Popconfirm
                         title="Are you sure you want to restore the selected floors?"
                         onConfirm={handleRestoreSelected}
                         okText="Yes"
                         cancelText="No"
                     >
                        <Button
                            disabled={selectedRowKeys.length === 0}
                            style={{ width: '100%' }}
                        >
                            Restore Selected Floors
                        </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            <FloorTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteFloor={handleDeleteFloor}
                handleRestoreFloor={handleRestoreFloor} 
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                loading={loading} 
                showArchived={showArchived}
            />
            <FloorModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateFloor={handleCreateFloor}
            />
            {error && <Text type="danger">{error}</Text>}
        </div>
    );
};

export default FloorPage;
