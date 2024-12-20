// YearLevelPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, message, Typography, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import YearLevelTable from './components/YearLevelTable';
import YearLevelModal from './components/YearLevelModal';
import { generatePrintHTML } from './components/PrintUtils';
import { debounce } from 'lodash'; // Import debounce for search optimization

const { Text } = Typography;

const YearLevelPage = () => {
    const [data, setData] = useState([]); // Active year levels
    const [archivedData, setArchivedData] = useState([]); // Archived year levels
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showArchived, setShowArchived] = useState(false); 
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Define error state
    const [isPrintPreviewVisible, setIsPrintPreviewVisible] = useState(false);
    const pageSize = 5;

    const token = localStorage.getItem('auth_token'); 

    // Fetch year levels from the server
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
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

        } catch (error) { // Ensure 'error' is defined here
            console.error('Error fetching year levels:', error);
            setError('Error fetching year levels: ' + (error.response?.data?.message || error.message));
            message.error('Error fetching year levels: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when showArchived or searchValue changes
    useEffect(() => {
        fetchData();
    }, [showArchived, searchValue]); 

    // Debounced search handler
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    // Handle single year level deletion (archive)
    const handleDeleteYearLevel = async (id) => {
        try {
            await axios.delete(`/api/yearlevel/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Year Level archived successfully');
            reloadData();  
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error deleting year level:', error);
            setError('Failed to delete year level: ' + (error.response?.data?.message || error.message));
            message.error('Failed to delete year level: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle multiple year level deletions (archive)
    const handleDeleteSelected = async () => {
        if (selectedRowKeys.length === 0) return;
        const selectedTags = data.filter(tag => selectedRowKeys.includes(tag.id));
        
        try {
            await Promise.all(
                selectedTags.map((tag) =>
                    axios.delete(`/api/yearlevel/${tag.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedTags = selectedTags.map(tag => ({ ...tag, isArchived: true, deleted_at: now }));
            const remainingTags = data.filter(tag => !selectedRowKeys.includes(tag.id));

            setData(remainingTags);
            setArchivedData([...archivedData, ...archivedTags]);
            setSelectedRowKeys([]);
            message.success(`${selectedTags.length} Year Level(s) archived successfully`);
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error archiving selected year levels:', error);
            setError('Failed to archive selected year levels: ' + (error.response?.data?.message || error.message));
            message.error('Failed to archive selected year levels: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle multiple year level restorations
    const handleRestoreSelected = async () => {
        const selectedTags = archivedData.filter(tag => selectedRowKeys.includes(tag.id));
        if (selectedTags.length === 0) return;

        try {
            await Promise.all(
                selectedTags.map(tag =>
                    axios.post(`/api/yearlevel/${tag.id}/restore`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedTags = archivedData.filter(tag => !selectedRowKeys.includes(tag.id));
            const restoredTags = selectedTags.map(tag => {
                const { deleted_at, ...rest } = tag;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedTags);
            setData([...data, ...restoredTags]);
            setSelectedRowKeys([]);
            message.success(`${selectedTags.length} Year Level(s) restored successfully`);
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring year levels:', error);
            setError('Failed to restore year levels: ' + (error.response?.data?.message || error.message));
            message.error('Failed to restore year levels: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle single year level restoration
    const handleRestoreYearLevel = async (id) => {
        try {
            await axios.post(`/api/yearlevel/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('Year level restored successfully.');
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error restoring year level:', error);
            setError('Failed to restore year level: ' + (error.response?.data?.message || error.message));
            message.error('Failed to restore year level: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle data reload after create, edit, delete, or restore actions
    const reloadData = async () => {
        try {
            await fetchData();
        } catch (error) {
            // fetchData already handles errors
        }
    };

    // **Implement handleCreateYearLevel with Duplicate Check**
    const handleCreateYearLevel = async (yearLevelData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(tag => 
                tag.year_level.toLowerCase().trim() === yearLevelData.year_level.toLowerCase().trim()
            );

            if (duplicate) {
                message.error('A year level with this name already exists.');
                setError('A year level with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to create
            await axios.post('/api/yearlevel', yearLevelData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Year Level created successfully!');
            setIsCreateModalVisible(false);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error creating year level:', error);
            setError('Failed to create Year Level: ' + (error.response?.data?.message || error.message));
            message.error('Failed to create Year Level: ' + (error.response?.data?.message || error.message));
        }
    };

    // **Implement handleEditYearLevel with Duplicate Check**
    const handleEditYearLevel = async (id, updatedData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(tag => 
                tag.year_level.toLowerCase().trim() === updatedData.year_level.toLowerCase().trim() && tag.id !== id
            );

            if (duplicate) {
                message.error('A year level with this name already exists.');
                setError('A year level with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to update
            await axios.put(`/api/yearlevel/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('Year Level updated successfully!');
            setIsEditModalVisible(false);
            setModalData(null);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error updating year level:', error);
            setError('Failed to update Year Level: ' + (error.response?.data?.message || error.message));
            message.error('Failed to update Year Level: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle print preview functionality
    const openPrintPreview = () => {
        setIsPrintPreviewVisible(true);
    };

    const closePrintPreview = () => {
        setIsPrintPreviewVisible(false);
    };

    // Handle print functionality
    const handlePrint = () => {
        const tableHTML = generatePrintHTML(filteredData, showArchived);
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(tableHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
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
                gap: '10px' 
            }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by year level"
                        style={{ width: '100%', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => debouncedHandleSearch(e.target.value)}
                        allowClear
                    />
                    <Button 
                        icon={<FileTextOutlined />} 
                        onClick={handlePrint}
                        type="primary"
                    >
                        Print
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Year Levels' : 'Show Archived Year Levels'}
                    </Button>
                </Space>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {!showArchived && (
                        <>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Create New Year Level
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected year levels?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Remove Selected Year Levels
                                </Button>
                            </Popconfirm>
                        </>
                    )}

                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected year levels?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="default"
                                disabled={selectedRowKeys.length === 0}
                            >
                                Restore Selected Year Levels
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>

            <YearLevelTable
                rowSelection={rowSelection}
                data={filteredData}
                handleDeleteYearLevel={handleDeleteYearLevel}
                handleRestoreYearLevel={handleRestoreYearLevel} 
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading} 
            />

            <YearLevelModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={[...data, ...archivedData]} // Pass combined data for duplicate checks
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateYearLevel={handleCreateYearLevel} // Pass the create handler
                handleEditYearLevel={handleEditYearLevel} // Pass the edit handler
                isPrintPreviewVisible={isPrintPreviewVisible}
                setIsPrintPreviewVisible={setIsPrintPreviewVisible}
                closePrintPreview={closePrintPreview}
            />

            {error && <Text type="danger">{error}</Text>} {/* Display error message if any */}
        </div>
    )};

    export default YearLevelPage;
