// components/BookingForm.jsx
import { useState } from "react";
import MiniCalendar from "./MiniCalendar";
import TimeSlotPicker from "./TimeSlotPicker";
import { BUNGALOWS, fmtHour, getDateLabel, genId, formatPrice } from "../utils/constants";
import { createReservation } from "../services/airtable";
import { requestPayment, calcAmount } from "../services/tossPayments";

const STEPS = ["날짜 & 방갈로", "시간 선택", "예약자 정보", "결제"];

export default function BookingForm({ getBookedHours, onComplete }) {
  const [step, setStep]       = useState(1);
  const [selDate, setSelDate] = useState("");
  const [bungalow, setBungalow] = useState(null);
  const [selHours, setSelHours] = useState([]);
  const [form, setForm]       = useState({ name: "", phone: "", email: "", guests: "", memo: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [payMethod, setPayMethod] = useState("card");

  const bName = bungalow ? BUNGALOWS.find((b) => b.id === bungalow) : null;
  const bookedHours = selDate && bungalow ? getBookedHours(selDate, bungalow) : [];
  const amount = calcAmount(selHours.length);

  function toggleHour(h) {
    setSelHours((prev) => prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h].sort((a, b) => a - b));
  }
  function setField(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  const canStep2 = selDate && bungalow;
  const canStep3 = selHours.length > 0;
  const canStep4 = form.name.trim() && form.phone.trim() && form.guests;

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    const reservation = {
      id:           genId(),
      bungalowId:   bungalow,
      bungalowName: bName.name,
      date:         selDate,
      hours:        selHours,
      guests:       Number(form.guests),
      name:         form.name.trim(),
      phone:        form.phone.trim(),
      email:        form.email.trim(),
      memo:         form.memo.trim(),
      amount,
      paymentStatus: "미결제",
      createdAt:    new Date().toISOString(),
    };

    // 1. Airtable 저장
    await createReservation(reservation);

    // 2. 토스페이먼츠 결제 (설정된 경우)
    if (payMethod === "toss" && process.env.REACT_APP_TOSS_CLIENT_KEY) {
      try {
        await requestPayment({ reservation, amount });
        // requestPayment는 리다이렉트하므로 이후 코드는 실행되지 않음
        return;
      } catch (e) {
        setError("결제 요청 중 오류가 발생했습니다: " + e.message);
        setSubmitting(false);
        return;
      }
    }

    // 3. 로컬 저장 및 완료
    onComplete(reservation);
    setSubmitting(false);
  }

  const inputClass = "w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm outline-none font-sans transition-colors focus:border-forest-500 bg-white";

  return (
    <div className="max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  done   ? "bg-forest-600 text-white" :
                  active ? "bg-forest-600 text-white ring-4 ring-forest-100" :
                           "bg-stone-100 text-stone-400",
                ].join(" ")}>
                  {done ? "✓" : n}
                </div>
                <span className={`text-[0.65rem] font-medium hidden sm:block ${active ? "text-forest-700" : "text-stone-400"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${step > n ? "bg-forest-500" : "bg-stone-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: 날짜 & 방갈로 ── */}
      {step === 1 && (
        <div className="animate-fade-up">
          <h3 className="font-korean font-bold text-forest-900 text-lg mb-4">📅 예약 날짜를 선택하세요</h3>
          <MiniCalendar selected={selDate} onSelect={setSelDate} />

          <h3 className="font-korean font-bold text-forest-900 text-lg mt-6 mb-3">🏡 방갈로를 선택하세요</h3>
          <div className="flex flex-col gap-3">
            {BUNGALOWS.map((b) => {
              const isSel = bungalow === b.id;
              return (
                <button key={b.id} onClick={() => setBungalow(b.id)}
                  className={[
                    "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                    isSel ? "border-forest-500 bg-forest-50 shadow-md" : "border-stone-200 bg-white hover:border-forest-300 hover:bg-stone-50",
                  ].join(" ")}>
                  <span className="text-3xl">{b.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-forest-900 text-sm">{b.name}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{b.desc}</div>
                    <div className="text-xs text-forest-600 font-semibold mt-1">{b.capacity} · {formatPrice(b.price)}/시간</div>
                  </div>
                  {isSel && <span className="text-forest-600 text-xl font-bold">✓</span>}
                </button>
              );
            })}
          </div>

          <button disabled={!canStep2} onClick={() => setStep(2)}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-sm transition-all ${canStep2 ? "bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>
            다음 단계 →
          </button>
        </div>
      )}

      {/* ── STEP 2: 시간 선택 ── */}
      {step === 2 && (
        <div className="animate-fade-up">
          <button onClick={() => setStep(1)} className="text-sm text-forest-600 font-semibold mb-4 flex items-center gap-1 hover:underline">← 이전 단계</button>
          <div className="bg-forest-50 border border-forest-200 rounded-xl px-4 py-3 mb-5 text-sm text-forest-800 font-medium leading-relaxed">
            📅 {getDateLabel(selDate)} &nbsp;·&nbsp; {bName?.name}
          </div>
          <h3 className="font-korean font-bold text-forest-900 text-lg mb-4">⏰ 이용 시간 선택 <span className="text-stone-400 text-xs font-normal">(복수 선택 가능)</span></h3>
          <TimeSlotPicker bookedHours={bookedHours} selectedHours={selHours} onToggle={toggleHour} />

          {selHours.length > 0 && (
            <div className="mt-4 bg-earth-50 border border-earth-200 rounded-xl px-4 py-3 text-sm text-earth-700 font-semibold">
              💰 예상 금액: {formatPrice(amount)} ({selHours.length}시간)
            </div>
          )}

          <button disabled={!canStep3} onClick={() => setStep(3)}
            className={`w-full mt-4 py-4 rounded-2xl font-bold text-sm transition-all ${canStep3 ? "bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>
            {canStep3 ? `다음 단계 → (${selHours.length}시간 선택)` : "시간을 선택해 주세요"}
          </button>
        </div>
      )}

      {/* ── STEP 3: 예약자 정보 ── */}
      {step === 3 && (
        <div className="animate-fade-up">
          <button onClick={() => setStep(2)} className="text-sm text-forest-600 font-semibold mb-4 flex items-center gap-1 hover:underline">← 이전 단계</button>
          <div className="bg-forest-50 border border-forest-200 rounded-xl px-4 py-3 mb-5 text-sm text-forest-800 font-medium leading-relaxed">
            📅 {getDateLabel(selDate)} · {bName?.name}<br />
            ⏰ {selHours.map(fmtHour).join(", ")} · 💰 {formatPrice(amount)}
          </div>

          <h3 className="font-korean font-bold text-forest-900 text-lg mb-4">👤 예약자 정보</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "예약자 이름 *", key: "name", type: "text", placeholder: "홍길동" },
              { label: "연락처 *", key: "phone", type: "tel", placeholder: "010-0000-0000" },
              { label: "이메일", key: "email", type: "email", placeholder: "example@email.com" },
              { label: "방문 인원 *", key: "guests", type: "number", placeholder: "4" },
              { label: "요청 사항", key: "memo", type: "text", placeholder: "알레르기, 특별 요청 등" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <button disabled={!canStep4} onClick={() => setStep(4)}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-sm transition-all ${canStep4 ? "bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>
            다음 단계 → (결제)
          </button>
        </div>
      )}

      {/* ── STEP 4: 결제 ── */}
      {step === 4 && (
        <div className="animate-fade-up">
          <button onClick={() => setStep(3)} className="text-sm text-forest-600 font-semibold mb-4 flex items-center gap-1 hover:underline">← 이전 단계</button>

          {/* 예약 요약 */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-5">
            <h4 className="font-bold text-forest-900 text-sm mb-3">📋 예약 요약</h4>
            <div className="flex flex-col gap-2 text-sm">
              {[
                ["방갈로",   bName?.name],
                ["예약일",   getDateLabel(selDate)],
                ["이용시간", selHours.map(fmtHour).join(", ")],
                ["예약자",   form.name],
                ["연락처",   form.phone],
                ["방문인원", `${form.guests}명`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-stone-500">{k}</span>
                  <span className="font-medium text-stone-800">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-stone-200 mt-1">
                <span className="font-bold text-stone-700">총 결제금액</span>
                <span className="font-bold text-forest-700 text-base">{formatPrice(amount)}</span>
              </div>
            </div>
          </div>

          {/* 결제 수단 */}
          <h4 className="font-bold text-forest-900 text-sm mb-3">💳 결제 수단</h4>
          <div className="flex gap-3 mb-5">
            {[
              { id: "toss", label: "🔵 토스페이먼츠", desc: "카드/계좌이체" },
              { id: "card", label: "✅ 현장 결제", desc: "방문 시 결제" },
            ].map((m) => (
              <button key={m.id} onClick={() => setPayMethod(m.id)}
                className={[
                  "flex-1 p-3 rounded-xl border-2 text-left transition-all",
                  payMethod === m.id ? "border-forest-500 bg-forest-50" : "border-stone-200 bg-white hover:border-stone-300",
                ].join(" ")}>
                <div className="text-sm font-bold text-stone-800">{m.label}</div>
                <div className="text-xs text-stone-400 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">⚠️ {error}</div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${submitting ? "bg-stone-200 text-stone-400 cursor-not-allowed" : "bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"}`}>
            {submitting ? "처리 중..." : payMethod === "toss" ? "💳 토스페이먼츠로 결제하기" : "✅ 예약 신청 완료"}
          </button>
        </div>
      )}
    </div>
  );
}
