import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Row, Col, message, Tooltip, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import navigate hook
import LoginPageBackground from './components/LoginPageBackground';
import LoginLogo from './components/LoginLogo';
import LoginLoader from './components/LoginLoader'; // Import the loader component
import { handleLogin } from '../../private/loginportal/UserLoginService'; // Import the backend logic

const { Content } = Layout;

const UserLogin = ({ setUserRole }) => {
  const [showPassword, setShowPassword] = useState(false); // Show password toggle
  const [loading, setLoading] = useState(false); // Login loading spinner
  const [pageLoading, setPageLoading] = useState(true); // Page load state
  const [showContent, setShowContent] = useState(false); // State to control when to show login content
  const [errorMessage, setErrorMessage] = useState(''); // Track error message state
  const navigate = useNavigate(); // Initialize navigate function

  // Simulate page load (replace with real data fetching or async tasks as needed)
  useEffect(() => {
    const loadPageContent = async () => {
      try {
        await fetchDataForPage();
        setPageLoading(false); // Hide page loader
        setShowContent(true); // Show login content
      } catch (error) {
        console.error('Error loading page content:', error);
        setPageLoading(false); // Ensure page loads even in case of error
      }
    };

    loadPageContent(); // Call the async function on component mount
  }, []);

  const fetchDataForPage = async () => {
    return new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2 seconds delay
  };

  const onFinish = async (values) => {
    setLoading(true); // Show spinner when login is in progress
    setErrorMessage(''); // Reset error message before each submission
  
    try {
      const response = await handleLogin(values); // Call the backend logic
  
      if (response.status === 200) {
        message.success('Login successful!');
        
        // Store the response data in localStorage
        localStorage.setItem('auth_token', response.data.token); // Store the authentication token
        localStorage.setItem('user_role', response.data.role); // Store the role
        localStorage.setItem('user_id', response.data.user_id); // Store user_id from profile
        localStorage.setItem('profile_id', response.data.profile_id); // Store profile_id from profile
  
        // Set user role state in the parent component
        setUserRole(response.data.role);
  
        // Use the navigate hook to redirect based on user role
        navigate(`/${response.data.role}/dashboard`);
      }
    } catch (error) {
      setErrorMessage(error.message); // Set error message
      message.error(error.message); // Show error message
    } finally {
      setLoading(false); // Hide spinner after login attempt
    }
  };

  const onFinishFailed = (errorInfo) => {
    if (!errorMessage) {
      message.error('Login failed. Please check your Username and Password credentials.');
    }
    console.log('Failed:', errorInfo); // Optional: Log validation error information
  };

  return (
    <>
      {pageLoading && (
        <LoginPageBackground>
          <LoginLoader /> {/* Display loader on top of the background */}
        </LoginPageBackground>
      )}

      {!pageLoading && (
        <LoginPageBackground>
          {showContent && (
            <Content
              className="content-container"
              style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 20, // Higher z-index to appear above the loader and background
              }}
            >
              <Row justify="center" align="middle" style={{ width: '100%' }}>
                <Col xs={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <LoginLogo />
                </Col>
                <Col xs={24} sm={20} md={12} lg={10} style={{ marginTop: '-30px' }}>
                  <Card
                    bordered={false}
                    className="card-container"
                    style={{
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Form
                      name="loginForm"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                    >
                      <div
                        style={{
                          marginBottom: '16px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          textAlign: 'center',
                        }}
                      >
                        Account Portal
                      </div>
                      <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}>

                        <Input
                          prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                          placeholder="Username"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}>

                        <Input.Password
                          prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          iconRender={(visible) => (
                            <Tooltip title={visible ? 'Hide Password' : 'Show Password'}>
                              {visible ? (
                                <EyeTwoTone onClick={() => setShowPassword(!showPassword)} />
                              ) : (
                                <EyeInvisibleOutlined onClick={() => setShowPassword(!showPassword)} />
                              )}
                            </Tooltip>
                          )}
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>

                      <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            backgroundColor: '#131f73',
                            borderColor: '#131f73',
                            height: '40px',
                          }}
                          loading={loading} // Show spinner on button during login
                        >
                          {loading ? 'Logging in...' : 'Login'}
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </Content>
          )}
        </LoginPageBackground>
      )}
    </>
  );
};

export default UserLogin;