import React from 'react';
import { Tabs } from 'antd';
import BuildingPage from './components/BuildingPage';
import FloorPage from './components/FloorPage';  // Import the FloorPage component
import RoomTagsPage from './components/RoomTagsPage';  // Import RoomTagsPage if you created it
import MainDashboard from '../../dashboard/components/MainDashboard.js';

const { TabPane } = Tabs;

const FacilitiesManagerManagementPage = () => {
  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Facilities Manager Management</h1>
        
        {/* Blue Divider with 10% length */}
        <div style={{
          borderBottom: '2px solid #1890ff', 
          width: '10%', 
          marginBottom: '20px'
        }} />

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Building" key="1">
            <BuildingPage />
          </TabPane>
          <TabPane tab="Floor" key="2">
            <FloorPage /> {/* Add FloorPage here */}
          </TabPane>
          <TabPane tab="Room Tags" key="3">
            <RoomTagsPage />
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default FacilitiesManagerManagementPage;
