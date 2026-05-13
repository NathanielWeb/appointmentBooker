export function isPastAppointment(date: string, time: string) {
    const appointment = new Date(`${date}T${time}:00Z`);
    return appointment.getTime() < Date.now();
}