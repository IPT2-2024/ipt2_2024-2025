import React from 'react';
import { Tabs } from 'antd';
import { AppstoreAddOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import StudentEnlistmentPage from './components/studentenlistment/StudentEnlistmentPage.js'; 
import SemesterAcademicYearPage from './components/semesteracademicyear/SemesterAcademicYearPage.js'; 
import ClassSchedulePage from './components/classschedule/ClassSchedulePage.js'; 
import MainDashboard from '../dashboard/components/MainDashboard.js';

const { TabPane } = Tabs;

const EnlistmentManagerPage = () => {
  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Enlistment Manager</h1>

        <div style={{
          borderBottom: '2px solid #1890ff',
          width: '10%',
          marginBottom: '20px'
        }} />

        <Tabs defaultActiveKey="1" type="card">
          <TabPane 
            tab={<><AppstoreAddOutlined style={{ marginRight: '8px' }} />Student Enlistment</>} 
            key="1"
          >
            <StudentEnlistmentPage />
          </TabPane>

          <TabPane 
            tab={<><CalendarOutlined style={{ marginRight: '8px' }} />Semester Academic Year</>} 
            key="2"
          >
            <SemesterAcademicYearPage />
          </TabPane>

          <TabPane 
            tab={<><SearchOutlined style={{ marginRight: '8px' }} />Class Schedule</>} 
            key="3"
          >
            <ClassSchedulePage />
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default EnlistmentManagerPage;
