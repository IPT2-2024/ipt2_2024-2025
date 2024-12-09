import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, message, Typography, Popconfirm } from 'antd';
import { PlusOutlined, FileTextOutlined, UnorderedListOutlined } from '@ant-design/icons';
import RoomTagsTable from './components/RoomTagsTable';
import RoomTagsModal from './components/RoomTagsModal';
import { generatePrintHTML } from './components/printUtils';

const { Text } = Typography;

const RoomTagsPage = () => {
    const [data, setData] = useState([]); 
    const [archivedData, setArchivedData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showArchived, setShowArchived] = useState(false); 
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const [loading, setLoading] = useState(false);
    const pageSize = 5;

    const token = localStorage.getItem('auth_token'); 

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/roomtag', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const roomTags = response.data.map(tag => ({
                ...tag,
                isArchived: false,
            }));

            setData(roomTags);
            if (!showArchived) {
                setFilteredData(roomTags);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Error fetching room tags:', error);
            message.error('Failed to load active room tags.');
        }  finally {
            setLoading(false);
        }
    };

    const fetchArchivedData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/roomtag?deleted=only', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const archivedTags = response.data.map(tag => ({
                ...tag,
                isArchived: true,
            }));
            
            setArchivedData(archivedTags);
            if (showArchived) {
                setFilteredData(archivedTags);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Error fetching archived room tags:', error);
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const currentList = showArchived ? archivedData : data;
        const filtered = currentList.filter(tag =>
            tag.room_tag && tag.room_tag.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    useEffect(() => {
        if (showArchived) {
            fetchArchivedData();
        } else {
            fetchData();
        }
        
    }, [showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleDeleteRoomTag = async (id) => {
        const tagToDelete = data.find(tag => tag.id === id);
        if (!tagToDelete) return;

        try {
            await axios.delete(`/api/roomtag/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            
            const deletedTag = { ...tagToDelete, isArchived: true, deleted_at: new Date().toISOString() };
            setData(data.filter(tag => tag.id !== id));
            setArchivedData([...archivedData, deletedTag]);
            message.success('Room tag archived successfully');
        } catch (error) {
            console.error('Error deleting room tag:', error);
            message.error('Failed to archive room tag.');
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedRowKeys.length === 0) return;
        const selectedTags = data.filter(tag => selectedRowKeys.includes(tag.id));
        
        try {
            await Promise.all(
                selectedTags.map((tag) =>
                    axios.delete(`/api/roomtag/${tag.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedTags = selectedTags.map(tag => ({ ...tag, isArchived: true, deleted_at: now }));
            const remainingTags = data.filter(tag => !selectedRowKeys.includes(tag.id));

            setData(remainingTags);
            setArchivedData([...archivedData, ...archivedTags]);
            setSelectedRowKeys([]);
            message.success(`${selectedTags.length} room tag(s) archived successfully`);
        } catch (error) {
            console.error('Error deleting selected room tags:', error);
            message.error('Failed to archive selected room tags.');
        }
    };

    const handleRestoreRoomTag = async (id) => {
        try {
            await axios.post(`/api/roomtag/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const tagToRestore = archivedData.find(tag => tag.id === id);
            if (tagToRestore) {
                const updatedArchived = archivedData.filter(tag => tag.id !== id);
                const restoredTag = { ...tagToRestore, isArchived: false };
                delete restoredTag.deleted_at; 
                setArchivedData(updatedArchived);
                setData([...data, restoredTag]);
                message.success('Room tag restored successfully');
            }
        } catch (error) {
            console.error('Error restoring room tag:', error);
            message.error('Failed to restore room tag.');
        }
    };

    const handleRestoreSelected = async () => {
        const selectedTags = archivedData.filter(tag => selectedRowKeys.includes(tag.id));
        if (selectedTags.length === 0) return;

        try {
            
            await Promise.all(
                selectedTags.map(tag =>
                    axios.post(`/api/roomtag/${tag.id}/restore`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedTags = archivedData.filter(tag => !selectedRowKeys.includes(tag.id));
            const restoredTags = selectedTags.map(tag => {
                const { deleted_at, ...rest } = tag;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedTags);
            setData([...data, ...restoredTags]);
            setSelectedRowKeys([]);
            message.success(`${selectedTags.length} room tag(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring room tags:', error);
            message.error('Failed to restore room tags.');
        }
    };

    const handleCreateRoomTag = () => {
        setIsCreateModalVisible(true);
    };

    const handlePrint = () => {
        const tableHTML = generatePrintHTML(filteredData);
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(tableHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by room tag"
                        style={{ width: '100%', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} onClick={handlePrint}>Print</Button>
                    <Button 
                        icon={<UnorderedListOutlined />} 
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Room Tags' : 'Show Archived Room Tags'}
                    </Button>
                </Space>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {!showArchived && (
                        <>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                onClick={handleCreateRoomTag}
                            >
                                Create New Room Tag
                            </Button>
                            <Popconfirm
                        title="Are you sure you want to delete the selected roomtags?"
                        onConfirm={handleDeleteSelected}
                        okText="Yes"
                        cancelText="No"
                    >
                            <Button
                                danger
                                disabled={selectedRowKeys.length === 0}
                            >
                                Remove Selected Room Tags
                            </Button>
                            </Popconfirm>
                        </>
                        
                    )}

                    {showArchived && (
                         <Popconfirm
                         title="Are you sure you want to restore the selected roon tags?"
                         onConfirm={handleRestoreSelected}
                         okText="Yes"
                         cancelText="No"
                     >
                        <Button
                            type="default"
                            disabled={selectedRowKeys.length === 0}
                        >
                            Restore Selected Room Tags
                        </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>

            <RoomTagsTable
                rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
                data={filteredData}
                handleDeleteRoomTag={handleDeleteRoomTag}
                handleRestoreRoomTag={handleRestoreRoomTag} 
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading} 
            />

            <RoomTagsModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                fetchData={fetchData} 
            />
        </div>
    );
};

export default RoomTagsPage;
