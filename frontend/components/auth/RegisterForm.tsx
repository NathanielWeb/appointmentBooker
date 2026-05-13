"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthInput from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            // 1. Register
            const registerResponse = await fetch(
                `${BASE_URL}/api/auth/register/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        ...formData,
                        role: "patient",
                    }),
                }
            );

            if (!registerResponse.ok) {
                throw new Error("Unable to create account");
            }

            // 2. Login (same as LoginForm)
            const loginResponse = await fetch(
                `${BASE_URL}/api/auth/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                }
            );

            if (!loginResponse.ok) {
                throw new Error("Account created but login failed");
            }

            // 3. HARD AUTH CHECK (same pattern as LoginForm)
            const meResponse = await fetch(
                `${BASE_URL}/api/auth/me/`,
                {
                    credentials: "include",
                }
            );

            if (!meResponse.ok) {
                throw new Error("Failed to verify authentication");
            }

            const user = await meResponse.json();

            if (user.role !== "patient") {
                throw new Error("Invalid account role");
            }

            // 4. ONLY NOW allow navigation
            router.push("/patient-dashboard");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <AuthInput
                    label="First Name"
                    name="first_name"
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />

                <AuthInput
                    label="Last Name"
                    name="last_name"
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <AuthInput
                label="Username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
            />

            <AuthInput
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-2xl text-sm"
            >
                {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="flex items-center justify-between pt-1 text-sm">
                <Link href="/" className="text-slate-500 hover:text-slate-900">
                    Back to Home
                </Link>

                <Link href="/login" className="text-slate-500 hover:text-slate-900">
                    Already have an account?
                </Link>
            </div>
        </form>
    );
}