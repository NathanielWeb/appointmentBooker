"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PhysicianSelect from "./PhysicianSelect";
import AvailabilityCalendar from "./AvailabilityCalendar";
import TimeSlotPicker from "./TimeSlotPicker";
import AppointmentForm from "@/components/booking/AppointmentForm";

import Physician from "@/types/physician";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BookingPage() {
    const router = useRouter();

    const [physicians, setPhysicians] = useState<Physician[]>([]);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const [selectedPhysician, setSelectedPhysician] =
        useState<Physician | null>(null);

    const [selectedDate, setSelectedDate] =
        useState<Date | undefined>();

    const [selectedSlot, setSelectedSlot] =
        useState<string | null>(null);

    const [unavailableDates, setUnavailableDates] =
        useState<string[]>([]);

    const [availableSlots, setAvailableSlots] =
        useState<string[]>([]);

    const [loadingSlots, setLoadingSlots] =
        useState(false);

    // ✅ HARD AUTH GATE (same pattern as LoginForm)
    useEffect(() => {
        async function initAuthAndLoadPhysicians() {
            try {
                const meResponse = await fetch(
                    `${BASE_URL}/api/auth/me/`,
                    {
                        credentials: "include",
                    }
                );

                if (!meResponse.ok) {
                    router.push("/login");
                    return;
                }

                const user = await meResponse.json();

                if (user.role !== "patient") {
                    router.push("/login");
                    return;
                }

                const response = await fetch(
                    `${BASE_URL}/api/physicians/`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    setPhysicians([]);
                    return;
                }

                const data = await response.json();

                const safeArray: Physician[] = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.results)
                    ? data.results
                    : [];

                setPhysicians(safeArray);
            } finally {
                setLoadingAuth(false);
            }
        }

        initAuthAndLoadPhysicians();
    }, [router]);

    useEffect(() => {
        async function fetchUnavailableDates() {
            if (!selectedPhysician) return;

            const response = await fetch(
                `${BASE_URL}/api/physicians/${selectedPhysician.id}/availability/`,
                {
                    credentials: "include",
                }
            );

            const data = await response.json();

            setUnavailableDates(data.unavailable_dates || []);
        }

        fetchUnavailableDates();
    }, [selectedPhysician]);

    useEffect(() => {
        async function fetchAvailableSlots() {
            if (!selectedPhysician || !selectedDate) return;

            setLoadingSlots(true);

            try {
                const formattedDate =
                    selectedDate.toISOString().split("T")[0];

                const response = await fetch(
                    `${BASE_URL}/api/physicians/${selectedPhysician.id}/availability/?date=${formattedDate}`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                setAvailableSlots(data.available_slots || []);
            } finally {
                setLoadingSlots(false);
            }
        }

        fetchAvailableSlots();
    }, [selectedPhysician, selectedDate]);

    if (loadingAuth) {
        return (
            <main className="min-h-screen bg-slate-100 flex items-center justify-center">
                <p className="text-slate-500">Loading...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Book an Appointment
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Schedule appointments with trusted healthcare professionals.
                    </p>
                </div>

                <div className="space-y-8">
                    <PhysicianSelect
                        physicians={physicians}
                        selectedPhysician={selectedPhysician}
                        onSelect={setSelectedPhysician}
                    />

                    {selectedPhysician && (
                        <div className="grid gap-8 lg:grid-cols-2">
                            <AvailabilityCalendar
                                selectedDate={selectedDate}
                                onSelectDate={setSelectedDate}
                                unavailableDates={unavailableDates}
                            />

                            <TimeSlotPicker
                                slots={availableSlots}
                                selectedSlot={selectedSlot}
                                onSelectSlot={setSelectedSlot}
                                loading={loadingSlots}
                            />
                        </div>
                    )}

                    {selectedPhysician &&
                        selectedDate &&
                        selectedSlot && (
                            <AppointmentForm
                                physician={selectedPhysician}
                                selectedDate={selectedDate}
                                selectedSlot={selectedSlot}
                            />
                        )}
                </div>
            </section>
        </main>
    );
}