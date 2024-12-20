import React from 'react';
import { Tabs, Button, Dropdown, Menu, Row, Col, Form, Select, Space } from 'antd';
import { ApartmentOutlined, TeamOutlined, DownOutlined } from '@ant-design/icons';
import AcademicProgramsManagement from './components/academicprogramsmanagement/AcademicProgramsManagement';
import CollegeProgramsDepartment from './components/academicprogramsdepartment/CollegeProgramsDepartmentPage';
import MainDashboard from '../dashboard/components/MainDashboard';

const { TabPane } = Tabs;
const { Option } = Select;

const AcademicProgramsPage = () => {
  // Menu for Department Dropdown
  const departmentMenu = (
    <Menu>
      <Menu.Item key="1">Computer Studies Program</Menu.Item>
      <Menu.Item key="2">Accountancy Program</Menu.Item>
      <Menu.Item key="3">Criminal Justice Education Program</Menu.Item>
      <Menu.Item key="4">Nursing Program</Menu.Item>
      <Menu.Item key="5">Engineering Technology Program</Menu.Item>
      <Menu.Item key="6">Teacher Education Program</Menu.Item>
      <Menu.Item key="7">Arts and Sciences Program</Menu.Item>
      <Menu.Item key="8">Business Administration Program</Menu.Item>
    </Menu>
  );

  // Menu for Program Name Dropdown
  const programMenu = (
    <Menu>
      <Menu.Item key="1">Program 1</Menu.Item>
      <Menu.Item key="2">Program 2</Menu.Item>
      <Menu.Item key="3">Program 3</Menu.Item>
    </Menu>
  );

  return (
    <MainDashboard>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <h1>Academic Programs</h1>
        <div
          style={{
            borderBottom: '2px solid #1890ff',
            width: '10%',
            marginBottom: '20px',
          }}
        />
        <Tabs defaultActiveKey="1" type="card">
          <TabPane
            tab={
              <>
                <ApartmentOutlined style={{ marginRight: '8px' }} />
                Academic Programs Management
              </>
            }
            key="1"
          >
            <div style={{ padding: '20px', background: '#fff' }}>
              <Row gutter={16} align="middle" style={{ marginBottom: '20px' }}>
                {/* Department Dropdown */}
                <Col>
                  <Form.Item label="Department">
                    <Select
                      defaultValue="Select Department"
                      style={{ width: 200 }}
                      suffixIcon={<DownOutlined />}
                    >
                      <Option value="1">Computer Studies Program</Option>
                      <Option value="2">Accountancy Program</Option>
                      <Option value="3">Criminal Justice Education Program</Option>
                      <Option value="4">Nursing Program</Option>
                      <Option value="5">Engineering Technology Program</Option>
                      <Option value="6">Teacher Education Program</Option>
                      <Option value="7">Arts and Sciences Program</Option>
                      <Option value="8">Business Administration Program</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* Program Name Dropdown */}
                <Col>
                  <Form.Item label="Program(s)">
                    <Select
                      defaultValue="Select College Program"
                      style={{ width: 200 }}
                      suffixIcon={<DownOutlined />}
                    >
                      <Option value="1">Program 1</Option>
                      <Option value="2">Program 2</Option>
                      <Option value="3">Program 3</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ marginTop: '20px' }}>
                <AcademicProgramsManagement />
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <>
                <TeamOutlined style={{ marginRight: '8px' }} />
                College Programs Department
              </>
            }
            key="2"
          >
            <div style={{ padding: '20px', background: '#fff' }}>
              <CollegeProgramsDepartment />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </MainDashboard>
  );
};

export default AcademicProgramsPage;
