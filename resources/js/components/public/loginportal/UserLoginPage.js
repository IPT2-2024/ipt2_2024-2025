import React, { useState, useEffect, Suspense, lazy } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from './../../private/loginportal/UserLoginService';


const LoginLogo = lazy(() => import('./components/LoginLogo'));
const LoginBackground = lazy(() => import('./components/LoginPageBackground'));
const LoginLoader = lazy(() => import('./components/LoginLoader'));

const UserLogin = ({ setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setPageLoading(false);
      } catch (error) {
        console.error('Error loading page content:', error);
        setPageLoading(false);
      }
    };

    loadPageContent();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await handleLogin({ username, password });

      if (response.status === 200) {
        message.success('Login successful!');
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_role', response.data.role);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('profile_id', response.data.profile_id);

        setUserRole(response.data.role);
        navigate(`/${response.data.role}/dashboard`);
        window.location.reload();
      }
    } catch (err) {
      message.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100">
      {pageLoading ? (
        <Suspense fallback={<LoginLoader />}>
          <LoginLoader />
        </Suspense>
      ) : (
        <Suspense fallback={<LoginLoader />}>
          <div className="container z-2">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                <div className="login-form">
                  <div className="d-flex flex-column align-items-center">
                    <LoginLogo />
                    <div className="wrapper w-100 p-3 p-md-4 card border rounded-4 shadow">
                      <form onSubmit={onSubmit}>
                        <h2 className="text-center fw-bold mb-4">Account Portal</h2>
                        <div className="input-box form-group position-relative mb-3">
                          <i
                            className="bx bxs-user position-absolute top-50 translate-middle-y text-muted bx-sm"
                            style={{ left: '15px' }}
                          ></i>
                          <input
                            type="text"
                            className="form-control ps-5 rounded-pill"
                            style={{ height: '55px', fontSize: '1.1rem' }}
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="input-box form-group position-relative mb-3">
                          <i
                            className="bx bxs-lock-alt position-absolute top-50 translate-middle-y text-muted bx-sm"
                            style={{ left: '15px' }}
                          ></i>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control ps-5 pe-5 rounded-pill"
                            style={{ height: '55px', fontSize: '1.1rem' }}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <i
                            className={`bx ${showPassword ? 'bxs-show' : 'bxs-hide'} position-absolute top-50 translate-middle-y text-muted bx-sm`}
                            style={{ right: '15px', cursor: 'pointer' }}
                            onClick={() => setShowPassword(!showPassword)}
                          ></i>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-100 rounded-pill"
                          style={{ height: '55px', fontSize: '1.1rem' }}
                          disabled={loading}
                        >
                          {loading ? 'Logging in...' : 'Sign in'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <LoginBackground />
        </Suspense>
      )}
    </div>
  );
};

export default UserLogin;
