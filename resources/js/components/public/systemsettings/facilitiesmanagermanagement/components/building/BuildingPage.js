import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import BuildingTable from './BuildingTable';
import BuildingModal from './BuildingModal';
import { buildingData } from './BuildingData'; // Your initial building data

const { Text } = Typography;

const BuildingPage = () => {
    const [data, setData] = useState(buildingData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(buildingData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(building =>
            building.building_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteBuilding = (id) => {
        const buildingToDelete = data.find(building => building.id === id);
        if (buildingToDelete) {
            setData(data.filter(building => building.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...buildingToDelete, isArchived: true }]); // Add to archived data
            message.success('Building archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedBuildings = data.filter(building => selectedRowKeys.includes(building.id));
        const remainingBuildings = data.filter(building => !selectedRowKeys.includes(building.id));

        setData(remainingBuildings); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedBuildings.map(building => ({ ...building, isArchived: true }))]); // Archive selected buildings
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedBuildings.length} building(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedBuildings = archivedData.filter(building => selectedRowKeys.includes(building.id));
        const remainingArchivedBuildings = archivedData.filter(building => !selectedRowKeys.includes(building.id));

        setArchivedData(remainingArchivedBuildings); // Remove selected from archived data
        setData([...data, ...selectedBuildings.map(building => ({ ...building, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedBuildings.length} building(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateBuilding = () => {
        setIsCreateModalVisible(true); // Show the Create Building Modal
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
                        placeholder="Search by building name"
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
                        {showArchived ? 'Show Active Buildings' : 'Show Archived Buildings'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateBuilding}
                    >
                        Create New Building
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Buildings
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Buildings
                        </Button>
                    )}
                </Space>
            </div>
            <BuildingTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteBuilding={handleDeleteBuilding}
            />
            <BuildingModal
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

export default BuildingPage;
