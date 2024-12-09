import React from 'react';
import loginLogo from '../../../../../../public/images/loginlogo.svg';

const LoginLogo = () => {
  return (
    <div className="logo-container">
      <img src={loginLogo} alt="Login Logo" style={{ maxWidth: '200px', width: '100%', height: 'auto' }} />
    </div>
  );
};

export default LoginLogo;