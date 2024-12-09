import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AnnouncementTable from './PostAnnouncementTable'; // Table component
import AnnouncementModal from './components/PostAnnouncementModal'; // Modal component
import { postAnnouncementData } from './components/PostAnnouncementData'; // Corrected import for postAnnouncementData

const { Text } = Typography;

const PostAnnouncementPage = () => {
    const [data, setData] = useState(postAnnouncementData); // Active announcements data
    const [archivedData, setArchivedData] = useState([]); // Archived announcements
    const [filteredData, setFilteredData] = useState(postAnnouncementData); // Filtered announcements
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows
    const [searchValue, setSearchValue] = useState(''); // Search value for filtering
    const [loading, setLoading] = useState(false); // Loading state for data
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Show modal for creating
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Show modal for editing
    const [modalData, setModalData] = useState(null); // Data for the modal
    const [showArchived, setShowArchived] = useState(false); // Toggle for showing archived data

    // Filter the data based on the search and archived state
    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter((announcement) =>
            announcement.announcement.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    // Handle search value change
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    // Reset the search filter
    const handleReset = () => {
        setSearchValue('');
    };

    // Archive an announcement by ID
    const handleDeleteAnnouncement = (id) => {
        const announcementToDelete = data.find(announcement => announcement.id === id);
        if (announcementToDelete) {
            setData(data.filter(announcement => announcement.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...announcementToDelete, isArchived: true }]); // Archive it
            message.success('Announcement archived successfully');
        }
    };

    // Archive selected announcements
    const handleDeleteSelected = () => {
        const selectedAnnouncements = data.filter(announcement => selectedRowKeys.includes(announcement.id));
        const remainingAnnouncements = data.filter(announcement => !selectedRowKeys.includes(announcement.id));

        setData(remainingAnnouncements); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedAnnouncements.map(announcement => ({ ...announcement, isArchived: true }))]); // Archive them
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedAnnouncements.length} announcement(s) archived successfully`);
    };

    // Restore selected announcements from archive
    const handleRestoreSelected = () => {
        const selectedAnnouncements = archivedData.filter(announcement => selectedRowKeys.includes(announcement.id));
        const remainingArchivedAnnouncements = archivedData.filter(announcement => !selectedRowKeys.includes(announcement.id));

        setArchivedData(remainingArchivedAnnouncements); // Remove selected from archived data
        setData([...data, ...selectedAnnouncements.map(announcement => ({ ...announcement, isArchived: false }))]); // Restore them to active
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedAnnouncements.length} announcement(s) restored successfully`);
    };

    // Open the Create Modal
    const handleCreateAnnouncement = () => {
        setIsCreateModalVisible(true); // Show the Create Announcement Modal
    };

    // Row selection configuration for the table
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
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search announcements"
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
                        {showArchived ? 'Show Active Announcements' : 'Show Archived Announcements'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateAnnouncement}
                    >
                        Create New Announcement
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Announcements
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0}
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Announcements
                        </Button>
                    )}
                </Space>
            </div>
            <AnnouncementTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteAnnouncement={handleDeleteAnnouncement}
            />
            <AnnouncementModal
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

export default PostAnnouncementPage;
