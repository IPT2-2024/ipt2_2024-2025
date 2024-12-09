import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideBarLogo = () => {
  const navigate = useNavigate();
  
  
  const userRole = localStorage.getItem('user_role');
  
  
  const logoStyle = {
    width: '180px',
    height: 'auto',
    marginTop: '16px',
    transition: 'transform 0.3s ease', 
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
    cursor: 'pointer', 
  };

  const logoHoverStyle = {
    transform: 'scale(1.1)',  
  };

  const handleLogoClick = () => {
    
    if (userRole) {
      navigate(`/${userRole}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="logo"
      style={containerStyle}
    >
      <img
        src={require('../../../../../../public/images/sidebarlogo.svg').default}
        alt="Sidebar Logo"
        style={logoStyle}
        onClick={handleLogoClick}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      />
    </div>
  );
};

export default SideBarLogo;
