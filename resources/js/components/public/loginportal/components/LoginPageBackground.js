import React from 'react';
import loginPageBackground from '../../../../../../public/images/loginpagebackground.svg';

const LoginPageBackground = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${loginPageBackground})`, 
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
};

export default LoginPageBackground;
