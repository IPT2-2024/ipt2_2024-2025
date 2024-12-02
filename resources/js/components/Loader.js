import React from "react";




export default function Loader() {
  return (
    <div className=" d-flex  align-items-center justify-content-center ">
      
      <div className=" bg-loader ">
        <div className="svg-background">
          <img src="assets/Vector 3 top.svg" alt="SVG 1" className="svg1" />
          <img src="assets/Vector 2 top.svg" alt="SVG 2" className="svg2" />
          <img src="assets/Vector 1 top.svg" alt="SVG 3" className="svg3" />

        </div>
        <div className="svg-background2">
          <img src="assets/Vector 3 bottom.svg" alt="SVG 4" className="svg4" />
          <img src="assets/Vector 2 bottom.svg" alt="SVG 5" className="svg5" />
          <img src="assets/Vector 1 bottom.svg" alt="SVG 6" className="svg6" />
        </div>
      </div>
      
      <div className="overlay-container z-1">
          <div className="loader"></div>
          <img src="assets/dot circle.svg" alt="Dot Circle" className="dot-circle" />
          <div className="logo-container">
            <img src="assets/threed logo fsuub.svg" alt="Threed Logo Fsuub" className="threed-logo-fsuub" />
          </div>
      </div>
    </div>
    
  );
}