"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminDashboard from "@/components/dashboard/AdminDashboard";
import Navbar from "@/components/nav/Navbar";
import { checkAuth } from "@/lib/auth";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        checkAuth(router);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar role="admin" />

            <main className="p-6">
                <AdminDashboard />
            </main>
        </div>
    );
}