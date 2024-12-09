
import React from 'react';
import { Table, Button, Space, Typography, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Text } = Typography;

const AnnouncementTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteAnnouncement,
    handleRestoreAnnouncement, 
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

    const baseColumns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, 
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {!record.isArchived ? (
                        <>
                            <Tooltip title="Edit Announcement">
                                <Button
                                    icon={<EditOutlined />}
                                    style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                                    onClick={() => handleEdit(record)}
                                />
                            </Tooltip>
                            <Popconfirm
                                title="Are you sure you want to archive this announcement?"
                                onConfirm={() => handleDeleteAnnouncement(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title="Archive Announcement">
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        style={{ border: 'none', color: '#000000' }}
                                    />
                                </Tooltip>
                            </Popconfirm>
                        </>
                    ) : (
                        <Popconfirm
                            title="Are you sure you want to restore this announcement?"
                            onConfirm={() => handleRestoreAnnouncement(record.id)}  
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="Restore Announcement">
                                <Button
                                    icon={<ReloadOutlined />}
                                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                >
                                    Restore
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Announcement</span>, 
            dataIndex: 'announcement',
            key: 'announcement',
            sorter: (a, b) => a.announcement.localeCompare(b.announcement), 
            render: (text) => (
                <Text>{text}</Text> 
            ),
        },
    ];

    const extraColumns = showArchived
        ? [
            {
                title: <span style={{ color: '#1890ff' }}>Deleted At</span>, 
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                render: (value) => (value ? new Date(value).toLocaleString() : 'N/A'),
                sorter: (a, b) => new Date(a.deleted_at) - new Date(b.deleted_at), 
            },
        ]
        : [
            {
                title: <span style={{ color: '#1890ff' }}>Created At</span>, 
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> 
                ),
                sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), 
            },
            {
                title: <span style={{ color: '#1890ff' }}>Updated At</span>, 
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> 
                ),
                sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at), 
            },
        ];

    const columns = [...baseColumns, ...extraColumns];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
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
            scroll={{ x: 'max-content' }} 
            loading={{
                spinning: loading, 
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, 
                tip: "Loading data..." 
            }}
            bordered
            locale={{
                emptyText: showArchived
                    ? 'No archived announcements available.'
                    : 'No active announcements available.',
            }}
        />
    );
};

AnnouncementTable.propTypes = {
    rowSelection: PropTypes.object,
    data: PropTypes.array.isRequired,
    setIsEditModalVisible: PropTypes.func.isRequired,
    setModalData: PropTypes.func.isRequired,
    handleDeleteAnnouncement: PropTypes.func.isRequired,
    handleRestoreAnnouncement: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    showArchived: PropTypes.bool.isRequired,
    
};

export default AnnouncementTable;
