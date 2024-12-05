import React, { useState } from 'react';
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

const SideBarNavList = ({ userRole }) => {
  // Use the location hook to get the current URL path
  const location = useLocation();

  // State to handle the open keys for the System Settings submenu
  const [openKeys, setOpenKeys] = useState([]);

  // Function to handle opening and closing the submenu
  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]} // Set the selected key to the current path
      openKeys={openKeys} // Keep track of which submenus are open
      onOpenChange={onOpenChange} // Handle open/close of submenus
      style={{ height: '100%', borderRight: 0, background: 'transparent' }}
    >
      {/* Dashboard Menu Item */}
      <Menu.Item key={`/${userRole}/dashboard`} icon={<DashboardOutlined />} className="nav-item">
        <NavLink to={`/${userRole}/dashboard`} className="nav-link">
          <span className="nav-link-text">Dashboard</span>
        </NavLink>
      </Menu.Item>

      

      {/* Admin can only access Dashboard and Enlistment Manager */}
      {userRole === 'admin' && (
        <Menu.Item key={`/${userRole}/enlistment-manager`} icon={<ProfileOutlined />} className="nav-item">
          <NavLink to={`/${userRole}/enlistment-manager`} className="nav-link">
          <span className="nav-link-text">Enlistment Manager</span>
          </NavLink>
        </Menu.Item>

        
      )}

      {/* Users and Faculty IS only accessible by Superadmin */}
      {userRole === 'superadmin' && (
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
      )}

      {/* Admin and Superadmin shared menu items */}
      {(userRole === 'superadmin') && (
        <>
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
        </>
      )}

      {/* Items available for all users, but hidden for admin */}
      {userRole !== 'admin' && (
        <>
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

          {/* Separator between main items and system settings */}
          <div className="separator" />
        </>
      )}

      {/* System Settings Menu Item (only visible for superadmin) */}
      {userRole === 'superadmin' && (
        <Menu.SubMenu
          key="system-settings"
          icon={<SettingOutlined />}
          title="System Settings"
          onTitleClick={() => setOpenKeys(openKeys.length ? [] : ['system-settings'])} // Toggle open
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
};

export default SideBarNavList;
