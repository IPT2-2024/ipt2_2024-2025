import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  ScheduleOutlined,
  ApartmentOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const SideBarNavList = React.memo(({ userRole }) => {
  const location = useLocation();

  const [openKeys, setOpenKeys] = useState([]);

  
  useEffect(() => {
    
    if (location.pathname.includes('/system-settings')) {
      setOpenKeys(['system-settings']);
    } else {
      setOpenKeys([]); 
    }
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      theme="blue"
      mode="inline"
      selectedKeys={[location.pathname]}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{ height: '100%', borderRight: 0, background: 'transparent' }}
    >
      {}
      <Menu.Item key={`/${userRole}/dashboard`} icon={<DashboardOutlined />} className="nav-item">
        <NavLink to={`/${userRole}/dashboard`} className="nav-link">
          <span className="nav-link-text">Dashboard</span>
        </NavLink>
      </Menu.Item>

      {userRole === 'admin' && (
        <Menu.Item key={`/${userRole}/enlistment-manager`} icon={<ProfileOutlined />} className="nav-item">
          <NavLink to={`/${userRole}/enlistment-manager`} className="nav-link">
            <span className="nav-link-text">Enlistment Manager</span>
          </NavLink>
        </Menu.Item>
      )}


      {userRole === 'superadmin' && (
        <>
<>
          <Menu.Item key={`/${userRole}/users`} icon={<UserOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/users`} className="nav-link">
              <span className="nav-link-text">Users</span>
            </NavLink>
          </Menu.Item>
          
          <Menu.Item key={`/${userRole}/faculty-is`} icon={<TeamOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/faculty-is`} className="nav-link">
              <span className="nav-link-text">Faculty IS</span>
            </NavLink>
          </Menu.Item>
        </>

          <Menu.Item key={`/${userRole}/student-is`} icon={<BookOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/student-is`} className="nav-link">
              <span className="nav-link-text">Student IS</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key={`/${userRole}/class-scheduling`} icon={<ScheduleOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/class-scheduling`} className="nav-link">
              <span className="nav-link-text">Class Scheduling</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key={`/${userRole}/academic-programs`} icon={<ApartmentOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/academic-programs`} className="nav-link">
              <span className="nav-link-text">Academic Programs</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key={`/${userRole}/subject-enlistment`} icon={<ProfileOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/subject-enlistment`} className="nav-link">
              <span className="nav-link-text">Subject Enlistment</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key={`/${userRole}/classroom-manager`} icon={<ProfileOutlined />} className="nav-item">
            <NavLink to={`/${userRole}/classroom-manager`} className="nav-link">
              <span className="nav-link-text">Classroom Manager</span>
            </NavLink>
          </Menu.Item>

            
          <Menu.Item key={`/${userRole}/enlistment-manager`} icon={<ProfileOutlined />} className="nav-item">
          <NavLink to={`/${userRole}/enlistment-manager`} className="nav-link">
            <span className="nav-link-text">Enlistment Manager</span>
          </NavLink>
        </Menu.Item>
          <div className="separator" />

        </>
      )}

      {userRole === 'superadmin' && (
        <Menu.SubMenu
          key="system-settings"
          icon={<SettingOutlined />}
          title="System Settings"
        >
          <Menu.Item key="/system-settings/facilities-manager">
            <NavLink to="/system-settings/facilities-manager" className="nav-link">
              <span className="nav-link-text">Facilities Manager</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/system-settings/programs-management">
            <NavLink to="/system-settings/programs-management" className="nav-link">
              <span className="nav-link-text">Programs Manager</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/system-settings/terms-management">
            <NavLink to="/system-settings/terms-management" className="nav-link">
              <span className="nav-link-text">Terms Manager</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/system-settings/posting-management">
            <NavLink to="/system-settings/posting-management" className="nav-link">
              <span className="nav-link-text">Posting Manager</span>
            </NavLink>
          </Menu.Item>
        </Menu.SubMenu>
      )}
    </Menu>
  );
});

export default SideBarNavList;
