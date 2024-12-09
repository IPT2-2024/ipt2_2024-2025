import React from 'react';
import SideBarLogo from './SideBarLogo'; 
import SideBarTexture from './SideBarTexture'; 
import SideBarNavList from './SideBarNavList'; 

const SideBar = ({ userRole }) => {
  return (
    <SideBarTexture>
      {}
      <div className="sidebar-logo">
        <SideBarLogo />
      </div>

      {}
      <div className="separator"></div>

     
      <div className="sidebar-nav">
        <SideBarNavList userRole={userRole} /> {}
      </div>
    </SideBarTexture>
  );
};

export default SideBar;
