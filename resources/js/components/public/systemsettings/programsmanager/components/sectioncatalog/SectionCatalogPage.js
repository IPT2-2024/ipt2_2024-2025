import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import SectionCatalogTable from './SectionCatalogTable';
import SectionCatalogModal from './SectionCatalogModal';
import { sectionCatalogData } from './SectionCatalogData'; // Replace with your initial section data

const { Text } = Typography;

const SectionCatalogPage = () => {
    const [data, setData] = useState(sectionCatalogData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(sectionCatalogData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(section =>
            section.section_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteSection = (id) => {
        const sectionToDelete = data.find(section => section.id === id);
        if (sectionToDelete) {
            setData(data.filter(section => section.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...sectionToDelete, isArchived: true }]); // Add to archived data
            message.success('Section archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedSections = data.filter(section => selectedRowKeys.includes(section.id));
        const remainingSections = data.filter(section => !selectedRowKeys.includes(section.id));

        setData(remainingSections); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedSections.map(section => ({ ...section, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSections.length} section(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedSections = archivedData.filter(section => selectedRowKeys.includes(section.id));
        const remainingArchivedSections = archivedData.filter(section => !selectedRowKeys.includes(section.id));

        setArchivedData(remainingArchivedSections); // Remove selected from archived data
        setData([...data, ...selectedSections.map(section => ({ ...section, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSections.length} section(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateSection = () => {
        setIsCreateModalVisible(true); // Show the Create Section Modal
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
                        placeholder="Search by section"
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
                        {showArchived ? 'Show Active Sections' : 'Show Archived Sections'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateSection}
                    >
                        Create New Section
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Sections
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Sections
                        </Button>
                    )}
                </Space>
            </div>
            <SectionCatalogTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSection={handleDeleteSection}
            />
            <SectionCatalogModal
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

export default SectionCatalogPage;
