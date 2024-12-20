// RoomTagsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, message, Typography, Popconfirm } from 'antd';
import { PlusOutlined, FileTextOutlined, UnorderedListOutlined } from '@ant-design/icons';
import RoomTagsTable from './components/RoomTagsTable';
import RoomTagsModal from './components/RoomTagsModal';
import { generatePrintHTML } from './components/printUtils';
import { debounce } from 'lodash'; // Import debounce for search optimization

const { Text } = Typography;

const RoomTagsPage = () => {
    const [data, setData] = useState([]); // Active room tags
    const [archivedData, setArchivedData] = useState([]); // Archived room tags
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showArchived, setShowArchived] = useState(false); 
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // **Ensure this state is defined**
    const pageSize = 5;

    const token = localStorage.getItem('auth_token'); 

    // Fetch active room tags
    const fetchData = async () => {
        setLoading(true);
        setError(null);
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
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error fetching room tags:', error);
            setError('Failed to load active room tags.');
            message.error('Failed to load active room tags.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch archived room tags
    const fetchArchivedData = async () => {
        setLoading(true);
        setError(null);
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
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error fetching archived room tags:', error);
            setError('Failed to fetch archived room tags.');
            message.error('Failed to fetch archived room tags.');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data when showArchived toggles
    useEffect(() => {
        if (showArchived) {
            fetchArchivedData();
        } else {
            fetchData();
        }
    }, [showArchived]);

    // Filter data based on search and archive toggle
    useEffect(() => {
        const currentList = showArchived ? archivedData : data;
        const filtered = currentList.filter(tag =>
            tag.room_tag && tag.room_tag.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    // Debounced search handler
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    // Handle single room tag deletion (archive)
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
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error archiving room tag:', error);
            setError('Failed to archive room tag.');
            message.error('Failed to archive room tag.');
        }
    };

    // Handle multiple room tag deletions (archive)
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
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error archiving selected room tags:', error);
            setError('Failed to archive selected room tags.');
            message.error('Failed to archive selected room tags.');
        }
    };

    // Handle multiple room tag restorations
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
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error restoring room tags:', error);
            setError('Failed to restore room tags.');
            message.error('Failed to restore room tags.');
        }
    };

    // Handle single room tag restoration
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
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error restoring room tag:', error);
            setError('Failed to restore room tag.');
            message.error('Failed to restore room tag.');
        }
    };

    // **Implement handleCreateRoomTag with Duplicate Check**
    const handleCreateRoomTag = async (roomTagData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(tag => 
                tag.room_tag.toLowerCase().trim() === roomTagData.room_tag.toLowerCase().trim()
            );

            if (duplicate) {
                message.error('A room tag with this name already exists.');
                setError('A room tag with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to create
            await axios.post('/api/roomtag', roomTagData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('New room tag created successfully');
            setIsCreateModalVisible(false);
            setIsEditModalVisible(false);

            // Refresh data
            if (showArchived) {
                fetchArchivedData();
            } else {
                fetchData();
            }
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error creating room tag:', error);
            setError('Failed to create room tag.');
            message.error('Failed to create room tag.');
        }
    };

    // **Implement handleEditRoomTag with Duplicate Check**
    const handleEditRoomTag = async (id, updatedData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(tag => 
                tag.room_tag.toLowerCase().trim() === updatedData.room_tag.toLowerCase().trim() && tag.id !== id
            );

            if (duplicate) {
                message.error('A room tag with this name already exists.');
                setError('A room tag with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to update
            await axios.put(`/api/roomtag/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('Room tag updated successfully');
            setIsEditModalVisible(false);
            setModalData(null);

            // Refresh data
            fetchData();
        } catch (error) { // **Ensure 'error' is defined here**
            console.error('Error updating room tag:', error);
            setError('Failed to update room tag.');
            message.error('Failed to update room tag.');
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        const tableHTML = generatePrintHTML(filteredData, showArchived);
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(tableHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
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
                gap: '10px' 
            }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by room tag"
                        style={{ width: '100%', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => debouncedHandleSearch(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} onClick={handlePrint}>
                        Print
                    </Button>
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
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Create New Room Tag
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected room tags?"
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
                            title="Are you sure you want to restore the selected room tags?"
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
                rowSelection={rowSelection}
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
                data={[...data, ...archivedData]} // Pass combined data for duplicate checks
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateRoomTag={handleCreateRoomTag} // Pass the create handler
                handleEditRoomTag={handleEditRoomTag} // Pass the edit handler
            />

            {error && <Text type="danger">{error}</Text>} {/* Ensure 'error' is defined */}
        </div>
    )};

    export default RoomTagsPage;
