import React from 'react';
import { Spin } from 'antd'; // Ant Design spinner
import loaderlogo from '../../../../../../public/images/loaderlogo.svg'; // Your logo
import { LoadingOutlined } from '@ant-design/icons'; // Alternative spinner from Ant Design

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
        flexDirection: 'column', // Stack the logo and spinner vertically
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight overlay for loader
        zIndex: 10, // Ensure it's on top of the background
      }}
    >
      <img 
        src={loaderlogo} 
        alt="Loading..." 
        style={{
          width: '100px', // You can adjust the size of the logo here
          height: '100px',
          animation: 'beat 1.5s ease-in-out infinite', // Apply the beating animation
        }} 
      />
      
      {/* Using Ant Design's default loading spinner with a custom indicator */}
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 40 }} />} // Custom spinner
        spinning={true}
        style={{
          marginTop: '20px', // Add space between the logo and the spinner
        }}
      />

      {/* CSS for the beating effect */}
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
