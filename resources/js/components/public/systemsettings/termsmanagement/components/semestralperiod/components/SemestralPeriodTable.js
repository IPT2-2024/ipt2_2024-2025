import React, { useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SemestralPeriodTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteSemester,
    handleRestoreSemester,
    loading,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: <span style={{ color: '#1890ff' }}>Actions</span>, 
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {}
                    <Button
                        icon={<EditOutlined />}
                        style={{ backgroundColor: '#1677FF', borderColor: '#1677FF', color: '#fff' }}
                        onClick={() => {
                            setIsEditModalVisible(true);
                            setModalData(record);
                        }}
                    />
                    
                    {}
                    {record.deleted_at ? (
                        
                        <Popconfirm
                            title="Are you sure to restore this semester?"
                            onConfirm={() => handleRestoreSemester(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="default"
                                icon={<ReloadOutlined />}
                                size="small"
                                aria-label="Restore Semester"
                            >
                                Restore
                            </Button>
                        </Popconfirm>
                    ) : (
                        
                        <Popconfirm
                            title="Are you sure to delete this semester?"
                            onConfirm={() => handleDeleteSemester(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                                size="small"
                                aria-label="Delete Semester"
                            />
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
            title: <span style={{ color: '#1890ff' }}>Semester Period</span>, 
            dataIndex: 'semester_period',
            key: 'semester_period',
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>, 
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(), 
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>, 
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => new Date(text).toLocaleString(), 
        },
    ];
    
    
    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} 
            rowKey="id" 
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: data.length,
                onChange: handlePageChange, 
                position: ['topRight'], 
            }}
            footer={() => (
                <div style={{ textAlign: 'left' }}>
                    <Text>{`Page ${currentPage} of ${Math.ceil(data.length / pageSize)}`}</Text>
                </div>
            )}
            scroll={{ x: 800 }} 
            loading={{
                spinning: loading, 
                indicator: <ReloadOutlined spin style={{ fontSize: 24 }} />, 
                tip: "Loading data..." 
            }}
        />
    );
};

export default SemestralPeriodTable;
