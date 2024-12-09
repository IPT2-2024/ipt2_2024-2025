import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Button, Descriptions, Row, Col, Divider, Upload, message, Avatar, Spin, Form } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import MainDashboard from '../dashboard/components/MainDashboard';
import ProfileForm from './components/ProfileForm';

const { Content } = Layout;

const ProfilePageDashboard = () => {
    const [isEditing, setIsEditing] = useState(false); 
    const [form] = Form.useForm(); 
    const [userData, setUserData] = useState(null); 
    const [profileData, setProfileData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 
    const [isUploading, setIsUploading] = useState(false); 
    const [uploadMessage, setUploadMessage] = useState(''); 
    const [selectedPhoto, setSelectedPhoto] = useState(null); 
    const [photoPreview, setPhotoPreview] = useState(null); 
    const SelectPhotoMessage = 'Photo Selected. Save to upload.';


    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
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

                const response = await axios.get(`/api/profiles/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfileData(response.data); 
                setUserData(response.data); 

                
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
                console.error(error);
                message.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [form]);

   
    const handleSave = async () => {
        try {
            const values = await form.validateFields(); 
            const token = localStorage.getItem('auth_token'); 
            const profileId = localStorage.getItem('profile_id'); 
            
            if (!profileId) {
                message.error('Profile ID not found in localStorage');
                return;
            }
    
            
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
    
            
            if (selectedPhoto) {
                const formData = new FormData();
                formData.append('photo', selectedPhoto);
                formData.append('profile_id', profileId);
    
                try {
                    await axios.post('/api/upload-photo', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                    });
                    setUploadMessage('Photo uploaded successfully.');
                } catch (error) {
                    setUploadMessage('Failed to upload photo.');
                }
            }
    
            
            const response = await axios.put(`/api/profiles/${profileId}`, mappedValues, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            message.success('Profile updated successfully');
            setIsEditing(false); 
        } catch (error) {
            console.error(error);
            message.error('Failed to update profile');
        }
    };
    

    
    const handleEdit = () => {
        setIsEditing(true); 
    };

    
    const handleUpload = (file) => {
        
        setSelectedPhoto(file);
    
        const imageUrl = URL.createObjectURL(file);
    
        setPhotoPreview(imageUrl);
    
        
        setUploadMessage('Photo selected. Save info to upload the photo.');
    };    
    
    
    const handleCancel = () => {
        
        form.setFieldsValue({
            firstname: profileData.first_name,
            middleinitial: profileData.middle_initial,
            lastname: profileData.last_name,
            sex: profileData.sex,
            maritalStatus: profileData.marital_status,
            religion: profileData.religion,
            age: profileData.age,
            phoneNumber: profileData.phone_number,
            address: profileData.address,
        });
    
        
        setPhotoPreview(profileData.photo_path ? `/storage/${profileData.photo_path}` : null);
        setSelectedPhoto(null); 
        setUploadMessage(''); 

        setIsEditing(false);
        
    };
    
    

    
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
                        {isEditing ? (
                            <>
                                {}
                                <Button onClick={handleSave} type="primary">
                                    Save Info
                                </Button>

                                {}
                                <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            
                            <Button onClick={handleEdit} type="primary">
                                Edit Info
                            </Button>
                        )}
                    </Col>
                </Row>


                    <Divider />

                    {}
                    <Row justify="center" gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24}>
                            <Divider orientation="left" style={{ marginBottom: '28px' }}>Personal Information</Divider>
                        </Col>
                    </Row>

                    <Row justify="start" gutter={[16, 16]} style={{ marginBottom: '40px' }}>
                        <Col xs={24} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
                            <Avatar
                                size={150}
                                src={photoPreview || (profileData?.photo_path ? `/storage/${profileData.photo_path}` : undefined)}
                                icon={<UserOutlined />}
                                style={{ marginBottom: '20px' }}
                            />

                            {isEditing && (
                                <Upload
                                    name="photo"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        handleUpload(file); 
                                        return false; 
                                    }}
                                >
                                    <Button
                                        icon={<PlusOutlined />}
                                        type="dashed"
                                        style={{ marginTop: '20px' }}
                                    >
                                        {selectedPhoto ? SelectPhotoMessage : 'Update Photo'}
                                    </Button>
                                </Upload>
                            )}

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
