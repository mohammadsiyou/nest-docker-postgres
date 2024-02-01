export const splitTime = (startDate: number, endDate: number, timeSlot: number) => {
    const appointments: number[] = [];

    const timeDiff = endDate - startDate;

    if (timeDiff < timeSlot)
        return appointments;

    for (let i = startDate; i < endDate; i += timeSlot) {
        appointments.push(i);
    }

    return appointments;
};
