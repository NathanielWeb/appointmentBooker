"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import BookingModal from "@/components/booking/BookingModal";
import Physician from "@/types/physician";

interface PhysicianCardProps {
  physician: Physician
}

export default function PhysicianCard({
  physician,
}: PhysicianCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Dr. {physician.first_name} {physician.last_name}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {physician.specialty}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-semibold text-slate-700">
            {physician.first_name[0]}
            {physician.last_name[0]}
          </div>
        </div>

        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
          {physician.bio ||
            "Experienced healthcare professional dedicated to patient care."}
        </p>

        <Button
          onClick={() => setOpen(true)}
          className="mt-6 h-11 w-full rounded-2xl"
        >
          Book Appointment
        </Button>
      </div>

      {open && (
        <BookingModal
          physician={physician}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
