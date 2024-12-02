import React, { useState, useEffect } from "react";
import { Layout, theme, Spin } from "antd";
import SideBar from "./SideBar"; // Custom Sidebar
import Header from "./Header"; // Custom Header
import MobileSidebarToggle from './MobileSidebarToggle'; // Import mobile sidebar toggle component

const { Sider, Content } = Layout;

const MainDashboard = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); // Dynamic theme styling

  // State for Sidebar collapse (desktop view)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false); // State for mobile sidebar visibility
  const [userRole, setUserRole] = useState(null); // State for user role (null initially)
  const [isLoaded, setIsLoaded] = useState(false); // Loading state to ensure userRole is set before render

  useEffect(() => {
    // Fetch the user role from localStorage
    const savedRole = localStorage.getItem("user_role");

    if (savedRole) {
      setUserRole(savedRole); // Set user role if found
    } else {
      setUserRole("guest"); // Default to "guest" if not found
    }

    // Simulate loading state for better UX (you can remove this if unnecessary)
    setTimeout(() => {
      setIsLoaded(true); // Once the role is fetched, set loaded to true
    }, 500); // Simulate loading for 500ms
  }, []); // Empty dependency array ensures this runs once on component mount

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed); // Toggle sidebar visibility for desktop
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarVisible(!mobileSidebarVisible); // Toggle sidebar visibility for mobile
  };

  // Only render the layout once userRole is fetched and loaded
  if (!isLoaded) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" /> {/* Show loading spinner */}
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for larger screens */}
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={sidebarCollapsed} // Handle collapse state for desktop
        onCollapse={(collapsed) => setSidebarCollapsed(collapsed)} // Update collapse state
        style={{
          position: "fixed", // Keep the sidebar fixed on larger screens
          height: "100vh",
          zIndex: 1,
        }}
      >
        <SideBar userRole={userRole} /> {/* Pass userRole to the Sidebar */}
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: sidebarCollapsed ? 0 : 250, transition: 'margin-left 0.3s' }}>
        {/* Mobile Sidebar Toggle Button */}
        <MobileSidebarToggle 
          userRole={userRole} 
          mobileSidebarVisible={mobileSidebarVisible} 
          toggleMobileSidebar={toggleMobileSidebar} 
        />

        {/* Header */}
        <Header 
          style={{ padding: 0, background: colorBgContainer }} 
          toggleSidebar={toggleSidebar} 
          toggleMobileSidebar={toggleMobileSidebar}
        />

        {/* Content Area */}
        <Content style={{ marginTop: '64px', margin: "24px 16px 0" }}> {/* Offset content by header height */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children} {/* Render children here */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainDashboard;
