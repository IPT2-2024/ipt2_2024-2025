import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import SemestralPeriodTable from './SemestralPeriodTable';
import SemestralPeriodModal from './SemestralPeriodModal';
import { semestralPeriodData } from './SemestralPeriodData'; // Replace with your initial semestral period data

const { Text } = Typography;

const SemestralPeriodPage = () => {
    const [data, setData] = useState(semestralPeriodData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(semestralPeriodData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(period =>
            period.semester_period.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleDeleteSemester = (id) => {
        const semesterToDelete = data.find(period => period.id === id);
        if (semesterToDelete) {
            setData(data.filter(period => period.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...semesterToDelete, isArchived: true }]); // Add to archived data
            message.success('Semester period archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedSemesters = data.filter(period => selectedRowKeys.includes(period.id));
        const remainingSemesters = data.filter(period => !selectedRowKeys.includes(period.id));

        setData(remainingSemesters); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedSemesters.map(period => ({ ...period, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSemesters.length} semester period(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedSemesters = archivedData.filter(period => selectedRowKeys.includes(period.id));
        const remainingArchivedSemesters = archivedData.filter(period => !selectedRowKeys.includes(period.id));

        setArchivedData(remainingArchivedSemesters); // Remove selected from archived data
        setData([...data, ...selectedSemesters.map(period => ({ ...period, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedSemesters.length} semester period(s) restored successfully`);
    };

    const handleCreateSemestralPeriod = () => {
        setIsCreateModalVisible(true); // Show the Create Modal
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
                        placeholder="Search by semester period"
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
                        {showArchived ? 'Show Active Semesters' : 'Show Archived Semesters'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateSemestralPeriod}
                    >
                        Create New Semester Period
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Semesters
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Semesters
                        </Button>
                    )}
                </Space>
            </div>
            <SemestralPeriodTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSemester={handleDeleteSemester}
            />
            <SemestralPeriodModal
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

export default SemestralPeriodPage;
