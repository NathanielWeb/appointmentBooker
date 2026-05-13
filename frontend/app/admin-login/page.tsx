import AuthCard from "@/components/auth/AuthCard"
import AdminLoginForm from "@/components/auth/AdminLoginForm"

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <AuthCard
                title="Welcome Back"
                subtitle="Sign in here to access your administrative account!"
            >
                <AdminLoginForm />
            </AuthCard>
        </main>
    )
}