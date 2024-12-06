import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import FloorTable from '../components/FloorPage/FloorTable';
import FloorModal from '../components/FloorPage/FloorModal';
import { floorData } from '../components/FloorPage/FloorData';

const { Text } = Typography;

const FloorPage = () => {
    const [data, setData] = useState(floorData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(floorData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(floor =>
            floor.floor_level.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteFloor = (id) => {
        const floorToDelete = data.find(floor => floor.id === id);
        if (floorToDelete) {
            setData(data.filter(floor => floor.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...floorToDelete, isArchived: true }]); // Add to archived data
            message.success('Floor archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedFloors = data.filter(floor => selectedRowKeys.includes(floor.id));
        const remainingFloors = data.filter(floor => !selectedRowKeys.includes(floor.id));

        setData(remainingFloors); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedFloors.map(floor => ({ ...floor, isArchived: true }))]); // Archive selected floors
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedFloors.length} floor(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedFloors = archivedData.filter(floor => selectedRowKeys.includes(floor.id));
        const remainingArchivedFloors = archivedData.filter(floor => !selectedRowKeys.includes(floor.id));

        setArchivedData(remainingArchivedFloors); // Remove selected from archived data
        setData([...data, ...selectedFloors.map(floor => ({ ...floor, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedFloors.length} floor(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateFloor = (floorData) => {
        const newFloor = {
            ...floorData,
            id: Date.now(), // Auto-generate ID using current timestamp
            created_at: new Date().toISOString(), // Set created_at to current date and time
            updated_at: new Date().toISOString(), // Set updated_at to current date and time
        };
        setData([...data, newFloor]); // Add the new floor to the data
        message.success('New floor created successfully');
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            <div
                style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}
            >
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by floor level"
                        style={{ width: '100%', maxWidth: '300px' }} // Made width 100% and max-width 300px
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} style={{ width: '100%' }}>
                        Print
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Floors' : 'Show Archived Floors'}
                    </Button>
                </Space>
                <Space
                    wrap
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        width: '100%', // Ensure the buttons span the entire width on small screens
                    }}
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)} // This will correctly call handleCreateFloor
                        style={{ width: '100%' }} // Ensure buttons take full width on small screens
                    >
                        Create New Floor
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                        style={{ width: '100%' }} // Ensure buttons take full width on small screens
                    >
                        Remove Selected Floors
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                            style={{ width: '100%' }} // Ensure buttons take full width on small screens
                        >
                            Restore Selected Floors
                        </Button>
                    )}
                </Space>
            </div>
            <FloorTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteFloor={handleDeleteFloor}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
            />
            <FloorModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={data}
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateFloor={handleCreateFloor}
            />
        </div>
    );
};

export default FloorPage;
