
import React from 'react';
import { Layout } from 'antd';
import MainDashboard from '../dashboard/components/MainDashboard';  
import StudentISPageDashboard from './components/StudentISPageDashboard';  

const { Content } = Layout;

const StudentISPage = () => {
  return (
    <MainDashboard>
      <StudentISPageDashboard />
    </MainDashboard>
  );
};

export default StudentISPage;
