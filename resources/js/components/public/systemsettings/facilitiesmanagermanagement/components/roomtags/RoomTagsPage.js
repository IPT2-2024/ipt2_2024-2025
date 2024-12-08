import React, { useState, useEffect } from 'react';
import { Button, Input, Space, message, Typography } from 'antd';
import { PlusOutlined, FileTextOutlined, UnorderedListOutlined } from '@ant-design/icons';
import RoomTagsTable from './RoomTagsTable';
import RoomTagsModal from './RoomTagsModal';
import { roomTagsData } from './RoomTagsData';

const { Text } = Typography;

const RoomTagsPage = () => {
    const [data, setData] = useState(roomTagsData); // Store active room tags
    const [archivedData, setArchivedData] = useState([]); // Store archived room tags
    const [filteredData, setFilteredData] = useState(roomTagsData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);

    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const pageSize = 5; // Define the page size

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(tag =>
            tag.room_tag.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteRoomTag = (id) => {
        const tagToDelete = data.find(tag => tag.id === id);
        if (tagToDelete) {
            setData(data.filter(tag => tag.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...tagToDelete, isArchived: true }]); // Add to archived data
            message.success('Room tag archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedTags = data.filter(tag => selectedRowKeys.includes(tag.id));
        const remainingTags = data.filter(tag => !selectedRowKeys.includes(tag.id));

        setData(remainingTags); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedTags.map(tag => ({ ...tag, isArchived: true }))]); // Archive selected room tags
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedTags.length} room tag(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedTags = archivedData.filter(tag => selectedRowKeys.includes(tag.id));
        const remainingArchivedTags = archivedData.filter(tag => !selectedRowKeys.includes(tag.id));

        setArchivedData(remainingArchivedTags); // Remove selected from archived data
        setData([...data, ...selectedTags.map(tag => ({ ...tag, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedTags.length} room tag(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateRoomTag = () => {
        setIsCreateModalVisible(true); // Show the Create Room Tag Modal
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            {/* Title and Actions */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by room tag"
                        style={{ width: '100%', maxWidth: '300px' }} // Ensure it is responsive
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />}>Print</Button>
                    <Button 
                        icon={<UnorderedListOutlined />} 
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Room Tags' : 'Show Archived Room Tags'}
                    </Button>
                </Space>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={handleCreateRoomTag}
                    >
                        Create New Room Tag
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Room Tags
                    </Button>
                </Space>
            </div>

            {/* Room Tags Table */}
            <RoomTagsTable
                rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
                data={filteredData}
                handleDeleteRoomTag={handleDeleteRoomTag}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
            />

            {/* Room Tags Modal */}
            <RoomTagsModal
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

export default RoomTagsPage;
