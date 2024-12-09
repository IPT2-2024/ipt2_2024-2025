import React from 'react';
import { Spin } from 'antd'; 
import loaderlogo from '../../../../../../public/images/loaderlogo.svg'; 
import { LoadingOutlined } from '@ant-design/icons'; 

const LoginLoader = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        zIndex: 10, 
      }}
    >
      <img 
        src={loaderlogo} 
        alt="Loading..." 
        style={{
          width: '100px', 
          height: '100px',
          animation: 'beat 1.5s ease-in-out infinite', 
        }} 
      />
      
      {}
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 40 }} />} 
        spinning={true}
        style={{
          marginTop: '20px', 
        }}
      />

      {}
      <style>
        {`
          @keyframes beat {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1); /* The size of the logo increases */
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginLoader;
