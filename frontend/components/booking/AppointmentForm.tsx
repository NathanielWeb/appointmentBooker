"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import Physician from "@/types/physician";
import { authenticatedFetch } from "@/lib/auth";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AppointmentFormProps {
    physician: Physician;
    selectedDate: Date;
    selectedSlot: string;
}

export default function AppointmentForm({
    physician,
    selectedDate,
    selectedSlot,
}: AppointmentFormProps) {
    const router = useRouter();

    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");
    

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const formattedDate =
                selectedDate.toISOString().split("T")[0];

            const response = await authenticatedFetch(
                `${BASE_URL}/api/appointments/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        physician: physician.id,
                        appointment_date: formattedDate,
                        appointment_time: selectedSlot,
                        reason,
                        details: notes,
                    }),
                },
                router
            );

            if (!response.ok) {
                throw new Error(
                    "This appointment slot is no longer available."
                );
            }

            setSuccess(true);
            setReason("");
            setNotes("");

            router.push("/patient-dashboard");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">
                Appointment Details
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Reason for Visit
                    </label>

                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Additional Notes
                    </label>

                    <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
                    />
                </div>

                {success && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        Appointment booked successfully.
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-2xl"
                >
                    {loading ? "Booking Appointment..." : "Book Appointment"}
                </Button>
            </form>
        </div>
    );
}
