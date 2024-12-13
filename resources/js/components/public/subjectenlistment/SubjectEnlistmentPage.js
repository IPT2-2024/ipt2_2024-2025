import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Input, Button, Modal, Form, Select, Switch, notification } from 'antd';
import { SearchOutlined, PlusOutlined, BookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import axios from 'axios';
import MainDashboard from '../dashboard/components/MainDashboard';
import SubjectPage from './components/SubjectPage'; // Import SubjectPage.js
import SubjectCurriculumPage from './components/SubjectCurriculumPage';
import SubjectModal from './components/SubjectModal';

const { Content } = Layout;
const { TabPane } = Tabs;

const SubjectEnlistmentPage = () => {
    const pageSize = 5;
  return (
    <MainDashboard>
      <Content style={{ padding: '20px' }}>
        <h3>Subject Enlistment Management</h3>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Subject" key="1">
            <SubjectPage /> 
          </TabPane>
          <TabPane tab="Curriculum" key="2">
            <SubjectCurriculumPage />
          </TabPane>
        </Tabs>
      </Content>
    </MainDashboard>
  );
};

export default SubjectEnlistmentPage;