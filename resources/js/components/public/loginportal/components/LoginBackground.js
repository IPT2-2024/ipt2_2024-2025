// LoginBackground.js
import React from 'react';
import loginBackground from '../../../../../../public/images/loginbackground.svg';

const LoginBackground = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '18px' }}>
      <img src={loginBackground} alt="Login Background" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  );
};

export default LoginBackground;
