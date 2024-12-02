import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Button, Row, Col, Divider, Upload, message, Avatar, Spin, Form } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import MainDashboard from '../dashboard/components/MainDashboard';
import ProfileForm from './components/ProfileForm';

const { Content } = Layout;

const ProfilePageDashboard = () => {
    const [isEditing, setIsEditing] = useState(false); // Default to view mode
    const [form] = Form.useForm(); // Initialize form instance
    const [userData, setUserData] = useState(null); // State to hold user data
    const [profileData, setProfileData] = useState(null); // State to hold profile data
    const [isLoading, setIsLoading] = useState(true); // State to manage loading
    const [isUploading, setIsUploading] = useState(false); // State for photo upload progress
    const [uploadMessage, setUploadMessage] = useState(''); // Message state for upload success/error

    // Fetch user data and profile data when component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                // Get profile_id directly from localStorage
                const profileId = localStorage.getItem('profile_id');
                if (!profileId) {
                    message.error('Profile ID not found. Please log in again.');
                    return;
                }

                const token = localStorage.getItem('auth_token');
                if (!token) {
                    message.error('No token found. Please log in.');
                    return;
                }

                // Fetch profile data using the profile_id from localStorage
                const response = await axios.get(`/api/profiles/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfileData(response.data); // Set the profile data
                setUserData(response.data); // Assuming user data includes profile info as well

                // Map the profile data to form fields
                form.setFieldsValue({
                    firstname: response.data.first_name,
                    middleinitial: response.data.middle_initial,
                    lastname: response.data.last_name,
                    sex: response.data.sex,
                    maritalStatus: response.data.marital_status,
                    religion: response.data.religion,
                    age: response.data.age,
                    phoneNumber: response.data.phone_number,
                    address: response.data.address,
                });

            } catch (error) {
                console.error(error); // Log the error for debugging
                message.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [form]); // Trigger when the component is mounted

    // Handle profile save
    const handleSave = async () => {
        try {
            const values = await form.validateFields(); // Get form values
            const token = localStorage.getItem('auth_token'); // Get the token
            const profileId = localStorage.getItem('profile_id'); // Retrieve profile_id from localStorage
        
            if (!profileId) {
                message.error('Profile ID not found in localStorage');
                return;
            }
    
            // Map frontend fields to backend fields
            const mappedValues = {
                first_name: values.firstname,
                middle_initial: values.middleinitial,
                last_name: values.lastname,
                sex: values.sex,
                marital_status: values.maritalStatus,
                religion: values.religion,
                age: values.age,
                phone_number: values.phoneNumber,
                address: values.address,
            };
    
            // Send the PUT request to update the profile
            const response = await axios.put(`/api/profiles/${profileId}`, mappedValues, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // On success, show success message
            message.success('Profile updated successfully');
            setIsEditing(false); // Switch to view mode after saving
        } catch (error) {
            console.error(error);
            message.error('Failed to update profile');
        }
    };
    
    // Toggle edit mode
    const handleEdit = () => {
        setIsEditing(true); // Switch to edit mode
    };

    const handleUpload = async (file) => {
        try {
            const profileId = localStorage.getItem('profile_id');  // Get profile ID from localStorage
            if (!profileId) {
                message.error('Profile ID not found in localStorage');
                return;
            }
    
            const formData = new FormData();
            formData.append('photo', file);  // Ensure the file is under 'photo' field
            formData.append('profile_id', profileId);  // Add profile_id as well
    
            const response = await axios.put(`/api/profiles/${profileId}/upload-photo`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Handle the response (e.g., update UI with the new photo path)
            setProfileData((prevState) => ({
                ...prevState,
                photo_path: response.data.photo_path,
            }));
    
            setUploadMessage('Profile photo updated successfully');
        } catch (error) {
            console.error(error);
            setUploadMessage('Failed to upload photo');
        } finally {
            setIsUploading(false);
        }
    };
    
    
    const ProfilePage = ({ userData }) => {
        // If there's no photo_path, show a default image
        const photoUrl = userData?.photo_path ? `/${userData.photo_path}` : '/path/to/default/photo.jpg';
    
        return (
            <div>
                <h2>User Profile</h2>
                <img src={photoUrl} alt="Profile" />
                {/* Other profile info */}
            </div>
        );
    };
    
    // Show loading spinner while data is being fetched
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <MainDashboard>
            <Content style={{ padding: '20px' }}>
                <div style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                        <Col>
                            <h2>Account</h2>
                        </Col>
                        <Col style={{ marginRight: '20px' }}>
                            <Button onClick={isEditing ? handleSave : handleEdit} type="primary">
                                {isEditing ? 'Save Info' : 'Edit Info'}
                            </Button>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Personal Information Section */}
                    <Row justify="center" gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24}>
                            <Divider orientation="left" style={{ marginBottom: '28px' }}>Personal Information</Divider>
                        </Col>
                    </Row>

                    <Row justify="start" gutter={[16, 16]} style={{ marginBottom: '40px' }}>
                        <Col xs={24} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
                            <Avatar
                                size={150}
                                src={profileData?.photo_path ? `/storage/${profileData.photo_path}` : undefined}
                                icon={<UserOutlined />}
                                style={{ marginBottom: '20px' }}
                            />
                            <Upload
                                name="photo"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    handleUpload(file);
                                    return false; // Prevent auto upload
                                }}
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    type="dashed"
                                    style={{ marginTop: '20px' }}
                                    loading={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Add Photo'}
                                </Button>
                            </Upload>
                            {uploadMessage && (
                                <div style={{ marginTop: '10px', color: uploadMessage.includes('successfully') ? 'green' : 'red' }}>
                                    {uploadMessage}
                                </div>
                            )}
                        </Col>

                        <Col xs={24} sm={16} md={18} lg={16} xl={14}>
                            <ProfileForm form={form} isEditing={isEditing} />
                        </Col>
                    </Row>
                </div>
            </Content>
        </MainDashboard>
    );
};

export default ProfilePageDashboard;
