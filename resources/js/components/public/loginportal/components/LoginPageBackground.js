import React from 'react';
import GraphicSVG from './GraphicSVG'; 

const LoginPageBackground = ({ children }) => {
  return (
    
      <div className="login-bg z-1 ">
        <div className="">
          <img src={GraphicSVG.LoginGraphicsWaves} alt="Waves" className="waves" />
          <img src={GraphicSVG.LoginGraphicsDots2} alt="Dots Sign In Horizontal" className="dots-sign-in-horizontal" />
          <img src={GraphicSVG.LoginGraphicsDots2} alt="Dots Sign In Left Vertical" className="dots-sign-in-left-vertical" />
        </div>

        <div className="liquid-container z-0">
          <div className="blob blob1">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>

          <div className="blob blob2">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>

          <div className="blob blob3">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>
        </div>
     

      
      <div>{children}</div>
    </div>
  );
};

export default LoginPageBackground;
