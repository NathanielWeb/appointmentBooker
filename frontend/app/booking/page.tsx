"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { checkAuth } from "@/lib/auth";
import BookingPage from "@/components/booking/BookingPage";
import Navbar from "@/components/nav/Navbar";

export default function PatientBookingPage() {
    const router = useRouter();

    useEffect(() => {
        checkAuth(router);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar role="patient" />
            <main className="p-6">
                <BookingPage />
            </main>
        </div>
    );
}