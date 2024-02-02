export const splitTime = (startDate: number, endDate: number, timeSlot: number) => {
    const times: number[] = [];

    const timeDiff = endDate - startDate;

    if (timeDiff < timeSlot)
        return times;

    for (let i = startDate; i <= (endDate - timeSlot); i += timeSlot) {
        times.push(i);
    }
    
    return times;
};
