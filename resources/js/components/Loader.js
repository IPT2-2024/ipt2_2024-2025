import React from 'react';
import GraphicSVG from './GraphicSVG'; // Adjust the path as needed

export default function Loader() {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="bg-loader">
        <div className="svg-background">
          <img src={GraphicSVG.Vector3Top} alt="SVG 1" className="svg1" />
          <img src={GraphicSVG.Vector2Top} alt="SVG 2" className="svg2" />
          <img src={GraphicSVG.Vector1Top} alt="SVG 3" className="svg3" />
        </div>
        <div className="svg-background2">
          <img src={GraphicSVG.Vector3Bottom} alt="SVG 4" className="svg4" />
          <img src={GraphicSVG.Vector2Bottom} alt="SVG 5" className="svg5" />
          <img src={GraphicSVG.Vector1Bottom} alt="SVG 6" className="svg6" />
        </div>
      </div>
      
      <div className="overlay-container z-1">
        <div className="loader"></div>
        <img src={GraphicSVG.DotCircle} alt="Dot Circle" className="dot-circle" />
        <div className="logo-container">
          <img src={GraphicSVG.ThreedLogo} alt="Threed Logo Fsuub" className="threed-logo-fsuub" />
        </div>
      </div>
    </div>
  );
}
