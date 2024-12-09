import moment from 'moment';


export const isScheduleConflicting = (newSchedule, scheduleData) => {
    
    const newStart = moment(newSchedule.time_start, 'hh:mm A');
    const newEnd = moment(newSchedule.time_end, 'hh:mm A');

    return scheduleData.some((existingSchedule) => {
        
        const existingStart = moment(existingSchedule.time_start, 'hh:mm A');
        const existingEnd = moment(existingSchedule.time_end, 'hh:mm A');

        
        const isSameClassroom = existingSchedule.classroom_id === newSchedule.classroom_id;
        const isOverlapping =
            (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) ||
            (newStart.isSameOrAfter(existingStart) && newEnd.isSameOrBefore(existingEnd));

        return isSameClassroom && isOverlapping;
    });
};
