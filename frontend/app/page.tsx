import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white/70 backdrop-blur">
        <div className="text-xl font-semibold tracking-tight">
          PhysFind
        </div>

        <div className="flex gap-3">
          <a href="/login">
            <Button variant="ghost">Login</Button>
          </a>
          <a href="/register">
            <Button>Register</Button>
          </a>
          <a href="/admin-login">
            <Button variant="ghost">Admin Login</Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left side */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Healthcare Appointment Scheduling, Simplified
          </h1>

          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Book appointments with physicians in real time, manage availability
            seamlessly, and streamline patient scheduling with a modern,
            secure platform.
          </p>

          {/* CTA Section */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex gap-4">
              <a href="/register">
                <Button size="lg">Get Started</Button>
              </a>

              <a href="/login">
                <Button size="lg" variant="outline">
                  Patient Login
                </Button>
              </a>
            </div>

            <div className="mt-2">
              <p className="text-xs text-slate-500">
                For physicians and administrators managing the platform
              </p>

              <a href="/admin-login">
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 text-slate-700 border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
                >
                  Admin / Physician Login
                </Button>
              </a>
            </div>
          </div>

          {/* How it works (replaces demo accounts) */}
          <div className="mt-10 p-5 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold mb-3">How it works</h3>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">1.</span> Create an account as a patient
              </p>
              <p>
                <span className="font-medium text-slate-800">2.</span> Browse available physicians and time slots in real time
              </p>
              <p>
                <span className="font-medium text-slate-800">3.</span> Book and manage appointments instantly through your dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right side visual */}
        <div className="relative">
          <img
            src="/images/patient-dashboard-example.png"
            alt="Patient dashboard example"
            className="rounded-2xl border bg-white shadow-xl w-full"
          />

          {/* subtle glow */}
          <div className="absolute -z-10 inset-0 blur-3xl opacity-20 bg-blue-400 rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Real-time Scheduling",
            desc: "View and book available physician time slots instantly.",
          },
          {
            title: "Role-based Dashboards",
            desc: "Separate views for patients, physicians, and admins.",
          },
          {
            title: "Secure Authentication",
            desc: "JWT-based login with protected API routes.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="p-6 border rounded-xl bg-white shadow-sm"
          >
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}