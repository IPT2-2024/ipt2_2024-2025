// SectionCatalogPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import SectionCatalogTable from './components/SectionCatalogTable';
import SectionCatalogModal from './components/SectionCatalogModal';
import { debounce } from 'lodash'; // Import debounce for search optimization

const { Text } = Typography;

const SectionCatalogPage = () => {
    const [data, setData] = useState([]); // Active sections
    const [archivedData, setArchivedData] = useState([]); // Archived sections
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for bulk actions
    const [searchValue, setSearchValue] = useState(''); // Search input
    const [showArchived, setShowArchived] = useState(false); // Toggle between active and archived
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Create modal visibility
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit modal visibility
    const [modalData, setModalData] = useState(null); // Data for editing
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const pageSize = 10; // Items per page

    const token = localStorage.getItem('auth_token'); 

    // Fetch active sections
    const fetchSections = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/sections', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const sections = response.data;
            const activeSections = sections.filter(section => !section.isArchived);
            const archivedSections = sections.filter(section => section.isArchived);

            setData(activeSections);
            setArchivedData(archivedSections);

            // Set filtered data based on current view
            setFilteredData(showArchived ? archivedSections : activeSections);
            setCurrentPage(1); 
        } catch (err) {
            console.error('Error fetching sections:', err);
            setError('Failed to fetch section data.');
            message.error('Failed to fetch section data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch archived sections (if needed)
    const fetchArchivedSections = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get('/api/sections?deleted=only', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const archivedSections = response.data.map(section => ({
                ...section,
                isArchived: true,
            }));

            setArchivedData(archivedSections);

            if (showArchived) {
                setFilteredData(archivedSections);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error fetching archived sections:', err);
            setError('No archived content available at the moment.');
            message.error('No archived content available at the moment.');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchSections();
    }, []);

    // Update filtered data based on search, data, archivedData, and showArchived
    useEffect(() => {
        const currentList = showArchived ? archivedData : data;
        const filtered = currentList.filter(section =>
            String(section.section_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchValue, data, archivedData, showArchived]);

    // Fetch data when showArchived changes
    useEffect(() => {
        if (showArchived) {
            fetchArchivedSections();
        } else {
            fetchSections();
        }
    }, [showArchived]);

    // Debounced search handler
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        debouncedHandleSearch(value);
    };

    // Handle single section deletion (archive)
    const handleDeleteSection = async (id) => {
        setError(null); 
        try {
            await axios.delete(`/api/sections/${id}`, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const sectionToDelete = data.find(section => section.id === id);
            if (sectionToDelete) {
                setData(data.filter(section => section.id !== id));
                setArchivedData([...archivedData, { ...sectionToDelete, isArchived: true, deleted_at: new Date().toISOString() }]);
                message.success('Section archived successfully');
            }
        } catch (error) {
            console.error('Error archiving section:', error);
            setError('Failed to archive section.');
            message.error('Failed to archive section.');
        }
    };

    // Handle multiple sections deletion (archive)
    const handleDeleteSelected = async () => {
        const selectedSections = data.filter(section => selectedRowKeys.includes(section.id));
        if (selectedSections.length === 0) return;

        setError(null); 
        try {
            await Promise.all(
                selectedSections.map(section =>
                    axios.delete(`/api/sections/${section.id}`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            const now = new Date().toISOString();
            const archivedThese = selectedSections.map(section => ({ ...section, isArchived: true, deleted_at: now }));
            const remainingSections = data.filter(section => !selectedRowKeys.includes(section.id));

            setData(remainingSections);
            setArchivedData([...archivedData, ...archivedThese]);
            setSelectedRowKeys([]);
            message.success(`${selectedSections.length} section(s) archived successfully`);
        } catch (error) {
            console.error('Error archiving selected sections:', error);
            setError('Failed to archive selected sections.');
            message.error('Failed to archive selected sections.');
        }
    };

    // Handle single section restoration
    const handleRestoreSection = async (id) => {
        setError(null); 
        try {
            await axios.post(`/api/sections/${id}/restore`, {}, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            const sectionToRestore = archivedData.find(section => section.id === id);
            if (sectionToRestore) {
                const updatedArchived = archivedData.filter(section => section.id !== id);
                const restoredSection = { ...sectionToRestore, isArchived: false };
                delete restoredSection.deleted_at;
                setArchivedData(updatedArchived);
                setData([...data, restoredSection]);
                message.success('Section restored successfully');
            }
        } catch (error) {
            console.error('Error restoring section:', error);
            setError('Failed to restore section.');
            message.error('Failed to restore section.');
        }
    };

    // Handle multiple sections restoration
    const handleRestoreSelected = async () => {
        const selectedSections = archivedData.filter(section => selectedRowKeys.includes(section.id));
        if (selectedSections.length === 0) return;

        setError(null); 
        try {
            await Promise.all(
                selectedSections.map(section =>
                    axios.post(`/api/sections/${section.id}/restore`, {}, { 
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const remainingArchivedSections = archivedData.filter(section => !selectedRowKeys.includes(section.id));
            const restoredSections = selectedSections.map(section => {
                const { deleted_at, ...rest } = section;
                return { ...rest, isArchived: false };
            });

            setArchivedData(remainingArchivedSections);
            setData([...data, ...restoredSections]);
            setSelectedRowKeys([]);
            message.success(`${selectedSections.length} section(s) restored successfully`);
        } catch (error) {
            console.error('Error restoring sections:', error);
            setError('Failed to restore sections.');
            message.error('Failed to restore sections.');
        }
    };

    // Handle data reload after create, edit, delete, or restore actions
    const reloadData = async () => {
        try {
            await fetchSections();
        } catch (error) {
            // fetchSections already handles errors
        }
    };

    // **Implement handleCreateSection with Duplicate Check**
    const handleCreateSection = async (sectionData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(section => 
                section.section_name.toLowerCase().trim() === sectionData.section_name.toLowerCase().trim()
            );

            if (duplicate) {
                message.error('A section with this name already exists.');
                setError('A section with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to create
            await axios.post('/api/sections', sectionData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Section created successfully!');
            setIsCreateModalVisible(false);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error creating section:', error);
            setError('Failed to create section.');
            message.error('Failed to create section.');
        }
    };

    // **Implement handleEditSection with Duplicate Check**
    const handleEditSection = async (id, updatedData) => {
        try {
            // **Duplicate Check**
            const duplicate = [...data, ...archivedData].some(section => 
                section.section_name.toLowerCase().trim() === updatedData.section_name.toLowerCase().trim() && section.id !== id
            );

            if (duplicate) {
                message.error('A section with this name already exists.');
                setError('A section with this name already exists.');
                return; // Prevent further execution
            }

            // Proceed to update
            await axios.put(`/api/sections/${id}`, updatedData, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success('Section updated successfully!');
            setIsEditModalVisible(false);
            setModalData(null);

            // **Re-fetch data to update the table**
            reloadData();
        } catch (error) { // Ensure 'error' is defined here
            console.error('Error updating section:', error);
            setError('Failed to update section.');
            message.error('Failed to update section.');
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Section Catalog</title></head><body>');
            printWindow.document.write('<h2>Section Catalog Data</h2>');
            printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%;">');
            printWindow.document.write('<thead><tr><th>Section Name</th>');
            if (!showArchived) {
                printWindow.document.write('<th>Created At</th><th>Updated At</th>');
            } else {
                printWindow.document.write('<th>Deleted At</th>');
            }
            printWindow.document.write('</tr></thead><tbody>');

            filteredData.forEach(section => {
                printWindow.document.write('<tr>');
                printWindow.document.write(`<td>${section.section_name ?? ''}</td>`);
                if (!showArchived) {
                    printWindow.document.write(`<td>${section.created_at ? new Date(section.created_at).toLocaleString() : ''}</td>`);
                    printWindow.document.write(`<td>${section.updated_at ? new Date(section.updated_at).toLocaleString() : ''}</td>`);
                } else {
                    printWindow.document.write(`<td>${section.deleted_at ? new Date(section.deleted_at).toLocaleString() : ''}</td>`);
                }
                printWindow.document.write('</tr>');
            });

            printWindow.document.write('</tbody></table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };

    // Row selection for bulk actions
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            {/* Search and Action Buttons */}
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <Space wrap style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by section name"
                        style={{ width: '100%', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} style={{ width: '100%' }} onClick={handlePrint}>
                        Print
                    </Button>
                    <Button
                        icon={<UnorderedListOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                    >
                        {showArchived ? 'Show Active Sections' : 'Show Archived Sections'}
                    </Button>
                </Space>
                <Space
                    wrap
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}
                >
                    {!showArchived && (
                        <>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalVisible(true)}
                                style={{ width: '100%' }}
                            >
                                Create New Section
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete the selected sections?"
                                onConfirm={handleDeleteSelected}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    disabled={selectedRowKeys.length === 0}
                                    style={{ width: '100%' }}
                                >
                                    Remove Selected Sections
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {showArchived && (
                        <Popconfirm
                            title="Are you sure you want to restore the selected sections?"
                            onConfirm={handleRestoreSelected}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                style={{ width: '100%' }}
                            >
                                Restore Selected Sections
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            
            {/* Sections Table */}
            <SectionCatalogTable
                rowSelection={rowSelection}
                data={filteredData}
                setIsEditModalVisible={setIsEditModalVisible}
                setModalData={setModalData}
                handleDeleteSection={handleDeleteSection}
                handleRestoreSection={handleRestoreSection} 
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                showArchived={showArchived}
                loading={loading}
            />

            {/* Section Modal */}
            <SectionCatalogModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateSection={handleCreateSection}
                handleEditSection={handleEditSection}
                data={[...data, ...archivedData]} // Pass combined data for duplicate checks
            />

            {/* Error Message */}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default SectionCatalogPage;
