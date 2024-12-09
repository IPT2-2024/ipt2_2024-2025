import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import YearLevelTable from './components/YearLevelTable';
import YearLevelModal from './components/YearLevelModal';
//import { yearLevelData } from './components/YearLevelData'; // Replace with your initial year level data

const { Text } = Typography;

const YearLevelPage = () => {
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
    const [isPrintPreviewVisible, setIsPrintPreviewVisible] = useState(false);
    
    
    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(year =>
            year.year_level.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        const filtered = (showArchived ? archivedData : data).filter((year) => {
            const yearLevel = year.year_level; 
    
            // Ensure year_level is treated as a string, and handle undefined or null values
            return (yearLevel && yearLevel.toString().toLowerCase().includes(value.toLowerCase()));
        });
    
        setFilteredData(filtered);
    };
    
    const openPrintPreview = () => {
        setIsPrintPreviewVisible(true);
    };
    
    
    const closePrintPreview = () => {
        setIsPrintPreviewVisible(false);
    };
    

    const handleReset = () => {
        setSearchValue('');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/yearlevel', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    deleted: showArchived ? 'true' : 'false', 
                },
            });

            
            const activeData = response.data.filter(year => !year.deleted_at);
            const archivedData = response.data.filter(year => year.deleted_at);

            
            setData(activeData);
            setArchivedData(archivedData);

            
            const filtered = (showArchived ? archivedData : activeData).filter(year =>
                year.year_level.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);

        } catch (error) {
            message.error('Error fetching year levels: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [showArchived, searchValue]); 

    const reloadData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/yearlevel', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    deleted: showArchived ? 'true' : 'false', 
                },
            });

            
            const activeData = response.data.filter(year => !year.deleted_at);
            const archivedData = response.data.filter(year => year.deleted_at);

            
            setData(activeData);
            setArchivedData(archivedData);

            
            const filtered = (showArchived ? archivedData : activeData).filter(year =>
                year.year_level.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);

        } catch (error) {
            message.error('Error fetching year levels: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    

    const handleDeleteYearLevel = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');  
            
            
            const response = await axios.delete(`/api/yearlevel/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            
            if (response.status === 200) {
                message.success('Year Level deleted successfully');
                reloadData();  
            }
        } catch (error) {
            message.error('Failed to delete year level: ' + error.message);
        }
    };
    

    const handleDeleteSelected = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            
            const deletePromises = selectedRowKeys.map(async (id) => {
                return axios.delete(`/api/yearlevel/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
    
            
            await Promise.all(deletePromises);
    
            
            reloadData();
    
            message.success(`${selectedRowKeys.length} Year Level(s) deleted.`);
        } catch (error) {
            message.error('Failed to delete year levels: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); 
        }
    };
    

    const handleRestoreYearLevel = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            
            
            const response = await axios.post(`/api/yearlevel/${id}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            
            reloadData();
            message.success('Year level restored successfully.');
        } catch (error) {
            message.error('Failed to restore year level: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    

    const handleRestoreSelected = async () => {
        try {
            const token = localStorage.getItem('auth_token');
    
            
            const restorePromises = selectedRowKeys.map(async (id) => {
                return axios.post(`/api/yearlevel/${id}/restore`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
    
            
            await Promise.all(restorePromises);
    
            
            reloadData();
    
            message.success(`${selectedRowKeys.length} Year Level(s) restored.`);
        } catch (error) {
            message.error('Failed to restore year levels: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]); 
        }
    };
    

    
    const handleCreateYearLevel = async (values) => {
        try {
            const token = localStorage.getItem('auth_token');
    
            
            const response = await axios.post('/api/yearlevel', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            
            setData((prevData) => [...prevData, response.data.yearLevel]);
    
            
            setIsCreateModalVisible(false);
            message.success('Year Level created successfully');
        } catch (error) {
            message.error('Failed to create Year Level: ' + (error.response?.data?.message || error.message));
        }
    };
    

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
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
                {}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by year level"
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button 
                        icon={<FileTextOutlined />}
                        onClick={openPrintPreview} 
                        type="primary"
                    >
                        Print Preview
                    </Button>

                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Year Levels' : 'Show Archived Year Levels'}
                    </Button>
                </Space>

                {}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setIsCreateModalVisible(true)}
                >
                    Create New Year Level
                </Button>

                    {!showArchived && (
                    <Popconfirm
                        title="Are you sure you want to delete the selected year levels?"
                        onConfirm={handleDeleteSelected}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            disabled={rowSelection.selectedRowKeys.length === 0}
                        >
                            Remove Selected Year Levels
                        </Button>
                    </Popconfirm>
                    )}

                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected year levels?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                default
                            >
                                Restore Selected
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            <YearLevelTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteYearLevel={handleDeleteYearLevel}
                handleRestoreYearLevel={handleRestoreYearLevel}
                handleDeleteSelected={handleDeleteSelected}
                loading={loading}
            />
            <YearLevelModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateYearLevel={handleCreateYearLevel}
                isPrintPreviewVisible={isPrintPreviewVisible}
                setIsPrintPreviewVisible={setIsPrintPreviewVisible}
                closePrintPreview={closePrintPreview}
            />
        </div>
    );
};

export default YearLevelPage;
