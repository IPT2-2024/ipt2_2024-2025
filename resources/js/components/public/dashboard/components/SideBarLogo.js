const SideBarLogo = () => {
  const logoStyle = {
    width: '180px',
    height: 'auto',
    transition: 'width 0.3s ease',
    marginTop: '16px',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
  };

  return (
    <div className="logo" style={containerStyle}>
      <img
        src={require('../../../../../../public/images/sidebarlogo.svg').default} // This should work with file-loader
        alt="Sidebar Logo"
        style={logoStyle}
      />
    </div>
  );
};

export default SideBarLogo;
