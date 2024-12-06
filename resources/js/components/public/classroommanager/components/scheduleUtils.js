import moment from 'moment';

// Check if new schedule conflicts with existing schedules
export const isScheduleConflicting = (newSchedule, scheduleData) => {
    // Convert the new schedule start and end times to moment objects
    const newStart = moment(newSchedule.time_start, 'hh:mm A');
    const newEnd = moment(newSchedule.time_end, 'hh:mm A');

    return scheduleData.some((existingSchedule) => {
        // Convert existing schedule start and end times to moment objects
        const existingStart = moment(existingSchedule.time_start, 'hh:mm A');
        const existingEnd = moment(existingSchedule.time_end, 'hh:mm A');

        // Check if the classrooms are the same and if the times overlap
        const isSameClassroom = existingSchedule.classroom_id === newSchedule.classroom_id;
        const isOverlapping =
            (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) ||
            (newStart.isSameOrAfter(existingStart) && newEnd.isSameOrBefore(existingEnd));

        return isSameClassroom && isOverlapping;
    });
};
