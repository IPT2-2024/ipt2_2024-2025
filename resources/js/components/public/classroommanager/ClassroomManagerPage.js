import React, { useState } from 'react';
import { Layout, Button, message, Form } from 'antd';
import moment from 'moment';
import MainDashboard from '../dashboard/components/MainDashboard';
import { isScheduleConflicting } from './components/scheduleUtils'; 
import { timeSlots, daysOfWeek, classroomOptions } from './components/constants'; 
import ClassroomScheduleTable from './components/ClassroomScheduleTable';
import AddScheduleModal from './components/AddScheduleModal';
import EditScheduleModal from './components/EditScheduleModal';

const { Content } = Layout;

const ClassroomManagerPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [scheduleData, setScheduleData] = useState([]);
    const [editingSchedule, setEditingSchedule] = useState(null);

    // Separate form instances
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Handle schedule creation
    const handleCreateSchedules = (values) => {
        const newSchedules = values.schedules.map((schedule) => {
            const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            return {
                id: scheduleData.length + 1,
                day: schedule.day,
                time_start: moment(schedule.time_start, 'HH:mm').format('hh:mm A'),
                time_end: moment(schedule.time_end, 'HH:mm').format('hh:mm A'),
                classroom_id: schedule.classroom_id,
                created: timestamp,
                updated: timestamp,
            };
        });

        for (const newSchedule of newSchedules) {
            if (isScheduleConflicting(newSchedule, scheduleData)) {
                message.error('One or more schedules conflict. Please resolve and try again.');
                return;
            }
        }

        setScheduleData([...scheduleData, ...newSchedules]);
        setIsModalOpen(false);
        addForm.resetFields();
    };

    // Handle edit schedule
    const handleEditSchedule = (values) => {
        const updatedSchedules = scheduleData.map((schedule) =>
            schedule.id === editingSchedule.id ? { ...schedule, ...values } : schedule
        );
        setScheduleData(updatedSchedules);
        setIsEditModalOpen(false);
        editForm.resetFields();
    };

    // Handle delete schedule
    const handleDeleteSchedule = () => {
        const updatedSchedules = scheduleData.filter((schedule) => schedule.id !== editingSchedule.id);
        setScheduleData(updatedSchedules);
        setIsEditModalOpen(false);
        editForm.resetFields();
    };

    // Handle save all schedules (UI for now)
    const handleSaveSchedules = () => {
        // For now, just log the schedules
        console.log('Saving schedules:', scheduleData);

        // You can add logic here to clear the table after "saving"
        setScheduleData([]);
        message.success('All schedules saved and cleared.');
    };

    return (
        <MainDashboard>
            <Content style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ marginBottom: '0' }}>Classroom Manager</h2>
                </div>

                {/* Blue Divider Below the Header */}
                <div style={{
                    borderBottom: '2px solid #1890ff',
                    width: '10%',
                    marginBottom: '20px', 
                    marginLeft: '0',  // Align to the left
                }} />

                {/* Buttons Container with Right Alignment */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginRight: '10px' }}>
                        Add Schedule
                    </Button>
                    <Button type="default" onClick={handleSaveSchedules}>
                        Save All Schedules
                    </Button>
                </div>

                <ClassroomScheduleTable
                    scheduleData={scheduleData}
                    onEditSchedule={(schedule) => {
                        setEditingSchedule(schedule);
                        setIsEditModalOpen(true);
                    }}
                />

                <AddScheduleModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    handleCreateSchedules={handleCreateSchedules}
                    form={addForm}
                    scheduleData={scheduleData} // Pass scheduleData as a prop here
                />

                <EditScheduleModal
                    isModalOpen={isEditModalOpen}
                    setIsModalOpen={setIsEditModalOpen}
                    handleEditSchedule={handleEditSchedule}
                    handleDeleteSchedule={handleDeleteSchedule}
                    form={editForm}
                    editingSchedule={editingSchedule}
                />
            </Content>
        </MainDashboard>
    );
};

export default ClassroomManagerPage;
