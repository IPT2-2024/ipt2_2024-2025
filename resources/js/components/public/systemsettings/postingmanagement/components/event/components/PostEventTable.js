
import React from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment'; 

const { Text } = Typography;

const PostEventTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteEvent,
    handleRestoreEvent, 
    currentPage,
    pageSize,
    setCurrentPage,
    showArchived,
    loading,
}) => {
    const handlePageChange = (page) => {
        setCurrentPage(page); 
    };

    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
    };

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, 
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {!record.isArchived && (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                                onClick={() => handleEdit(record)}
                                aria-label={`Edit event ${record.event_name}`}
                            />
                            <Popconfirm
                                title="Are you sure you want to archive this event?"
                                onConfirm={() => handleDeleteEvent(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                    style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                                    aria-label={`Archive event ${record.event_name}`}
                                />
                            </Popconfirm>
                        </>
                    )}
                    {record.isArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore this event?"
                            onConfirm={() => handleRestoreEvent(record.id)} 
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<ReloadOutlined />}
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                aria-label={`Restore event ${record.event_name}`}
                            >
                                Restore
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        // {
        //     title: <span style={{ color: '#1890ff' }}>ID</span>, 
        //     dataIndex: 'id',
        //     key: 'id',
        //     sorter: (a, b) => a.id - b.id, // Enable sorting
        //     width: 80, // Fixed width for ID
        // },
        {
            title: <span style={{ color: '#1890ff' }}>Event Name</span>, 
            dataIndex: 'event_name',
            key: 'event_name',
            sorter: (a, b) => a.event_name.localeCompare(b.event_name), 
            render: (text) => <Text>{text}</Text>, 
            width: 200, 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Date Start</span>, 
            dataIndex: 'date_start',
            key: 'date_start',
            sorter: (a, b) => new Date(a.date_start) - new Date(b.date_start), 
            render: (text) => (
                <Text>{text ? moment(text, 'YYYY-MM-DD').format('MMMM Do YYYY') : 'N/A'}</Text> 
            ),
            width: 150, 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Date End</span>, 
            dataIndex: 'date_end',
            key: 'date_end',
            sorter: (a, b) => new Date(a.date_end) - new Date(b.date_end), 
            render: (text) => (
                <Text>{text ? moment(text, 'YYYY-MM-DD').format('MMMM Do YYYY') : 'N/A'}</Text> 
            ),
            width: 150, 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Time Start</span>, 
            dataIndex: 'time_start',
            key: 'time_start',
            sorter: (a, b) => {
                if (!a.time_start && !b.time_start) return 0;
                if (!a.time_start) return -1;
                if (!b.time_start) return 1;
                const timeA = moment(a.time_start, 'HH:mm'); 
                const timeB = moment(b.time_start, 'HH:mm'); 
                return timeA - timeB;
            }, 
            render: (text) => {
                if (!text) return <Text>N/A</Text>; 
                const time = moment(text, 'HH:mm'); 
                if (time.isValid()) {
                    return <Text>{time.format('hh:mm A')}</Text>; 
                }
                return <Text>Invalid Time</Text>; 
            },
            width: 120, 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Time End</span>, 
            dataIndex: 'time_end',
            key: 'time_end',
            sorter: (a, b) => {
                if (!a.time_end && !b.time_end) return 0;
                if (!a.time_end) return -1;
                if (!b.time_end) return 1;
                const timeA = moment(a.time_end, 'HH:mm'); 
                const timeB = moment(b.time_end, 'HH:mm'); 
                return timeA - timeB;
            }, 
            render: (text) => {
                if (!text) return <Text>N/A</Text>; 
                const time = moment(text, 'HH:mm'); 
                if (time.isValid()) {
                    return <Text>{time.format('hh:mm A')}</Text>; 
                }
                return <Text>Invalid Time</Text>; 
            },
            width: 120, 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>,
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), 
            render: (text) => (
                <Text>{text ? moment(text).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</Text> 
            ),
            hidden: showArchived, 
            width: 180, 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>, 
            dataIndex: 'updated_at',
            key: 'updated_at',
            sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at), 
            render: (text) => (
                <Text>{text ? moment(text).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</Text> 
            ),
            hidden: showArchived, 
            width: 180, 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Deleted At</span>, 
            dataIndex: 'deleted_at',
            key: 'deleted_at',
            sorter: (a, b) => new Date(a.deleted_at) - new Date(b.deleted_at), 
            render: (text) => (
                <Text>{text ? moment(text).format('MMMM Do YYYY, h:mm:ss a') : 'N/A'}</Text> 
            ),
            hidden: !showArchived, 
            width: 180, 
        },
    ];

    
    const visibleColumns = columns.filter(column => {
        if (column.hidden === undefined) return true;
        return !column.hidden;
    });

    return (
        <Table
            rowSelection={rowSelection}
            columns={visibleColumns}
            dataSource={data} 
            rowKey="id" 
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange, 
                position: ['topRight'],
                showSizeChanger: false, 
            }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    {}
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
            scroll={{ x: 1300 }}
            loading={{
                spinning: loading, 
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, 
                tip: "Loading data..." 
            }}
            bordered
        />
    );
};

export default PostEventTable;
