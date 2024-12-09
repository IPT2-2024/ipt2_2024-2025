import React from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import SideBar from './SideBar'; 

const MobileSidebarToggle = ({ userRole, mobileSidebarVisible, toggleMobileSidebar }) => {
  return (
    <>
      {}
      <Button
        className="menu-icon"
        icon={<MenuOutlined />}
        onClick={toggleMobileSidebar}
        style={{
          display: 'none',  
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          zIndex: 1000, 
        }}
      />

      {}
      <Drawer
        placement="left"
        closable={false}
        onClose={toggleMobileSidebar}
        visible={mobileSidebarVisible}
        width={250}
        style={{
          zIndex: 1000, 
        }}
        bodyStyle={{
          padding: 0, 
          height: '100vh', 
        }}
        wrapperStyle={{
          height: '100vh', 
        }}
      >
        <SideBar userRole={userRole} />
      </Drawer>
    </>
  );
};

export default MobileSidebarToggle;