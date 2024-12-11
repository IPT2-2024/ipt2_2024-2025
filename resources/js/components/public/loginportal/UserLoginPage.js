import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Form, Input, Button, Row, Col, message, Tooltip, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; 
import { handleLogin } from './../../private/loginportal/UserLoginService'; 

const { Content } = Layout;


const LoginPageBackground = lazy(() => import('./components/LoginPageBackground'));
const LoginLogo = lazy(() => import('./components/LoginLogo'));
const LoginLoader = lazy(() => import('./components/LoginLoader'));

const UserLogin = ({ setUserRole }) => {
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [pageLoading, setPageLoading] = useState(true); 
  const [showContent, setShowContent] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const loadPageContent = async () => {
      try {
        await fetchDataForPage();
        setShowContent(true); 
        setPageLoading(false); 
      } catch (error) {
        console.error('Error loading page content:', error);
        setPageLoading(false); 
      }
    };

    loadPageContent(); 
  }, []);

  
  const fetchDataForPage = async () => {
    return new Promise((resolve) => setTimeout(resolve, 2000)); 
  };

  const onFinish = async (values) => {
    setLoading(true); 
    setErrorMessage(''); 
  
    try {
      const response = await handleLogin(values); 
  
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
    } catch (error) {
      setErrorMessage(error.message); 
      message.error(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  const onFinishFailed = (errorInfo) => {
    if (!errorMessage) {
      message.error('Login failed. Please check your Username and Password credentials.');
    }
    console.log('Failed:', errorInfo); 
  };

  return (
    <>
      {pageLoading && (
        <Suspense fallback={<LoginLoader />}> {}
          <LoginPageBackground>
            <LoginLogo /> {}
            <LoginLoader /> {}
          </LoginPageBackground>
        </Suspense>
      )}

      {!pageLoading && (
        <Suspense fallback={<LoginLoader />}> {}
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
                  zIndex: 20,
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
                          rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                          <Input
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Username"
                            style={{ borderRadius: '8px' }}
                          />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
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
                            loading={loading} 
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
        </Suspense>
      )}
    </>
  );
};

export default UserLogin;