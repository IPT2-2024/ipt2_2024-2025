import React from 'react';
import moment from 'moment';
import { daysOfWeek } from './constants'; // Import daysOfWeek

const ClassroomScheduleTable = ({ scheduleData, onEditSchedule }) => {
    // Generate time slots for each hour (7:00 am, 7:30 am, 7:59 am, etc.)
    const generateTimeSlots = () => {
        const startHour = 7; // Starting hour (7:00 am)
        const endHour = 20; // Ending hour (8:00 pm, which is 20:00 in 24-hour format)
        let slots = [];

        for (let hour = startHour; hour <= endHour; hour++) {
            slots.push(moment({ hour, minute: 0 }));
            slots.push(moment({ hour, minute: 30 }));
            slots.push(moment({ hour, minute: 59 })); // Add 7:59 am, 8:59 am, etc.
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const renderScheduleCell = (day, time) => {
        const events = scheduleData.filter(
            (event) =>
                event.day === day &&
                time.isSameOrAfter(moment(event.time_start, 'hh:mm A')) &&
                time.isBefore(moment(event.time_end, 'hh:mm A'))
        );

        return events.map((event) => (
            <div
                key={event.id}
                style={{
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    padding: '4px',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                }}
                onClick={() => onEditSchedule(event)} // Trigger edit on click
            >
                <div>Room: {event.classroom_id}</div>
                <div style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    Created: {moment(event.created).format('MMM DD, YYYY h:mm A')}
                </div>
                <div style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    Updated: {moment(event.updated).format('MMM DD, YYYY h:mm A')}
                </div>
            </div>
        ));
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '150px repeat(7, 1fr)', // Column layout with fixed Time column
                border: '1px solid #ddd',
                overflowX: 'auto', // Enable horizontal scrolling for smaller screens
            }}
        >
            {/* Header Row for Time */}
            <div
                style={{
                    padding: '10px',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #ddd',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                }}
            >
                Time
            </div>
            {daysOfWeek.map((day) => (
                <div
                    key={day}
                    style={{
                        padding: '10px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'center',
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    {day}
                </div>
            ))}

            {timeSlots.map((time, index) => (
                <React.Fragment key={time.format('hh:mm A')}>
                    {/* Time Slot Row */}
                    <div
                        style={{
                            padding: '10px',
                            borderBottom: '1px solid #ddd',
                            textAlign: 'center',
                            backgroundColor: '#fafafa',
                            borderRight: '1px solid #ddd',
                        }}
                    >
                        {time.format('h:mm a')}
                    </div>

                    {/* Render schedule cells for each day */}
                    {daysOfWeek.map((day) => (
                        <div
                            key={`${day}-${time.format('hh:mm A')}`}
                            style={{
                                padding: '10px',
                                border: '1px solid #ddd',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                minHeight: '50px',
                            }}
                        >
                            {renderScheduleCell(day, time)}
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ClassroomScheduleTable;
