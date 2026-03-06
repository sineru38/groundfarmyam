// components/TimeSlotPicker.jsx
import { HOURS, fmtHour } from "../utils/constants";

export default function TimeSlotPicker({ bookedHours = [], selectedHours = [], onToggle }) {
  return (
    <div>
      {/* Legend */}
      <div className="flex gap-4 mb-3 flex-wrap">
        {[
          { color: "bg-forest-600", label: "선택됨" },
          { color: "bg-white border border-stone-200", label: "가능" },
          { color: "bg-red-100", label: "불가" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Slots */}
      <div className="grid grid-cols-5 gap-2">
        {HOURS.map((h) => {
          const booked = bookedHours.includes(h);
          const sel    = selectedHours.includes(h);
          return (
            <button
              key={h}
              disabled={booked}
              onClick={() => !booked && onToggle(h)}
              className={[
                "rounded-xl py-3 text-center text-[0.72rem] font-medium transition-all border",
                booked ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed" :
                sel    ? "bg-forest-600 border-forest-600 text-white shadow-md font-bold" :
                         "bg-white border-stone-200 text-stone-700 hover:border-forest-400 hover:bg-forest-50 cursor-pointer",
              ].join(" ")}
            >
              <div>{fmtHour(h)}</div>
              <div className={`text-[0.6rem] mt-0.5 ${booked ? "text-red-300" : sel ? "text-forest-200" : "text-stone-300"}`}>
                {booked ? "✕" : sel ? "✓" : "○"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
