import React, { useState, useEffect, Suspense } from "react";
import { Layout, theme, Spin } from "antd";

const Header = React.lazy(() => import("./Header")); 
const SideBar = React.lazy(() => import("./SideBar")); 
import MobileSidebarToggle from './MobileSidebarToggle'; 
import { useMediaQuery } from 'react-responsive';

const { Sider, Content } = Layout;

const MainDashboard = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); 

  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false); 
  const [userRole, setUserRole] = useState(null); 
  const [isLoaded, setIsLoaded] = useState(false); 
  const [isMobile, setIsMobile] = useState(false); 

  
  useEffect(() => {
    const savedRole = localStorage.getItem("user_role");
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      setUserRole("guest");
    }
    setIsLoaded(true);
  }, []);

 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsMobile(true); 
        setSidebarCollapsed(false); 
        setMobileSidebarVisible(false); 
      } else {
        setIsMobile(false); 
        setMobileSidebarVisible(false); 
      }
    };

    
    handleResize();

    
    window.addEventListener("resize", handleResize);

    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed); 
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarVisible(!mobileSidebarVisible); 
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {}
      {!isMobile && (
        <Sider
          width={250}
          breakpoint="lg"
          collapsedWidth="0"
          collapsed={sidebarCollapsed} 
          onCollapse={(collapsed) => setSidebarCollapsed(collapsed)} 
          style={{
            position: "fixed", 
            height: "100vh",
            zIndex: 1,
          }}
        >
          <Suspense fallback={<Spin size="large" />}>
            <SideBar userRole={userRole} /> {}
          </Suspense>
        </Sider>
      )}

      {}
      <Layout style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? 0 : 250, transition: 'margin-left 0.3s' }}>
        {}
        {isMobile && (
          <MobileSidebarToggle 
            userRole={userRole} 
            mobileSidebarVisible={mobileSidebarVisible} 
            toggleMobileSidebar={toggleMobileSidebar} 
          />
        )}

        {}
        <Suspense fallback={<Spin size="large" />}>
          <Header 
            style={{ padding: 0, background: colorBgContainer }} 
            toggleSidebar={toggleSidebar} 
            toggleMobileSidebar={toggleMobileSidebar}
          />
        </Suspense>

        {}
        <Content style={{ marginTop: '64px', margin: "24px 16px 0" }}> {}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {}
            {isLoaded ? children : <Spin size="large" />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainDashboard;
