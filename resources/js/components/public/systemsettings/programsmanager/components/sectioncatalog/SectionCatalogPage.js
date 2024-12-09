
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message,Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import SectionCatalogTable from './components/SectionCatalogTable';
import SectionCatalogModal from './components/SectionCatalogModal';

const { Text } = Typography;

const SectionCatalogPage = () => {
   
    const [data, setData] = useState([]); 
    const [archivedData, setArchivedData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [searchValue, setSearchValue] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); 
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
    const [modalData, setModalData] = useState(null); 
    const [showArchived, setShowArchived] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1); 
    const pageSize = 10; 

    const token = localStorage.getItem('auth_token'); 

    
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

    
    useEffect(() => {
        fetchSections();
    }, []);

    
    useEffect(() => {
        const baseData = showArchived ? archivedData : data;
        const filtered = baseData.filter(section =>
            String(section.section_name || '').toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); 
    }, [searchValue, data, archivedData, showArchived]);

    
    useEffect(() => {
        if (showArchived) {
            fetchArchivedSections();
        } else {
            fetchSections();
        }
    }, [showArchived]);

    

    
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    
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

    
    const handleCreateSection = async (sectionData) => {
        setError(null); 
        try {
            const response = await axios.post('/api/sections', sectionData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const newSection = response.data; 

            message.success('New section created successfully');
            setIsCreateModalVisible(false);

            
            fetchSections();
        } catch (error) {
            console.error('Error creating section:', error);
            setError('Failed to create section.');
            message.error('Failed to create section.');
        }
    };

    
    const handleEditSection = async (id, updatedData) => {
        setError(null); 
        try {
            await axios.put(`/api/sections/${id}`, updatedData, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            
            const updatedSections = data.map(section => 
                section.id === id ? { ...section, ...updatedData, updated_at: new Date().toISOString() } : section
            );
            setData(updatedSections);
            setIsEditModalVisible(false);
            message.success('Section updated successfully');
        } catch (error) {
            console.error('Error updating section:', error);
            setError('Failed to update section.');
            message.error('Failed to update section.');
        }
    };

    
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=650,width=900');
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
            // printWindow.document.write(`<td>${section.id ?? ''}</td>`);
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
    };

   
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div style={{ padding: '20px', background: '#fff' }}>
            {}
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
            {}
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
            {}
            <SectionCatalogModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                modalData={modalData}
                handleCreateSection={handleCreateSection}
                handleEditSection={handleEditSection}
            />
            {}
            {error && <Text type="danger">{error}</Text>}
        </div>
    )};

    export default SectionCatalogPage;
