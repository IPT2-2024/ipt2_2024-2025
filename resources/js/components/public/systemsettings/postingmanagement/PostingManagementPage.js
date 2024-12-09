import React from 'react';
import { Tabs } from 'antd';
import { AppstoreAddOutlined, FileSearchOutlined } from '@ant-design/icons'; 
import PostEventPage from './components/event/PostEventPage'; 
import PostAnnouncementPage from './components/announcement/PostAnnouncementPage'; 
import MainDashboard from '../../dashboard/components/MainDashboard'; 

const { TabPane } = Tabs;

const PostingManagementPage = () => {
  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Posting Management</h1>

        {}
        <div style={{
          borderBottom: '2px solid #1890ff', 
          width: '10%', 
          marginBottom: '20px'
        }} />

        <Tabs defaultActiveKey="1" type="card">
          <TabPane 
            tab={<><AppstoreAddOutlined style={{ marginRight: '8px' }} />Post Event</>} 
            key="1"
          >
            <PostEventPage />
          </TabPane>

          <TabPane 
            tab={<><FileSearchOutlined style={{ marginRight: '8px' }} />Post Announcement</>} 
            key="2"
          >
            <PostAnnouncementPage />
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default PostingManagementPage;
