

import React from 'react';

const SideBarTexture = ({ children }) => {
  const sidebarStyle = {
    width: '250px',
    height: '100vh',
    backgroundColor: '#131f73',
    //backgroundImage: `url(${require('../../../../../../public/images/sidebartexture.svg').default})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
  };

  return (
    <div className="sidebar" style={sidebarStyle}>
      {children}
    </div>
  );
};

export default SideBarTexture;