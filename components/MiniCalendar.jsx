// components/MiniCalendar.jsx
import { useState } from "react";
import { getTodayStr } from "../utils/constants";

const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAY_NAMES   = ["일","월","화","수","목","금","토"];

export default function MiniCalendar({ selected, onSelect }) {
  const today = getTodayStr();
  const now = new Date();
  const [curY, setCurY] = useState(now.getFullYear());
  const [curM, setCurM] = useState(now.getMonth());

  const firstDow = new Date(curY, curM, 1).getDay();
  const daysInMonth = new Date(curY, curM + 1, 0).getDate();
  const cells = Array(firstDow).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  function prev() {
    if (curM === 0) { setCurY(curY - 1); setCurM(11); } else setCurM(curM - 1);
  }
  function next() {
    if (curM === 11) { setCurY(curY + 1); setCurM(0); } else setCurM(curM + 1);
  }

  return (
    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <button onClick={prev} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-forest-100 text-forest-600 font-bold text-lg transition-colors">‹</button>
        <span className="font-bold text-forest-900 text-sm">{curY}년 {MONTH_NAMES[curM]}</span>
        <button onClick={next} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-forest-100 text-forest-600 font-bold text-lg transition-colors">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div key={d} className={`text-center text-[0.68rem] font-bold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-stone-400"}`}>{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const str = `${curY}-${String(curM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isPast = str < today;
          const isSel  = str === selected;
          const isToday = str === today;
          const dow = (firstDow + day - 1) % 7;

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelect(str)}
              className={[
                "rounded-lg py-2 text-[0.82rem] font-medium transition-all",
                isSel   ? "bg-forest-600 text-white font-bold shadow-md" :
                isToday ? "bg-forest-100 text-forest-700 font-bold" :
                isPast  ? "text-stone-300 cursor-not-allowed" :
                          "hover:bg-forest-50",
                !isSel && !isPast && dow === 0 ? "text-red-400" : "",
                !isSel && !isPast && dow === 6 ? "text-blue-400" : "",
                !isSel && !isPast && dow > 0 && dow < 6 ? "text-stone-700" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
