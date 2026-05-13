"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Physician from "@/types/physician";
import { authenticatedFetch } from "@/lib/auth";
import { useRouter } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface BookingModalProps {
  physician: Physician;
  onClose: () => void;
}

export default function BookingModal({
  physician,
  onClose,
}: BookingModalProps) {
  const router = useRouter();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBooking(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await authenticatedFetch(
        `${BASE_URL}/appointments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            physician: physician.id,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            reason,
          }),
        },
        router
      );

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Book Appointment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Dr. {physician.first_name} {physician.last_name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleBooking}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Appointment Date
            </label>

            <input
              type="date"
              value={appointmentDate}
              onChange={(e) =>
                setAppointmentDate(e.target.value)
              }
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Appointment Time
            </label>

            <input
              type="time"
              value={appointmentTime}
              onChange={(e) =>
                setAppointmentTime(e.target.value)
              }
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Reason for Visit
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your reason for booking this appointment"
              required
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 flex-1 rounded-2xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 flex-1 rounded-2xl"
            >
              {loading ? "Booking..." : "Confirm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
