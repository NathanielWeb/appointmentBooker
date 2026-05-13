"use client";

import "react-day-picker/dist/style.css";

import { DayPicker } from "react-day-picker";

interface AvailabilityCalendarProps {
    selectedDate: Date | undefined;
    onSelectDate: (date: Date | undefined) => void;
    unavailableDates: string[];
}

export default function AvailabilityCalendar({
    selectedDate,
    onSelectDate,
    unavailableDates,
}: AvailabilityCalendarProps) {
    const disabledDates = unavailableDates.map(
        (date) => new Date(date)
    );

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Select a Date
            </h2>

            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onSelectDate}
                disabled={disabledDates}
            />
        </div>
    );
}
