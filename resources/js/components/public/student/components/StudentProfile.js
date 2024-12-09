
import React from 'react';
import { Card, Col, Row } from 'antd';

const StudentProfile = ({ studentData }) => {
  return (
    <Card title="Student Profile" bordered={false} style={{ width: '100%' }}>
      <Row gutter={16}>
        <Col span={12}>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Student ID:</strong> {studentData.studentID}</p>
          <p><strong>Date of Birth:</strong> {studentData.dob}</p>
        </Col>
        <Col span={12}>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Phone:</strong> {studentData.phone}</p>
          <p><strong>Address:</strong> {studentData.address}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default StudentProfile;
