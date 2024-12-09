import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, message, Table, Spin } from 'antd';
import axios from 'axios'; 

const YearLevelModal = ({
    isCreateModalVisible,
    setIsCreateModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    data,
    setData,
    modalData,
    setModalData,
    isPrintPreviewVisible,
    setIsPrintPreviewVisible, 
    closePrintPreview,
}) => {
    const [form] = Form.useForm();
    const [isPrinted, setIsPrinted] = useState(false);  

    useEffect(() => {
        if (isEditModalVisible && modalData) {
            
            form.setFieldsValue({
                year_level: modalData.year_level, 
            });
        }
    }, [isEditModalVisible, modalData, form]);

    const yearLevelMap = {
        1: 'First Year',
        2: 'Second Year',
        3: 'Third Year',
        4: 'Fourth Year',
        5: 'Fifth Year',
        6: 'Sixth Year',
        7: 'Seventh Year',
        8: 'Eighth Year',
        9: 'Ninth Year',
        10: 'Tenth Year',
    };
    
    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const yearLevelName = values.year_level.trim();
    
            
            const yearLevelInt = parseInt(yearLevelName);
            if (isNaN(yearLevelInt) || yearLevelInt < 1 || yearLevelInt > 10) {
                message.error('Year level must be an integer between 1 and 10.');
                return;
            }
    
            
            if (isEditModalVisible) {
                try {
                    const token = localStorage.getItem('auth_token');
    
                    
                    const response = await axios.put(
                        `/api/yearlevel/${modalData.id}`,  
                        { year_level: yearLevelName }, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, 
                            },
                        }
                    );
    
                    
                    const updatedData = data.map((yearLevel) =>
                        yearLevel.id === modalData.id
                            ? { ...yearLevel, year_level: yearLevelName } 
                            : yearLevel
                    );
                    setData(updatedData); 
    
                    message.success('Year level updated successfully!');
                    setIsEditModalVisible(false); 
                } catch (error) {
                    message.error('Failed to update year level: ' + (error.response?.data?.message || error.message));
                }
            } else {
                
                try {
                    const token = localStorage.getItem('auth_token');
    
                    
                    const response = await axios.post(
                        '/api/yearlevel', 
                        { year_level: yearLevelName }, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, 
                            },
                        }
                    );
    
                    
                    setData((prevData) => [...prevData, response.data.yearLevel]);
    
                    message.success('Year level created successfully!');
                    setIsCreateModalVisible(false); 
                } catch (error) {
                    message.error('Failed to create year level: ' + (error.response?.data?.message || error.message));
                }
            }
        });
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        form.resetFields(); 
    };

    
    const handlePrint = () => {
        
        const content = document.getElementById('printable-table').outerHTML;
        
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        
        const headers = tempDiv.querySelectorAll('th');
        const idColumnIndex = Array.from(headers).findIndex(header => header.innerText === 'ID');
        
        
        if (idColumnIndex !== -1) {
            
            headers[idColumnIndex].remove();
            
            
            const rows = tempDiv.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > idColumnIndex) {
                    cells[idColumnIndex].remove();
                }
            });
        }
        
        
        const modifiedContent = tempDiv.innerHTML;
        
        
        const printWindow = window.open('', '', 'height=600,width=800');
        
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Year Levels</title>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        table, th, td {
                            border: 1px solid black;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                        }
                    </style>
                </head>
                <body>
                    <h1>Year Levels</h1>
                    ${modifiedContent}
                </body>
            </html>
        `);
        
        printWindow.document.close(); 
        printWindow.print(); 
        setIsPrinted(true);  
    };
    
    

    const modifiedData = data.map(item => ({
        ...item,
        year_level: yearLevelMap[item.year_level] || item.year_level,  
    }));

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Year Level', dataIndex: 'year_level', key: 'year_level' },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => new Date(text).toLocaleString(),
        }
    ];
    

    return (
        <div>
            {}
            <Modal
                title={isEditModalVisible ? 'Edit Year Level' : 'Create New Year Level'}
                visible={isEditModalVisible || isCreateModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditModalVisible ? 'Save Changes' : 'Create Year Level'}
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical" onFinish={handleOk}>
                    <Form.Item
                        label="Year Level"
                        name="year_level"
                        rules={[
                            { required: true, message: 'Please input the Year Level!' },
                            {
                                pattern: /^(10|[1-9])$/, 
                                message: 'Year Level must be an integer between 1 and 10',
                            },
                        ]}
                    >
                        <Input
                            type="number" 
                            min={1} 
                            max={10} 
                            onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} 
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {}
            <Modal
                title="Print Year Levels"
                visible={isPrintPreviewVisible}
                onCancel={closePrintPreview}
                footer={null}
                style={{ maxWidth: '80%', margin: 'auto' }}
                bodyStyle={{ paddingBottom: '80px' }} 
            >
                <div style={{ position: 'relative', minHeight: '400px' }}>  {}
                    {}
                    {modifiedData.length === 0 ? (
                        <Spin tip="Loading..." />
                    ) : (
                        <Table
                            id="printable-table"
                            rowKey="id"
                            columns={columns}
                            dataSource={modifiedData}  
                            pagination={false}
                            bordered
                            size="small"
                        />
                    )}

                    {}
                    <div style={{
                        position: 'absolute',
                        right: '20px',
                        bottom: '20px',
                        display: isPrinted ? 'none' : 'block',  
                    }}>
                        <Button
                            type="primary"
                            onClick={handlePrint}
                        >
                            Print
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default YearLevelModal;
