import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Dropdown, Avatar, Badge, Input, Row, Col } from "antd";
import { BellFilled, UserOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout } from '../../../private/dashboard/logoff'; // Import the logout function
import HeadNavList from './HeaderNavList'; // Import the new HeadNavList component

const { Header: AntHeader } = Layout;
const { Search } = Input; // Import Search component from Ant Design

const Header = ({ style, toggleSidebar, toggleMobileSidebar }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [scrolled, setScrolled] = useState(false); // State to track scroll position
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile
    axios.get('/api/user/profile')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the user profile!", error);
      });

    // Fetch notification count
    axios.get('/api/notifications/count')
      .then(response => {
        setNotifications(response.data.count);
      })
      .catch(error => {
        console.error("There was an error fetching the notifications count!", error);
      });

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup scroll event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onSearch = (value) => {
    // Handle search logic here (e.g., filter data, navigate, etc.)
    console.log(value); // For now, just log the search value
  };

  return (
    <AntHeader
      className={`header ${scrolled ? 'scrolled' : ''}`}
      style={style}
    >
      <div className="header-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        {/* Left side of the header */}
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Hamburger Button for Mobile */}
          <div className="menu-icon" onClick={toggleMobileSidebar} style={{ marginRight: '20px' }}>
            <MenuOutlined style={{ fontSize: '24px', color: '#3f7afc' }} />
          </div>

          {/* Search Bar */}
          <div className="search-bar" style={{ flexGrow: 1, marginLeft: '20px', marginTop: '30px' }}>
            <Row gutter={16}>
              <Col xs={20} sm={18} md={12} lg={14} xl={12}>
                <Search
                  placeholder="Search..."
                  onSearch={onSearch}
                  enterButton
                  allowClear
                  style={{ width: '100%' }} // Make the search bar take full width of its column
                />
              </Col>
            </Row>
          </div>
        </div>

        {/* Right side of the header */}
        <div className="header-right" style={{ display: "flex", alignItems: "center", paddingRight: '20px' }}>
          {/* Notification Icon with Badge */}
          <Badge count={notifications} offset={[10, 0]}>
            <BellFilled style={{ fontSize: '22px', marginRight: '20px', cursor: 'pointer', color: '#1890ff' }} />
          </Badge>

          {/* User Profile Avatar with Dropdown */}
          <Dropdown overlay={<HeadNavList userRole={user?.role} navigate={navigate} logout={logout} />} placement="bottomRight">
            <div style={{ display: "flex", alignItems: "center", cursor: 'pointer' }}>
              <Avatar
                size="large"
                icon={user?.avatar ? <img src={user.avatar} alt="Profile" /> : <UserOutlined />}
                style={{ marginRight: '8px' }}
              />
              <DownOutlined style={{ fontSize: '16px', color: '#3f7afc' }} />
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
