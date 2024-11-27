import React from "react";

export default function Login() {
  return (
    <div className="login-page">
      <div className=" vw-100 d-flex align-items-center justify-content-center  m-sm-3 z-2 ">
        <div className="d-flex flex-column align-items-center justify-content-center align-self-center  ">
          
          <div className="container d-flex justify-content-center pb-3">
            <img src="/assets/fsuuw 3d logo.svg" alt="Fsuuw 3d Logo" className="fsuuw-3d-logo" />
          </div>
          <div className="wrapper ">
              
            <form action="">
                <h1>Sign in</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required />
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required />
                    <i className='bx bxs-lock-alt'></i>
                </div>

                <div className="remember-forgot">
                    <label> <input type="checkbox" /> Remember me</label>
                    <a href="#"> Forgot password?</a>
                </div>

                <button type="submit" className="btn">Sign in</button>

                <div className="register-link">
                    <p> Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
          </div>
        </div>
      </div>  
      

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