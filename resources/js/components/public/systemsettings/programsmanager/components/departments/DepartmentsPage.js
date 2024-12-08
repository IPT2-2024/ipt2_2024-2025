import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import DepartmentTable from './DepartmentTable'; // Replace with your DepartmentTable component
import DepartmentModal from './DepartmentModal'; // Replace with your DepartmentModal component
import { departmentData } from './DepartmentData'; // Replace with your initial department data

const { Text } = Typography;

const DepartmentsPage = () => {
    const [data, setData] = useState(departmentData); // Store active data
    const [archivedData, setArchivedData] = useState([]); // Store archived data
    const [filteredData, setFilteredData] = useState(departmentData); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    useEffect(() => {
        const filtered = (showArchived ? archivedData : data).filter(department =>
            department.department_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteDepartment = (id) => {
        const departmentToDelete = data.find(department => department.id === id);
        if (departmentToDelete) {
            setData(data.filter(department => department.id !== id)); // Remove from active data
            setArchivedData([...archivedData, { ...departmentToDelete, isArchived: true }]); // Add to archived data
            message.success('Department archived successfully');
        }
    };

    const handleDeleteSelected = () => {
        const selectedDepartments = data.filter(department => selectedRowKeys.includes(department.id));
        const remainingDepartments = data.filter(department => !selectedRowKeys.includes(department.id));

        setData(remainingDepartments); // Remove selected from active data
        setArchivedData([...archivedData, ...selectedDepartments.map(department => ({ ...department, isArchived: true }))]); // Archive selected
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedDepartments.length} department(s) archived successfully`);
    };

    const handleRestoreSelected = () => {
        const selectedDepartments = archivedData.filter(department => selectedRowKeys.includes(department.id));
        const remainingArchivedDepartments = archivedData.filter(department => !selectedRowKeys.includes(department.id));

        setArchivedData(remainingArchivedDepartments); // Remove selected from archived data
        setData([...data, ...selectedDepartments.map(department => ({ ...department, isArchived: false }))]); // Add back to active data
        setSelectedRowKeys([]); // Clear selected keys

        message.success(`${selectedDepartments.length} department(s) restored successfully`);
    };

    // Define the function for opening the Create Modal
    const handleCreateDepartment = () => {
        setIsCreateModalVisible(true); // Show the Create Department Modal
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
                        placeholder="Search by department name"
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
                        {showArchived ? 'Show Active Departments' : 'Show Archived Departments'}
                    </Button>
                </Space>

                {/* Action buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateDepartment}
                    >
                        Create New Department
                    </Button>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                        onClick={handleDeleteSelected}
                    >
                        Remove Selected Departments
                    </Button>
                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                            onClick={handleRestoreSelected}
                        >
                            Restore Selected Departments
                        </Button>
                    )}
                </Space>
            </div>
            <DepartmentTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteDepartment={handleDeleteDepartment}
            />
            <DepartmentModal
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

export default DepartmentsPage;
