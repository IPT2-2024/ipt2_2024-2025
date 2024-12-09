
import React from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SectionCatalogTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteSection,
    handleRestoreSection, 
    currentPage,
    pageSize,
    setCurrentPage,
    showArchived,
    loading
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
                    {!record.isArchived && (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                                onClick={() => handleEdit(record)}
                            />
                             <Popconfirm
                            title="Are you sure you want to delete this section?"
                            onConfirm={() => handleDeleteSection(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                            />
                            </Popconfirm>
                        </>
                    )}
                    {record.isArchived && (
                        <Popconfirm
                        title="Are you sure you want to restore this section?"
                        onConfirm={() => handleRestoreSection(record.id)}  
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<ReloadOutlined />}
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
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
        // },
        {
            title: <span style={{ color: '#1890ff' }}>Section Name</span>, 
            dataIndex: 'section_name',
            key: 'section_name',
        },
    ];

    
    const extraColumns = showArchived
        ? [
            {
                title: <span style={{ color: '#1890ff' }}>Deleted At</span>, 
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                render: (value) => value ? new Date(value).toLocaleString() : 'None'
            }
        ]
        : [
            {
                title: <span style={{ color: '#1890ff' }}>Created At</span>, 
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> 
                ),
            },
            {
                title: <span style={{ color: '#1890ff' }}>Updated At</span>, 
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (text) => (
                    <Text>{text ? new Date(text).toLocaleString() : 'N/A'}</Text> 
                ),
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
            scroll={{ x: 800 }} 
            loading={{
                spinning: loading, 
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, 
                tip: "Loading data..." 
            }}
            bordered
        />
    );
};

export default SectionCatalogTable;
