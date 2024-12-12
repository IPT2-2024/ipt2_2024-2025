import React from "react";
import GraphicSVG from "./GraphicSVG";

const LoginLogo = () => {
    return (
        <div className="container d-flex justify-content-center pb-3">
            <img
                src={GraphicSVG.LoginFsuuLogo}
                alt="Fsuuw 3d Logo"
                className="fsuuw-3d-logo"
            />
        </div>
    );
};

export default LoginLogo;
