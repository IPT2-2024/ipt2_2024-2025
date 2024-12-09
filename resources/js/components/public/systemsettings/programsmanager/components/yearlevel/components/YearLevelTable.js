import React, { useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const YearLevelTable = ({
    rowSelection,
    data,
    setIsEditModalVisible,
    setModalData,
    handleDeleteYearLevel,
    handleRestoreYearLevel,
    loading,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page); 
    };

    const yearLevelMap = {
        1: 'First Year',
        2: 'Second Year',
        3: 'Third Year',
        4: 'Fourth Year',
        5: 'Fifth Year',
        6: 'Sixth Year',
        7: 'Seventh Year',
        8: 'Eighth Year',
        9: 'Ninth Year',
        10: 'Tenth Year',
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
                        aria-label={`Edit year level ${record.year_level}`}
                    />
                    
                    {}
                    {!record.deleted_at && (
                        <Popconfirm
                            title="Are you sure you want to delete this year level?"
                            onConfirm={() => handleDeleteYearLevel(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                            />
                        </Popconfirm>
                    )}

                    {}
                    {record.deleted_at && (
                        <Popconfirm
                            title="Are you sure you want to restore this year level?"
                            onConfirm={() => handleRestoreYearLevel(record.id)}  
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<ReloadOutlined />}
                                style={{ backgroundColor: 'white', border: 'none', color: 'black' }}
                            >
                                Restore
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        // {
        //     title: <span style={{ color: '#1890ff' }}>ID</span>, // Blue title
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        {
            title: <span style={{ color: '#1890ff' }}>Year Level</span>, 
            dataIndex: 'year_level', 
            key: 'year_level',
            render: (text) => yearLevelMap[text] || text,
        },
        {
            title: <span style={{ color: '#1890ff' }}>Created At</span>, 
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> 
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Updated At</span>, 
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => (
                <Text>{new Date(text).toLocaleString()}</Text> 
            ),
        },
    ];

    return (
            <Table
                id="year-level-table"
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
            />
    );
};

export default YearLevelTable;
