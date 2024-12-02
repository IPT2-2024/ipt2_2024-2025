import React from 'react';
import SideBarLogo from './SideBarLogo'; // Import the logo component
import SideBarTexture from './SideBarTexture'; // Import the texture component
import SideBarNavList from './SideBarNavList'; // Import the navigation list component

const SideBar = ({ userRole }) => {
  return (
    <SideBarTexture>
      {/* Sidebar Logo */}
      <div className="sidebar-logo">
        <SideBarLogo />
      </div>

      {/* Line Separator */}
      <div className="separator"></div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        <SideBarNavList userRole={userRole} /> {/* Pass the userRole to SideBarNavList */}
      </div>
    </SideBarTexture>
  );
};

export default SideBar;
