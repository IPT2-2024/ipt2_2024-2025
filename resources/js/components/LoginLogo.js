import React, { useState, useEffect } from "react";
import GraphicSVG from "./GraphicSVG";

export default function login() {
    return (
        <>
            <div className="container d-flex justify-content-center pb-3">
                <img
                    src={GraphicSVG.Fsuuw3DLogo}
                    alt="Fsuuw 3d Logo"
                    className="fsuuw-3d-logo"
                />
            </div>
        </>
    );
}
