import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import YearLevelTable from './YearLevelTable';
import YearLevelModal from './YearLevelModal';
import { yearLevelData } from './YearLevelData'; // Replace with your initial year level data

const { Text } = Typography;

const YearLevelPage = () => {
    const [data, setData] = useState(yearLevelData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(yearLevelData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(year =>
            year.year_level.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteYearLevel = (id) => {
        const yearToDelete = data.find(year => year.id === id);
        if (yearToDelete) {
            setData(data.filter(year => year.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...yearToDelete, isArchived: true }]); // Add to archived data
            message.success('Year level archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedYears = data.filter(year => selectedRowKeys.includes(year.id));
        const remainingYears = data.filter(year => !selectedRowKeys.includes(year.id));

        setData(remainingYears); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedYears.map(year => ({ ...year, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedYears.length} year level(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedYears = archivedData.filter(year => selectedRowKeys.includes(year.id));
        const remainingArchivedYears = archivedData.filter(year => !selectedRowKeys.includes(year.id));

        setArchivedData(remainingArchivedYears); // Remove selected from archived data
        setData([...data, ...selectedYears.map(year => ({ ...year, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedYears.length} year level(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateYearLevel = () => {
        setIsCreateModalVisible(true); // Show the Create Year Level Modal
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
                flexWrap: 'wrap', // Allow wrapping when screen size reduces
            }}>
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by year level"
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />}>Print</Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Year Levels' : 'Show Archived Year Levels'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateYearLevel}
                    >
                        Create New Year Level
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Year Levels
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Year Levels
                        </Button>
                    )}
                </Space>
            </div>
            <YearLevelTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteYearLevel={handleDeleteYearLevel}
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
            />
        </div>
    );
};

export default YearLevelPage;
