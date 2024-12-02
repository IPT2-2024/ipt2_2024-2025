import React from 'react';
import GraphicSVG from './GraphicSVG';

function LoginBackground() {
    return (
        <div className="login-bg">
            <div className="z-2">
                <img src={GraphicSVG.Waves} alt="Waves" className="waves" />
                <img src={GraphicSVG.DotsHorizontal} alt="Dots Sign In Horizontal" className="dots-sign-in-horizontal" />
                <img src={GraphicSVG.DotsVertical} alt="Dots Sign In Left Vertical" className="dots-sign-in-left-vertical" />
            </div>

            <div className="liquid-container">
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
        </div>
    );
}

export default LoginBackground;
