import React from 'react';
import { Table, Space, Button, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RoomTagsTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteRoomTag,
    handleRestoreRoomTag, 
    currentPage,
    pageSize,
    setCurrentPage,
    showArchived,
    loading,
}) => {
    const handleEdit = (record) => {
        setModalData(record);
        setIsEditModalVisible(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Format date to 'DD-MM-YYYY HH:mm:ss'
    const formatDate = (date) => {
        if (!date) return 'None';
        const d = new Date(date);
        return d.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const baseColumns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>,
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {!record.isArchived && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    )}
                    {!record.isArchived && (
                        <Popconfirm
                            title="Are you sure you want to delete this room tag?"
                            onConfirm={() => handleDeleteRoomTag(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    )}
                    {record.isArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore this room tag?"
                            onConfirm={() => handleRestoreRoomTag(record.id)}  
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="default"
                                icon={<ReloadOutlined />}
                            >
                                Restore
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Room Tag</span>,
            dataIndex: 'room_tag',
            key: 'room_tag',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Room Tag Type</span>,
            dataIndex: 'room_tag_type',
            key: 'room_tag_type',
        },
    ];

    const extraColumns = showArchived
        ? [
            {
                title: <span style={{ color: '#1890ff' }}>Deleted At</span>,
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                render: (value) => formatDate(value),
            }
        ]
        : [
            {
                title: <span style={{ color: '#1890ff' }}>Created At</span>,
                dataIndex: 'created_at',
                key: 'created_at',
                render: (value) => formatDate(value),
            },
            {
                title: <span style={{ color: '#1890ff' }}>Updated At</span>,
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (value) => formatDate(value),
            }
        ];

    const columns = [...baseColumns, ...extraColumns];

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            bordered
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange,
                position: ['topRight'],
            }}
            loading={{
                spinning: loading, 
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, 
                tip: "Loading data..." 
            }} 
            style={{ color: '#000' }}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
        />
    );
};

export default RoomTagsTable;
