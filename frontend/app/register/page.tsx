import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <AuthCard
        title="Create Account"
        subtitle="Create your PhysFind patient account"
      >
        <RegisterForm />
      </AuthCard>
    </main>
  );
}