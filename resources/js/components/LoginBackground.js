import React from 'react';


function LoginBackground() {
    return (
        <div >
            <img src="assets/waves.svg" alt="Waves" className="waves" />
            <img src="assets/Dots sign in horizontal.svg" alt="Dots Sign In Horizontal" className="dots-sign-in-horizontal" />
            <img src="assets/Dots sign in left vertical.svg" alt="Dots Sign In Left Vertical" className="dots-sign-in-left-vertical" />

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