import React from 'react';
import GraphicSVG from './GraphicSVG'; // Adjust the path as needed

export default function Loader() {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="bg-loader">
        <div className="svg-background">
          <img src={GraphicSVG.LoaderGraphicsTop3} alt="SVG 1" className="svg1" />
          <img src={GraphicSVG.LoaderGraphicsTop2} alt="SVG 2" className="svg2" />
          <img src={GraphicSVG.LoaderGraphicsTop1} alt="SVG 3" className="svg3" />
        </div>
        <div className="svg-background2">
          <img src={GraphicSVG.LoaderGraphicsBottom3} alt="SVG 4" className="svg4" />
          <img src={GraphicSVG.LoaderGraphicsBottom2} alt="SVG 5" className="svg5" />
          <img src={GraphicSVG.LoaderGraphicsBottom1} alt="SVG 6" className="svg6" />
        </div>
      </div>
      
      <div className="overlay-container z-1">
        <div className="loader"></div>
        <img src={GraphicSVG.LoaderGraphicsCircleDot} alt="Dot Circle" className="dot-circle" />
        <div className="logo-container">
          <img src={GraphicSVG.LoaderFsuuLogo} alt="Threed Logo Fsuub" className="threed-logo-fsuub" />
        </div>
      </div>
    </div>
  );
}
