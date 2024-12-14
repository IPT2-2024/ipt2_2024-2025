import React from 'react';
import { Tabs } from 'antd';
import { ApartmentOutlined, TeamOutlined } from '@ant-design/icons';
import AcademicProgramsManagement from './components/academicprogramsmanagement/AcademicProgramsManagement';  // Corrected import path
import AcademicProgramsDepartment from './components/academicprogramsdepartment/AcademicProgramsDepartment';  // Corrected import path
import MainDashboard from '../dashboard/components/MainDashboard';

const { TabPane } = Tabs;

const AcademicProgramsPage = () => {
  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Academic Programs</h1>
        <div style={{
          borderBottom: '2px solid #1890ff',
          width: '10%',
          marginBottom: '20px'
        }} />
        <Tabs defaultActiveKey="1" type="card">
          <TabPane 
            tab={<><ApartmentOutlined style={{ marginRight: '8px' }} />Academic Programs Management</>} 
            key="1"
          >
            <AcademicProgramsManagement />
          </TabPane>
          <TabPane 
            tab={<><TeamOutlined style={{ marginRight: '8px' }} />Academic Programs Department</>} 
            key="2"
          >
            <AcademicProgramsDepartment />
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default AcademicProgramsPage;
