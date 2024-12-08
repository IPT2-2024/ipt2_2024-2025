import React from 'react';
import { Tabs } from 'antd';
import { AppstoreAddOutlined, DatabaseOutlined, FileSearchOutlined, BranchesOutlined } from '@ant-design/icons'; // Import icons
import YearLevelPage from './components/yearlevel/YearLevelPage.js'; // Import Year Level component
import CollegeProgramsPage from './components/collegeprograms/CollegeProgramsPage.js'; // Import College Programs component
import SectionCatalogPage from './components/sectioncatalog/SectionCatalogPage.js'; // Import Section Catalog component
import DepartmentsPage from './components/departments/DepartmentsPage.js'; // Import Departments component
import MainDashboard from '../../dashboard/components/MainDashboard.js';

const { TabPane } = Tabs;

const ProgramsManagerManagementPage = () => {
  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Programs Manager Management</h1>

        {/* Blue Divider with 10% length */}
        <div style={{
          borderBottom: '2px solid #1890ff', 
          width: '10%', 
          marginBottom: '20px'
        }} />

        <Tabs defaultActiveKey="1" type="card">
          <TabPane 
            tab={<><AppstoreAddOutlined style={{ marginRight: '8px' }} />Year Level</>} 
            key="1"
          >
            <YearLevelPage />
          </TabPane>

          <TabPane 
            tab={<><DatabaseOutlined style={{ marginRight: '8px' }} />College Programs</>} 
            key="2"
          >
            <CollegeProgramsPage />
          </TabPane>

          <TabPane 
            tab={<><FileSearchOutlined style={{ marginRight: '8px' }} />Section Catalog</>} 
            key="3"
          >
            <SectionCatalogPage />
          </TabPane>

          <TabPane 
            tab={<><BranchesOutlined style={{ marginRight: '8px' }} />Departments</>} 
            key="4"
          >
            <DepartmentsPage />
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default ProgramsManagerManagementPage;
