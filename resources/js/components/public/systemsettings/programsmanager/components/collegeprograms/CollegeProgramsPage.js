import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import CollegeProgramsTable from './CollegeProgramsTable';
import CollegeProgramsModal from './CollegeProgramsModal';
import { collegeProgramsData } from './CollegeProgramsData'; // Replace with your initial data

const { Text } = Typography;

const CollegeProgramsPage = () => {
    const [data, setData] = useState(collegeProgramsData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(collegeProgramsData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(program =>
            program.college_programs.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteProgram = (id) => {
        const programToDelete = data.find(program => program.id === id);
        if (programToDelete) {
            setData(data.filter(program => program.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...programToDelete, isArchived: true }]); // Add to archived data
            message.success('College Program archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedPrograms = data.filter(program => selectedRowKeys.includes(program.id));
        const remainingPrograms = data.filter(program => !selectedRowKeys.includes(program.id));

        setData(remainingPrograms); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedPrograms.map(program => ({ ...program, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedPrograms.length} college program(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedPrograms = archivedData.filter(program => selectedRowKeys.includes(program.id));
        const remainingArchivedPrograms = archivedData.filter(program => !selectedRowKeys.includes(program.id));

        setArchivedData(remainingArchivedPrograms); // Remove selected from archived data
        setData([...data, ...selectedPrograms.map(program => ({ ...program, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedPrograms.length} college program(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateCollegeProgram = () => {
        setIsCreateModalVisible(true); // Show the Create College Program Modal
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
                        placeholder="Search by program name"
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
                        {showArchived ? 'Show Active Programs' : 'Show Archived Programs'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateCollegeProgram}
                    >
                        Create New College Program
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Programs
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Programs
                        </Button>
                    )}
                </Space>
            </div>
            <CollegeProgramsTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteProgram={handleDeleteProgram}
            />
            <CollegeProgramsModal
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

export default CollegeProgramsPage;
