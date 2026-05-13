"use client";

import { authenticatedFetch } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type NavbarProps = {
    role?: "admin" | "physician" | "patient";
};

export default function Navbar({ role }: NavbarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authenticatedFetch(
                `${BASE_URL}/api/auth/logout/`, 
                {
                    method: "POST",
                    credentials: "include",
                },
                router
            );
        } catch (error) {
            console.error(error);
        }

        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="w-full border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-xl font-semibold text-gray-900"
                    >
                        PhysFind
                    </Link>

                    {role === "patient" && (
                        <>
                            <Link
                                href="/patient-dashboard"
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/booking"
                                className="text-sm text-gray-600 hover:text-black"
                            >
                                Book Appointment
                            </Link>
                        </>
                    )}

                    {role === "physician" && (
                        <Link
                            href="/physician"
                            className="text-sm text-gray-600 hover:text-black"
                        >
                            Dashboard
                        </Link>
                    )}

                    {role === "admin" && (
                        <Link
                            href="/admin"
                            className="text-sm text-gray-600 hover:text-black"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}