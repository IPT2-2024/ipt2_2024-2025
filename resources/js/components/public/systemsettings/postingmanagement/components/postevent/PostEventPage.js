import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { PlusOutlined, UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
import PostEventTable from './PostEventTable'; // Import the PostEventTable component
import PostEventModal from './PostEventModal'; // Import the PostEventModal component
import { eventData } from './PostEventData'; // Replace with your initial event data

const { Text } = Typography;

const PostEventPage = () => {
    const [data, setData] = useState(eventData); // Store event data (active events)
    const [archivedData, setArchivedData] = useState([]); // Store archived event data
    const [filteredData, setFilteredData] = useState(eventData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Store selected rows for batch actions
    const [searchValue, setSearchValue] = useState(''); // Search input
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Modal visibility for creating new event
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Modal visibility for editing event
    const [modalData, setModalData] = useState(null); // Store data for the modal
    const [showArchived, setShowArchived] = useState(false); // Toggle for showing archived events

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(event =>
            event.event_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleCreateEvent = () => {
        setIsCreateModalVisible(true); // Show the Create Event Modal
    };

    const handleDeleteEvent = (id) => {
        const eventToDelete = data.find(event => event.id === id);
        if (eventToDelete) {
            setData(data.filter(event => event.id !== id)); // Remove event from data
            setArchivedData([...archivedData, { ...eventToDelete, isArchived: true }]); // Archive it
            message.success('Event archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedEvents = data.filter(event => selectedRowKeys.includes(event.id));
        const remainingEvents = data.filter(event => !selectedRowKeys.includes(event.id));

        setData(remainingEvents); // Remove selected from data
        setArchivedData([...archivedData, ...selectedEvents.map(event => ({ ...event, isArchived: true }))]); // Archive them
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedEvents.length} event(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedEvents = archivedData.filter(event => selectedRowKeys.includes(event.id));
        const remainingArchivedEvents = archivedData.filter(event => !selectedRowKeys.includes(event.id));

        setArchivedData(remainingArchivedEvents); // Remove selected from archived data
        setData([...data, ...selectedEvents.map(event => ({ ...event, isArchived: false }))]); // Restore them to active
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedEvents.length} event(s) restored successfully`);
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
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by event name"
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
                        {showArchived ? 'Show Active Events' : 'Show Archived Events'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateEvent}
                    >
                        Create New Event
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Events
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0}
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Events
                        </Button>
                    )}
                </Space>
            </div>

            <PostEventTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteEvent={handleDeleteEvent}
            />

            <PostEventModal
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

export default PostEventPage;
