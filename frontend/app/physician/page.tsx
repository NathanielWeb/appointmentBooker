"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import PhysicianDashboard from "@/components/dashboard/PhysicianDashboard";
import Navbar from "@/components/nav/Navbar";
import { checkAuth } from "@/lib/auth";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        checkAuth(router);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar role="physician" />

            <main className="p-6">
                <PhysicianDashboard />
            </main>
        </div>
    );
}