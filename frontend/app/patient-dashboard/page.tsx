"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/nav/Navbar";
import { authenticatedFetch } from "@/lib/auth";
import { isPastAppointment } from "@/lib/datetime";

import Appointment from "@/types/appointment";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PatientDashboard() {
    const router = useRouter();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await authenticatedFetch(
                    `${BASE_URL}/api/appointments/`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                    router
                );

                if (response.status === 401) {
                    router.push("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                const data = await response.json();

                setAppointments(data.results);
            } catch (err) {
                console.error(err);
                setError("Unable to load appointments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [router]);

    async function updateStatus(id: number, status: string, isLocked: boolean) {
        if (isLocked) return;

        if (status === "cancelled") {
            const confirmed = window.confirm(
                "Are you sure you want to cancel this appointment?"
            );

            if (!confirmed) return;
        }

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
        <div className="min-h-screen bg-gray-100">
            <Navbar role="patient" />

            <main className="mx-auto max-w-6xl p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Patient Dashboard
                        </h1>

                        <p className="mt-2 text-gray-600">
                            View your appointments and manage bookings.
                        </p>
                    </div>

                    <Link
                        href="/booking"
                        className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                    >
                        Book Appointment
                    </Link>
                </div>

                {loading && (
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-gray-600">
                            Loading appointments...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {!loading && appointments.length === 0 && (
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No appointments yet
                        </h2>

                        <p className="mt-2 text-gray-600">
                            Schedule your first appointment with one of our
                            physicians.
                        </p>

                        <Link
                            href="/booking"
                            className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                        >
                            Book Appointment
                        </Link>
                    </div>
                )}

                {!loading && appointments.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {appointments.map((appointment) => {
                            const isPast = isPastAppointment(
                                appointment.appointment_date,
                                appointment.appointment_time
                            );

                            const isLocked =
                                isPast || appointment.status === "cancelled";

                            return (
                                <div
                                    key={appointment.id}
                                    className="rounded-2xl border bg-white p-5 shadow-sm"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Appointment #{appointment.id}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {appointment.appointment_date} at{" "}
                                                {appointment.appointment_time}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                appointment.status === "confirmed"
                                                    ? "bg-green-100 text-green-700"
                                                    : appointment.status ===
                                                      "cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                Reason
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {appointment.reason}
                                            </p>
                                        </div>

                                        {appointment.details && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Details
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.details}
                                                </p>
                                            </div>
                                        )}

                                        {isPast && (
                                            <p className="text-xs text-gray-400">
                                                This appointment has already occurred and
                                                can no longer be changed.
                                            </p>
                                        )}

                                        <button
                                            disabled={isLocked}
                                            onClick={() =>
                                                updateStatus(
                                                    appointment.id,
                                                    "cancelled",
                                                    isLocked
                                                )
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
                )}
            </main>
        </div>
    );
}