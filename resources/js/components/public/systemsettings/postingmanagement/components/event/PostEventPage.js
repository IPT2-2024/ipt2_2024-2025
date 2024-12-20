// PostEventPage.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import PostEventTable from './components/PostEventTable'; 
import PostEventModal from './components/PostEventModal'; 
import moment from 'moment'; 
import { debounce } from 'lodash'; // Import debounce for search optimization

const { Text } = Typography;

const PostEventPage = () => {
    const [data, setData] = useState([]); // Active events
    const [archivedData, setArchivedData] = useState([]); // Archived events
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for bulk actions
    const [searchValue, setSearchValue] = useState(''); // Search input
    const [loading, setLoading] = useState(false); // Loading state
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Create modal visibility
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit modal visibility
    const [modalData, setModalData] = useState(null); // Data for editing
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [error, setError] = useState(null); // Error state
    const pageSize = 10; // Items per page

    const token = localStorage.getItem('auth_token'); // Retrieve token once

    // Fetch active events
    const fetchEvents = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/event', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const events = response.data;
            const activeEvents = events.filter(event => !event.isArchived);
            const archivedEvents = events.filter(event => event.isArchived);

            setData(activeEvents);
            setArchivedData(archivedEvents);

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedEvents : activeEvents);
            setCurrentPage(1); 
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to fetch event data.');
            message.error('Failed to fetch event data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch archived events (if needed)
    const fetchArchivedEvents = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/event?deleted=only', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedEvents = response.data.map(event => ({
                ...event,
                isArchived: true,
            }));

            setArchivedData(archivedEvents);

            if (showArchived) {
                setFilteredData(archivedEvents);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived events:', err);
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchEvents();
    }, []);

    // Update filtered data based on search, data, archivedData, and showArchived
    useEffect(() => {
        const currentList = showArchived ? archivedData : data;
        const filtered = currentList.filter(event =>
            String(event.event_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    // Fetch data when showArchived changes
    useEffect(() => {
        if (showArchived) {
            fetchArchivedEvents();
        } else {
            fetchEvents();
        }
    }, [showArchived]);

    // Debounced search handler
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        debouncedHandleSearch(value);
    };

    // Handle single event deletion (archive)
    const handleDeleteEvent = async (id) => {
        const eventToDelete = data.find(event => event.id === id);
        if (!eventToDelete) return;

        try {
            await axios.delete(`/api/event/${id}`, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(data.filter(event => event.id !== id));
            setArchivedData([...archivedData, { ...eventToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
            message.success('Event archived successfully');
        } catch (error) {
            console.error('Error archiving event:', error);
            message.error('Failed to archive event.');
        }
    };

    // Handle multiple events deletion (archive)
    const handleDeleteSelected = async () => {
        const selectedEvents = data.filter(event => selectedRowKeys.includes(event.id));
        if (selectedEvents.length === 0) return;

        try {
            await Promise.all(
                selectedEvents.map(event =>
                    axios.delete(`/api/event/${event.id}`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedEvents.map(event => ({ 
                ...event, 
                isArchived: true, 
                deleted_at: now,
                date_start: event.date_start,
                date_end: event.date_end,
                time_start: event.time_start,
                time_end: event.time_end,
            }));
            const remainingEvents = data.filter(event => !selectedRowKeys.includes(event.id));

            setData(remainingEvents);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedEvents.length} event(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected events:', error);
            message.error('Failed to archive selected events.');
        }
    };

    // Handle single event restoration
    const handleRestoreEvent = async (id) => {
        try {
            await axios.post(`/api/event/${id}/restore`, {}, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            const eventToRestore = archivedData.find(event => event.id === id);
            if (eventToRestore) {
                const updatedArchived = archivedData.filter(event => event.id !== id);
                const restoredEvent = { 
                    ...eventToRestore, 
                    isArchived: false,
                    deleted_at: undefined, 
                };
                setArchivedData(updatedArchived);
                setData([...data, restoredEvent]);
                message.success('Event restored successfully');
            }
        } catch (error) {
            console.error('Error restoring event:', error);
            message.error('Failed to restore event.');
        }
    };

    // Handle multiple events restoration
    const handleRestoreSelected = async () => {
        const selectedEvents = archivedData.filter(event => selectedRowKeys.includes(event.id));
        if (selectedEvents.length === 0) return;

        try {
            await Promise.all(
                selectedEvents.map(event =>
                    axios.post(`/api/event/${event.id}/restore`, {}, { 
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedEvents = archivedData.filter(event => !selectedRowKeys.includes(event.id));
            const restoredEvents = selectedEvents.map(event => {
                const { deleted_at, ...rest } = event;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedEvents);
            setData([...data, ...restoredEvents]);
            setSelectedRowKeys([]);
            message.success(`${selectedEvents.length} event(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring events:', error);
            message.error('Failed to restore events.');
        }
    };

    // Handle data reload after create or edit actions
    const reloadData = async () => {
        try {
            await fetchEvents();
        } catch (error) {
            // fetchEvents already handles errors
        }
    };

    // **Implement handleCreateEvent with Duplicate Check**
    const handleCreateEvent = async (eventData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(event => 
                event.event_name.toLowerCase().trim() === eventData.event_name.toLowerCase().trim()
            );

            if (duplicate) {
                message.error('A event with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to create
            await axios.post('/api/event', eventData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Event created successfully!');
            setIsCreateModalVisible(false);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) {
            console.error('Error creating event:', error);
            if (error.response && error.response.status === 409) { 
                message.error('A event with this name already exists.');
            } else {
                message.error('Failed to create event.');
            }
        }
    };

    // **Implement handleEditEvent with Duplicate Check**
    const handleEditEvent = async (id, updatedData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(event => 
                event.event_name.toLowerCase().trim() === updatedData.event_name.toLowerCase().trim() && event.id !== id
            );

            if (duplicate) {
                message.error('A event with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to update
            await axios.put(`/api/event/${id}`, updatedData, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('Event updated successfully!');
            setIsEditModalVisible(false);
            setModalData(null);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) {
            console.error('Error updating event:', error);
            if (error.response && error.response.status === 409) { 
                message.error('A event with this name already exists.');
            } else {
                message.error('Failed to update event.');
            }
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=1300'); 
        if (printWindow) {
            printWindow.document.write('<html><head><title>Event Table</title></head><body>');
            printWindow.document.write('<h2>Event Data</h2>');
            printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
            printWindow.document.write('<thead><tr>');
            
            printWindow.document.write('<th>Event Name</th><th>Date Start</th><th>Date End</th><th>Time Start</th><th>Time End</th>');
            if (!showArchived) {
                printWindow.document.write('<th>Created At</th><th>Updated At</th>');
            } else {
                printWindow.document.write('<th>Deleted At</th>');
            }
            printWindow.document.write('</tr></thead><tbody>');

            filteredData.forEach(event => {
                printWindow.document.write('<tr>');
                printWindow.document.write(`<td>${event.event_name || ''}</td>`);
                printWindow.document.write(`<td>${event.date_start ? moment(event.date_start).format('MMMM Do YYYY') : 'N/A'}</td>`);
                printWindow.document.write(`<td>${event.date_end ? moment(event.date_end).format('MMMM Do YYYY') : 'N/A'}</td>`);
                printWindow.document.write(`<td>${event.time_start ? moment(event.time_start, 'hh:mm A').format('hh:mm A') : 'N/A'}</td>`);
                printWindow.document.write(`<td>${event.time_end ? moment(event.time_end, 'hh:mm A').format('hh:mm A') : 'N/A'}</td>`);
                if (!showArchived) {
                    printWindow.document.write(`<td>${event.created_at ? moment(event.created_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
                    printWindow.document.write(`<td>${event.updated_at ? moment(event.updated_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
                } else {
                    printWindow.document.write(`<td>${event.deleted_at ? moment(event.deleted_at).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</td>`);
                }
                printWindow.document.write('</tr>');
            });

            printWindow.document.write('</tbody></table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };

    // Row selection for bulk actions
    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            {/* Search and Action Buttons */}
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
                        placeholder="Search by event name"
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
                        {showArchived ? 'Show Active Events' : 'Show Archived Events'}
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
                                Create New Event
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to archive the selected events?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Archive Selected Events
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected events?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Events
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>

            {/* Event Table */}
            <PostEventTable
                rowSelection={rowSelectionConfig}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteEvent={handleDeleteEvent}
                handleRestoreEvent={handleRestoreEvent} 
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading}
            />

            {/* Event Modal */}
            <PostEventModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateEvent={handleCreateEvent} 
                handleEditEvent={handleEditEvent}   
                existingEvents={[...data, ...archivedData]} // Pass combined data for duplicate checks
            />

            {/* Error Message */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    );

};

export default PostEventPage;
