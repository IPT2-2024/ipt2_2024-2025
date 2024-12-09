import React from 'react';
import { Card, List } from 'antd';


const TeacherAssignment = ({ assignments, searchQuery }) => {
    
    const filteredAssignments = assignments.filter(
        assignment =>
            assignment.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card title="Teacher Assignments" bordered={false}>
            <List
                dataSource={filteredAssignments}
                renderItem={assignment => (
                    <List.Item>
                        {assignment.teacherName} - {assignment.subject} - {assignment.dueDate}
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default TeacherAssignment;
