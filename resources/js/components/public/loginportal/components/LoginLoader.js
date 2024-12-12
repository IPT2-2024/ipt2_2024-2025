import React from 'react';
import GraphicSVG from './GraphicSVG';


const LoginLoader = () => {
  return (
    <div className="loader-screen">
      <img src={GraphicSVG.LoaderFsuuLogo} alt="loaderLogo" className="loaderlogo" />
      <div className="logcontainer">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
    </div>
  );
};

export default LoginLoader;
