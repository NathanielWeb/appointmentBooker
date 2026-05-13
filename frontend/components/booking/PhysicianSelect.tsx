"use client";


import Physician from "@/types/physician";

interface PhysicianSelectProps {
    physicians: Physician[];
    selectedPhysician: Physician | null;
    onSelect: (physician: Physician) => void;
}

export default function PhysicianSelect({
    physicians,
    selectedPhysician,
    onSelect,
}: PhysicianSelectProps) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <label className="mb-3 block text-sm font-medium text-slate-700">
                Select Physician
            </label>

            <select
                value={selectedPhysician?.id || ""}
                onChange={(e) => {
                    const physician = physicians.find(
                        (p) => p.id === Number(e.target.value)
                    );

                    if (physician) {
                        onSelect(physician);
                    }
                }}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
            >
                <option value="">
                    Choose a physician
                </option>

                {physicians.map((physician) => (
                    <option
                        key={physician.id}
                        value={physician.id}
                    >
                        Dr. {physician.first_name} {physician.last_name} — {physician.specialty}
                    </option>
                ))}
            </select>
        </div>
    );
}
