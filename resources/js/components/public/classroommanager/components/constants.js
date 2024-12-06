import moment from 'moment';

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const timeSlots = Array.from(
    { length: 26 }, // 7:00 AM to 9:00 PM (13 hours * 2 = 26 slots)
    (_, index) => moment({ hour: 7 }).add(index * 30, 'minutes')
);

export const classroomOptions = [
    'CBE-401', 'CBE-402', 'CBE-403', 'CBS-305', 'CBS-306', 'CBS-307',
    'CB-201', 'CB-202', 'CB-203'
];
