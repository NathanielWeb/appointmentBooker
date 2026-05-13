export default interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    details?: string;
    status: string;

    physician: number;

    physician_detail: {
        id: number;
        first_name: string;
        last_name: string;
        specialty: string;
        bio: string;
    };
}