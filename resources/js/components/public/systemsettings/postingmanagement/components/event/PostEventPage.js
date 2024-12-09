import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import PostEventTable from './components/PostEventTable'; 
import PostEventModal from './components/PostEventModal'; 
import moment from 'moment'; 

const { Text } = Typography;

const PostEventPage = () => {
    
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

   
    useEffect(() => {
        fetchEvents();
    }, []);

    
    useEffect(() => {
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(event =>
            String(event.event_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); 
    }, [searchValue, data, archivedData, showArchived]);

    
    useEffect(() => {
        if (showArchived) {
            fetchArchivedEvents();
        } else {
            fetchEvents();
        }
    }, [showArchived]);

   

    
    const handleSearch = (value) => {
        setSearchValue(value);
    };

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

    
    const handleCreateEvent = async (eventData) => {
        
        const duplicate = data.some(event => event.event_name.toLowerCase() === eventData.event_name.toLowerCase()) ||
                          archivedData.some(event => event.event_name.toLowerCase() === eventData.event_name.toLowerCase());

        if (duplicate) {
            message.error('This Event already exists.');
            return;
        }

        try {
            const response = await axios.post('/api/event', eventData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newEvent = response.data; 

            message.success('New event created successfully');
            setIsCreateModalVisible(false);

            
            fetchEvents();
        } catch (error) {
            console.error('Error creating event:', error);
            if (error.response && error.response.status === 409) { 
                message.error('This Event already exists.');
            } else {
                message.error('Failed to create event.');
            }
        }
    };

    
    const handleEditEvent = async (id, updatedData) => {
        
        const duplicate = data.some(event => 
            event.event_name.toLowerCase() === updatedData.event_name.toLowerCase() && event.id !== id
        ) ||
        archivedData.some(event => 
            event.event_name.toLowerCase() === updatedData.event_name.toLowerCase() && event.id !== id
        );

        if (duplicate) {
            message.error('This Event already exists.');
            return;
        }

        try {
            await axios.put(`/api/event/${id}`, updatedData, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const updatedEvents = data.map(event => 
                event.id === id ? { ...event, ...updatedData, updated_at: new Date().toISOString() } : event
            );
            setData(updatedEvents);
            setIsEditModalVisible(false);
            message.success('Event updated successfully');
        } catch (error) {
            console.error('Error updating event:', error);
            if (error.response && error.response.status === 409) { 
                message.error('This Event already exists.');
            } else {
                message.error('Failed to update event.');
            }
        }
    };

    
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=1300'); 
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
            printWindow.document.write(`<td>${event.event_name ?? ''}</td>`);
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
            {}
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
            {}
            <PostEventModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateEvent={handleCreateEvent} 
                handleEditEvent={handleEditEvent}   
                existingEvents={[...data, ...archivedData]} 
            />
            {}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default PostEventPage;
