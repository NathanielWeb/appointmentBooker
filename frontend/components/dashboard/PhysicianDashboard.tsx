"use client";

import { authenticatedFetch } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isPastAppointment } from "@/lib/datetime";
import Appointment from "@/types/appointment";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Appointment[];
}

export default function PhysicianDashboard() {
    const router = useRouter();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [next, setNext] = useState<string | null>(null);
    const [previous, setPrevious] = useState<string | null>(null);
    const [count, setCount] = useState(0);

    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        async function fetchAppointments() {
            setLoading(true);

            try {
                const url = new URL(`${BASE_URL}/api/appointments/`);

                url.searchParams.append("page", String(page));

                if (selectedDate) {
                    url.searchParams.append("date", selectedDate);
                }

                const response = await authenticatedFetch(
                    url.toString(),
                    { credentials: "include" },
                    router
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                const data: PaginatedResponse = await response.json();

                setAppointments(data.results);
                setNext(data.next);
                setPrevious(data.previous);
                setCount(data.count);
            } catch (err) {
                console.error(err);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        }

        fetchAppointments();
    }, [page, selectedDate, router]);

    async function updateStatus(id: number, status: string) {
        const res = await authenticatedFetch(
            `${BASE_URL}/api/appointments/${id}/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ status }),
            },
            router
        );

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));

            alert(
                data?.status ||
                    "This appointment can no longer be modified."
            );
            return;
        }

        setAppointments((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: status as any } : a
            )
        );
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold text-slate-900">
                Physician Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
                Total appointments: {count}
            </p>

            {/* DATE FILTER */}
            <div className="mt-6 flex items-center gap-3">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setPage(1);
                    }}
                    className="rounded-lg border px-3 py-2 text-sm"
                />

                <button
                    onClick={() => {
                        setSelectedDate("");
                        setPage(1);
                    }}
                    className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                >
                    Clear
                </button>
            </div>

            {loading && (
                <p className="mt-4 text-slate-500">
                    Loading appointments...
                </p>
            )}

            <div className="mt-8 space-y-4">
                {appointments.map((a) => {
                    const isPast = isPastAppointment(
                        a.appointment_date,
                        a.appointment_time
                    );

                    const isLocked = isPast;

                    return (
                        <div
                            key={a.id}
                            className="rounded-2xl bg-white p-5 shadow-sm"
                        >
                            <div className="flex justify-between">
                                <div>
                                    {/* PATIENT INFO */}
                                    <p className="text-sm font-semibold text-slate-700">
                                        Patient: {a.patient.first_name}{" "}
                                        {a.patient.last_name}
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {a.appointment_date} at{" "}
                                        {a.appointment_time}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {a.reason}
                                    </p>

                                    {a.details && (
                                        <p className="text-sm text-slate-400">
                                            {a.details}
                                        </p>
                                    )}

                                    {isLocked && (
                                        <p className="mt-2 text-xs text-slate-400">
                                            This appointment has already passed and
                                            cannot be modified.
                                        </p>
                                    )}
                                </div>

                                <span className="text-sm capitalize">
                                    {a.status}
                                </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    disabled={isLocked}
                                    onClick={() =>
                                        updateStatus(a.id, "confirmed")
                                    }
                                    className={`rounded-xl px-3 py-1 text-sm
                                        ${
                                            isLocked
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    Confirm
                                </button>

                                <button
                                    disabled={isLocked}
                                    onClick={() =>
                                        updateStatus(a.id, "cancelled")
                                    }
                                    className={`rounded-xl px-3 py-1 text-sm
                                        ${
                                            isLocked
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* PAGINATION */}
            <div className="mt-8 flex items-center gap-4">
                <button
                    disabled={!previous}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="rounded-lg bg-white px-4 py-2 shadow-sm disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm text-slate-600">
                    Page {page}
                </span>

                <button
                    disabled={!next}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg bg-white px-4 py-2 shadow-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </main>
    );
}