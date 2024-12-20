// BuildingPage.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Typography, message, Popconfirm } from 'antd';
import { FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
import BuildingTable from './components/BuildingTable';
import BuildingModal from './components/BuildingModal';
import { debounce } from 'lodash'; // For debouncing search input

const { Text } = Typography;

const BuildingPage = () => {
    const [data, setData] = useState([]); // Active buildings
    const [archivedData, setArchivedData] = useState([]); // Archived buildings
    const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // Toggle archived data view

    // Fetch building data using Axios
    useEffect(() => {
        const fetchBuildings = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    message.error('Authorization token is missing');
                    setLoading(false);
                    return;
                }

                const apiEndpoint = showArchived 
                    ? '/api/building?deleted=only' // For archived
                    : '/api/building';             // For active buildings only

                const response = await axios.get(apiEndpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Check if the response is an array
                const buildings = Array.isArray(response.data) ? response.data : [];
                
                // Set data based on the `showArchived` state
                if (showArchived) {
                    setArchivedData(buildings); // Set archived data
                    setFilteredData(buildings); // Set filtered data to archived
                } else {
                    setData(buildings);         // Set active data
                    setFilteredData(buildings); // Set filtered data to active
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching buildings", err);
                setError(err);
                setLoading(false);
                message.error('Failed to fetch buildings.');
            }
        };

        fetchBuildings();
    }, [showArchived]);  // Re-run the effect when `showArchived` changes

    const reloadData = async () => {
        setSearchValue(''); // Reset search
        setShowArchived(false); // Reset archived filter to show active buildings only

        setLoading(true); // Show loading indicator

        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/building', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Check if the response contains an array, and handle the case of no buildings
            if (Array.isArray(response.data)) {
                const buildings = response.data.map(building => ({
                    ...building,
                    status: building.deleted_at ? 'archived' : 'active',
                    // floor_name: building.floor ? building.floor.floor_level : 'No Floor',
                }));

                setData(buildings);
                setFilteredData(buildings);
            } else {
                // Handle case if the data isn't an array
                message.error('Error: Expected data is not an array.');
                setData([]); // Set data to an empty array if there's no valid data
                setFilteredData([]); // Also reset filtered data
            }
        } catch (error) {
            console.error('API error:', error);
            message.error('Failed to load buildings. Please try again later.');
            setData([]); // Ensure no data is shown if the request fails
            setFilteredData([]); // Reset filtered data in case of error
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    const toggleArchivedView = () => {
        setShowArchived((prev) => !prev);
    };

    // Update filteredData based on searchValue and showArchived
    useEffect(() => {
        let baseData = showArchived ? archivedData : data;

        if (searchValue.trim() === '') {
            setFilteredData(baseData);
            return;
        }

        const isNumeric = !isNaN(searchValue.trim()) && searchValue.trim() !== '';

        let filtered;
        if (isNumeric) {
            // When numeric, search by ID (exact) AND Building Name (partial)
            const byID = baseData.filter(building =>
                building.id.toString() === searchValue.trim()
            );

            const byName = baseData.filter(building =>
                building.building_name && building.building_name.toLowerCase().includes(searchValue.toLowerCase())
            );

            const byIDIds = new Set(byID.map(b => b.id));
            filtered = [...byID, ...byName.filter(b => !byIDIds.has(b.id))];
        } else {
            // Non-numeric: Search by Building Name only
            filtered = baseData.filter(building =>
                building.building_name && building.building_name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [searchValue, data, archivedData, showArchived]);

    // **Debounced Search Handler**
    const debouncedHandleSearch = debounce((value) => {
        setSearchValue(value);
    }, 300); // 300ms debounce delay

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleReset = () => {
        setSearchValue('');
    };

    const handleDeleteBuilding = async (buildingId) => {
        try {
            const token = localStorage.getItem('auth_token');
            // Send DELETE request to backend
            await axios.delete(`/api/building/${buildingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Reload the data after successful deletion
            reloadData(); // Ensure you have the `reloadData` function to fetch fresh data
            message.success('Building deleted successfully');
        } catch (error) {
            message.error('Failed to delete building: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteSelected = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            message.error('Authorization token is missing');
            return;
        }
    
        // Loop through each selected ID and send a DELETE request
        try {
            for (let id of selectedRowKeys) {
                await axios.delete(`/api/building/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
    
            // Remove deleted buildings from the state
            setData((prevData) => prevData.filter((building) => !selectedRowKeys.includes(building.id)));
    
            // Clear the selected row keys
            setSelectedRowKeys([]);
    
            message.success('Selected buildings deleted successfully');
        } catch (error) {
            message.error('Error deleting buildings');
        }
    };

    const handleRestoreSelected = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            console.log("Selected IDs for Restore:", selectedRowKeys);  // Log the selected IDs
    
            // Ensure selectedRowKeys is an array and not null/undefined
            const validSelectedRowKeys = Array.isArray(selectedRowKeys) ? selectedRowKeys : [];
    
            if (validSelectedRowKeys.length === 0) {
                message.warning('No rows selected for restore.');
                return;
            }
    
            // Send a POST request for each selected building
            const restorePromises = validSelectedRowKeys.map(async (id) => {
                return axios.post(`/api/building/${id}/restore`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
    
            // Wait for all requests to finish
            await Promise.all(restorePromises);
    
            // Reload the data after restore
            reloadData(); 
    
            // Update the data on the frontend once all buildings are restored
            const newData = data.map((building) =>
                validSelectedRowKeys.includes(building.id) ? { ...building, deleted_at: null } : building
            );
            setData(newData);  // Update the state with restored buildings
            message.success(`${validSelectedRowKeys.length} building(s) restored`);
        } catch (error) {
            message.error('Failed to restore buildings: ' + (error.response?.data?.message || error.message));
        } finally {
            setSelectedRowKeys([]);  // Reset selected rows after operation
        }
    };

    // **Updated handleCreateBuilding with Duplicate Check**
    const handleCreateBuilding = async (values) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                message.error('Authorization token is missing');
                return;
            }

            // **Duplicate Check**
            const duplicate = data.some(building => 
                building.building_name.toLowerCase() === values.building_name.trim().toLowerCase()
            ) || archivedData.some(building => 
                building.building_name.toLowerCase() === values.building_name.trim().toLowerCase()
            );

            if (duplicate) {
                message.error('A building with this name already exists.');
                return; // Prevent further execution
            }

            setLoading(true);

            const response = await axios.post('/api/building', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData((prevData) => [...prevData, response.data.building]);
            setIsCreateModalVisible(false);
            message.success('Building created successfully');
            reloadData();
        } catch (error) {
            setError(error.message);
            message.error('Failed to create building');
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreBuilding = async (id) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`/api/building/${id}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Reload data to reflect changes after restoration
            reloadData();
            message.success('Building restored successfully');
        } catch (error) {
            message.error('Failed to restore building: ' + (error.response?.data?.message || error.message));
        }
    };
    
    // **handleEditBuilding Function with Duplicate Check**
    const handleEditBuilding = async (id, updatedValues) => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                message.error('Authorization token is missing');
                return;
            }

            // **Duplicate Check**
            const duplicate = data.some(building => 
                building.building_name.toLowerCase() === updatedValues.building_name.trim().toLowerCase() && building.id !== id
            ) || archivedData.some(building => 
                building.building_name.toLowerCase() === updatedValues.building_name.trim().toLowerCase() && building.id !== id
            );

            if (duplicate) {
                message.error('A building with this name already exists.');
                return; // Prevent further execution
            }

            setLoading(true);

            const response = await axios.put(`/api/building/${id}`, updatedValues, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedData = data.map((building) =>
                building.id === id ? { ...building, ...response.data.building } : building
            );
            setData(updatedData);
            setIsEditModalVisible(false);
            message.success('Building updated successfully');
            reloadData();
        } catch (error) {
            message.error('Failed to update building');
        } finally {
            setLoading(false);
        }
    };

    // Print functionality
    const printTable = () => {
        const printWindow = window.open('', '', 'height=650, width=900');
        if (!printWindow) return; // If popup blocked

        printWindow.document.write('<html><head><title>Building Table</title></head><body>');
        printWindow.document.write('<h2>Building Table</h2>');
        printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">');
        printWindow.document.write('<thead><tr><th>Building Name</th><th>Created</th><th>Updated</th></tr></thead>');
        printWindow.document.write('<tbody>');
        filteredData.forEach((item) => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${item.building_name ?? ''}</td>`);
            // printWindow.document.write(`<td>${item.floor_name ?? ''}</td>`); // Assuming floor_name is available
            const createdAtValue = item.created_at ? new Date(item.created_at).toLocaleString() : '';
            const updatedAtValue = item.updated_at ? new Date(item.updated_at).toLocaleString() : '';
            printWindow.document.write(`<td>${createdAtValue}</td>`);
            printWindow.document.write(`<td>${updatedAtValue}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody>');
        printWindow.document.write('</table>');
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
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                {/* Search and Buttons container */}
                <Space wrap style={{ display: 'flex', gap: '10px' }}>
                    <Input.Search
                        value={searchValue}
                        placeholder="Search by Building Name or ID"
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        onSearch={handleSearch}
                        onChange={(e) => debouncedHandleSearch(e.target.value)}
                        allowClear
                    />
                    <Button icon={<FileTextOutlined />} onClick={printTable}>
                        Print
                    </Button>
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
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        Create Building
                    </Button>
                    {!showArchived && (
                    <Popconfirm
                        title={`Are you sure you want to remove ${selectedRowKeys.length} building(s)?`}
                        onConfirm={handleDeleteSelected} // Calls the delete function on confirmation
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            disabled={selectedRowKeys.length === 0} // Disable if no rows selected
                        >
                            Remove Selected Buildings
                        </Button>
                    </Popconfirm>
                    )}

                    {showArchived && (
                        <Button
                            disabled={selectedRowKeys.length === 0}
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
                handleRestoreBuilding={handleRestoreBuilding}
                loading={loading}
                reloadData={reloadData}
            />
            <BuildingModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                isCreateModalVisible={isCreateModalVisible}
                setIsCreateModalVisible={setIsCreateModalVisible}
                data={[...data, ...archivedData]} // Pass combined data for duplicate checks
                setData={setData}
                modalData={modalData}
                setModalData={setModalData}
                handleCreateBuilding={handleCreateBuilding}
                handleEditBuilding={handleEditBuilding} // Pass the edit handler
                reloadData={reloadData}
            />
            {error && <Text type="danger">{error}</Text>}
        </div>
    );
};

export default BuildingPage;
