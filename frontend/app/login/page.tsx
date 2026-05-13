import AuthCard from "@/components/auth/AuthCard"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to access your PhysFind dashboard"
            >
                <LoginForm />
            </AuthCard>
        </main>
    )
}