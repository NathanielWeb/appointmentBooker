"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import AuthInput from "@/components/auth/AuthInput"
import { Button } from "@/components/ui/button"
import { authenticatedFetch } from "@/lib/auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginForm() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()

        setLoading(true)
        setError("")

        try {
            const response = await fetch(
                `${BASE_URL}/api/auth/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error("Invalid username or password")
            }

            const meResponse = await fetch(
                `${BASE_URL}/api/auth/me/`,
                {
                    credentials: "include",
                }
            )

            if (!meResponse.ok) {
                throw new Error("Failed to fetch user")
            }

            const user = await meResponse.json()

            if (user.role !== "patient") {
                throw new Error(
                    "Administrative accounts must use the administration login page"
                )
            }

            router.push("/patient-dashboard")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <AuthInput
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <AuthInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-2xl text-sm"
            >
                {loading ? "Signing in..." : "Login"}
            </Button>

            <div className="flex items-center justify-between pt-2 text-sm">
                <Link
                    href="/"
                    className="text-gray-500 transition hover:text-black"
                >
                    Back to Home
                </Link>

                <Link
                    href="/admin-login"
                    className="text-gray-500 transition hover:text-black"
                >
                    Administration Login
                </Link>

                <Link
                    href="/register"
                    className="text-gray-500 transition hover:text-black"
                >
                    Create Account
                </Link>
            </div>
        </form>
    )
}