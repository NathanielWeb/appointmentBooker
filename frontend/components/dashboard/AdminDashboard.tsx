"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/auth";
import { isPastAppointment } from "@/lib/datetime";

import Appointment from "@/types/appointment";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Appointment[];
}

export default function AdminDashboard() {
    const router = useRouter();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [next, setNext] = useState<string | null>(null);
    const [previous, setPrevious] = useState<string | null>(null);
    const [count, setCount] = useState(0);

    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);

            try {
                const url = new URL(`${BASE_URL}/api/appointments/`);

                url.searchParams.append("page", String(page));

                if (selectedDate) {
                    url.searchParams.append("date", selectedDate);
                }

                const res = await authenticatedFetch(
                    url.toString(),
                    { credentials: "include" },
                    router
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                const data: PaginatedResponse = await res.json();

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

        fetchAll();
    }, [page, selectedDate, router]);

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

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
                    Loading system data...
                </p>
            )}

            <div className="mt-8 grid gap-4">
                {appointments.map((a) => {
                    const isPast = isPastAppointment(
                        a.appointment_date,
                        a.appointment_time
                    );

                    return (
                        <div
                            key={a.id}
                            className="rounded-2xl bg-white p-5 shadow-sm"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">
                                        Dr. {a.physician_detail.first_name} {a.physician_detail.last_name}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {a.appointment_date} at{" "}
                                        {a.appointment_time}
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        {a.reason}
                                    </p>

                                    {isPast && (
                                        <p className="mt-2 text-xs text-slate-400">
                                            This appointment has already occurred.
                                        </p>
                                    )}
                                </div>

                                <div className="text-right">
                                    <span className="text-sm capitalize">
                                        {a.status}
                                    </span>

                                    {isPast && (
                                        <p className="mt-1 text-xs text-slate-400">
                                            Completed
                                        </p>
                                    )}
                                </div>
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