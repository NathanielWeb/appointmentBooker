interface TimeSlotPickerProps {
    slots: string[];
    selectedSlot: string | null;
    onSelectSlot: (slot: string) => void;
    loading: boolean;
}

export default function TimeSlotPicker({
    slots,
    selectedSlot,
    onSelectSlot,
    loading,
}: TimeSlotPickerProps) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Available Time Slots
            </h2>

            {loading && (
                <p className="text-sm text-slate-500">
                    Loading available appointments...
                </p>
            )}

            {!loading && slots.length === 0 && (
                <p className="text-sm text-slate-500">
                    No available appointments for this date.
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                {slots.map((slot) => (
                    <button
                        key={slot}
                        onClick={() => onSelectSlot(slot)}
                        className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                            selectedSlot === slot
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        {slot}
                    </button>
                ))}
            </div>
        </div>
    );
}
