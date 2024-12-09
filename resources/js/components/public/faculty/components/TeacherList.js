import React, { useState } from 'react';
import { Button, List, Card, Input, Modal, Form } from 'antd';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");

  const handleAddTeacher = () => {
    if (newTeacherName.trim() === "") return;
    const newTeacher = { id: teachers.length + 1, name: newTeacherName };
    setTeachers([...teachers, newTeacher]);
    setNewTeacherName("");
    setIsModalVisible(false);
  };

  return (
    <div>
      <h3>Teacher List</h3>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Teacher
      </Button>

      <List
        style={{ marginTop: 20 }}
        bordered
        dataSource={teachers}
        renderItem={teacher => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <h4>{teacher.name}</h4>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Add New Teacher"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddTeacher}
      >
        <Form>
          <Form.Item label="Teacher Name">
            <Input
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
              placeholder="Enter Teacher's Name"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherList;
