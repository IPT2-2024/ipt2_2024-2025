import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AcademicYearTable from './AcademicYearTable'; // Replace with your Academic Year Table
import AcademicYearModal from './AcademicYearModal'; // Replace with your Academic Year Modal
import { academicYearData } from './AcademicYearData'; // Replace with your initial academic year data

const { Text } = Typography;

const AcademicYearPage = () => {
    const [data, setData] = useState(academicYearData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(academicYearData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Store selected rows
    const [searchValue, setSearchValue] = useState(''); // Search value
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Create modal visibility
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit modal visibility
    const [modalData, setModalData] = useState(null); // Modal data
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter((year) =>
            year.academic_year.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteAcademicYear = (id) => {
        const yearToDelete = data.find((year) => year.id === id);
        if (yearToDelete) {
            setData(data.filter((year) => year.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...yearToDelete, isArchived: true }]); // Add to archived data
            message.success('Academic year archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedYears = data.filter((year) => selectedRowKeys.includes(year.id));
        const remainingYears = data.filter((year) => !selectedRowKeys.includes(year.id));

        setData(remainingYears); // Remove selected from active data
        setArchivedData([
            ...archivedData,
            ...selectedYears.map((year) => ({ ...year, isArchived: true })), // Archive selected
        ]);
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedYears.length} academic year(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedYears = archivedData.filter((year) => selectedRowKeys.includes(year.id));
        const remainingArchivedYears = archivedData.filter((year) => !selectedRowKeys.includes(year.id));

        setArchivedData(remainingArchivedYears); // Remove selected from archived data
        setData([
            ...data,
            ...selectedYears.map((year) => ({ ...year, isArchived: false })), // Add back to active data
        ]);
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedYears.length} academic year(s) restored successfully`);
    };

    // Open the Create Modal
    const handleCreateAcademicYear = () => {
        setIsCreateModalVisible(true); // Show the Create Academic Year Modal
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
                    flexWrap: 'wrap', // Allow wrapping when screen size reduces
                }}
            >
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by academic year"
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
                        {showArchived ? 'Show Active Academic Years' : 'Show Archived Academic Years'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateAcademicYear}
                    >
                        Create New Academic Year
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Academic Years
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Academic Years
                        </Button>
                    )}
                </Space>
            </div>
            <AcademicYearTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteAcademicYear={handleDeleteAcademicYear}
            />
            <AcademicYearModal
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

export default AcademicYearPage;
