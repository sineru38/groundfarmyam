// App.js
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import AdminPanel from "./components/AdminPanel";
import { PaymentSuccess, PaymentFail } from "./pages/PaymentPages";
import { useReservations } from "./hooks/useReservations";
import { MENU_ITEMS, TESTIMONIALS } from "./utils/constants";

// ─────────────────────────────────────────────────────────────
// HomePage
// ─────────────────────────────────────────────────────────────
function HomePage({ onBook, onAdmin }) {
  return (
    <div className="font-sans bg-[#faf8f3] min-h-screen">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[rgba(250,248,243,0.95)] backdrop-blur border-b border-forest-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <span className="font-display text-forest-800 text-xl font-bold tracking-tight">Ground Farm</span>
          <div className="flex gap-3">
            <button onClick={onAdmin} className="text-sm text-stone-500 hover:text-forest-700 font-medium transition-colors hidden sm:block">관리자</button>
            <button onClick={onBook} className="bg-forest-700 text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-forest-800 transition-all shadow-md hover:shadow-lg">방갈로 예약 →</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-5 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-forest-50 border border-forest-200 rounded-full px-4 py-1.5 text-xs text-forest-700 font-semibold mb-8">
          <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-pulse" />
          2026 봄 시즌 예약 오픈
        </div>
        <h1 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.15] text-forest-950 mb-6">
          땅과 가까워지는<br />
          <em className="text-forest-600 not-italic">나만의 쉼표</em>
        </h1>
        <p className="text-stone-500 text-[clamp(0.9rem,2vw,1.05rem)] leading-relaxed mb-10 font-light max-w-lg mx-auto">
          경기도 용인 깊은 산자락, 친환경 주말농장<br />
          텃밭 분양 · 방갈로 숙박 · 계절 체험 프로그램
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={onBook}
            className="bg-gradient-to-br from-forest-600 to-forest-800 text-white font-bold px-9 py-4 rounded-full text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
            🏡 방갈로 예약하기 →
          </button>
          <a href="tel:1800-5171"
            className="border-2 border-forest-600 text-forest-700 font-bold px-7 py-4 rounded-full text-sm hover:bg-forest-50 transition-all">
            📞 전화 문의
          </a>
        </div>

        {/* Stats */}
        <div className="flex gap-12 justify-center mt-16 pt-10 border-t border-forest-100">
          {[["120+", "텃밭 분양"], ["3개", "방갈로"], ["12종", "체험 프로그램"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-[clamp(1.7rem,4vw,2.2rem)] font-bold text-forest-700">{n}</div>
              <div className="text-xs text-stone-400 font-semibold mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-forest-950 mb-3">그라운드팜 예약 서비스</h2>
          <p className="text-stone-400 text-sm font-light">세 가지 방법으로 자연과 더 가까워지세요</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {MENU_ITEMS.map((item, idx) => (
            <div key={item.id}
              onClick={() => item.bookable && onBook()}
              style={{ animationDelay: `${idx * 0.12}s` }}
              className={[
                "animate-fade-up rounded-3xl p-8 border relative overflow-hidden transition-all",
                item.bookable ? "cursor-pointer hover:-translate-y-1 hover:shadow-2xl" : "",
                idx === 0 ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200" :
                idx === 1 ? "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200" :
                            "bg-gradient-to-br from-lime-50 to-green-100 border-lime-200",
              ].join(" ")}>
              {item.bookable && (
                <div className="absolute top-4 left-4 bg-earth-600 text-white text-[0.6rem] font-bold px-2.5 py-1 rounded-full">예약 가능</div>
              )}
              <div className="absolute top-4 right-5 font-display text-6xl font-bold opacity-[0.06] leading-none">0{idx + 1}</div>
              <div className="text-4xl mb-4 mt-2">{item.emoji}</div>
              <p className="text-[0.65rem] font-bold tracking-widest uppercase text-stone-400 mb-1">{item.subtitle}</p>
              <h3 className="font-korean font-bold text-lg text-stone-800 mb-2">{item.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed font-light mb-4">{item.desc}</p>
              <div className="flex gap-2 flex-wrap mb-5">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[0.68rem] bg-white/70 border border-white/50 text-stone-600 font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <button onClick={(e) => { e.stopPropagation(); item.bookable && onBook(); }}
                className={[
                  "text-xs font-bold border-2 rounded-full px-5 py-2.5 transition-colors",
                  idx === 0 ? "border-green-400 text-green-700 hover:bg-green-100" :
                  idx === 1 ? "border-amber-400 text-amber-700 hover:bg-amber-100" :
                              "border-lime-500 text-lime-700 hover:bg-lime-100",
                ].join(" ")}>
                {item.bookable ? "지금 예약 →" : "자세히 보기 →"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-to-br from-forest-900 to-forest-950 py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-emerald-50 mb-3">농장 이야기</h2>
            <p className="text-forest-400 text-sm font-light">그라운드팜을 다녀간 분들의 이야기</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-2xl text-forest-400 mb-3 font-display">"</div>
                <p className="text-forest-200 text-sm leading-relaxed font-light mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-emerald-100 font-bold text-sm">{t.name}</div>
                    <div className="text-forest-500 text-xs">{t.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center bg-[#faf8f3]">
        <div className="max-w-xl mx-auto">
          <div className="text-5xl mb-5">🌿</div>
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-forest-950 leading-tight mb-4">
            자연 속의 하루를<br />지금 예약하세요
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed font-light mb-10">
            경기도 용인 그라운드팜에서<br />흙의 온기와 바람 소리, 별빛을 느껴보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onBook} className="bg-gradient-to-br from-forest-600 to-forest-800 text-white font-bold px-10 py-4 rounded-full text-sm shadow-xl hover:-translate-y-0.5 transition-all">
              🏡 방갈로 예약하기 →
            </button>
            <button onClick={onAdmin} className="border-2 border-forest-600 text-forest-700 font-bold px-7 py-4 rounded-full text-sm hover:bg-forest-50 transition-all">
              ⚙️ 관리자
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-forest-950 py-10 px-5 text-forest-500">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-6">
          <div>
            <div className="font-display text-forest-200 text-lg mb-2">Ground Farm</div>
            <div className="text-xs leading-relaxed">
              경기도 용인시 처인구 남사읍 전궁로 95번길 89<br />
              그라운드팜 캠핑야미점 &nbsp;·&nbsp; 📞 1800-5171
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={onBook} className="text-xs bg-white/8 border border-white/15 text-forest-200 rounded-full px-4 py-2 font-semibold hover:bg-white/15 transition-colors">방갈로 예약</button>
            <button onClick={onAdmin} className="text-xs bg-white/8 border border-white/15 text-forest-200 rounded-full px-4 py-2 font-semibold hover:bg-white/15 transition-colors">관리자</button>
            <a href="tel:1800-5171" className="text-xs bg-forest-700 text-white rounded-full px-4 py-2 font-semibold hover:bg-forest-600 transition-colors">📞 전화</a>
          </div>
          <div className="text-xs w-full text-center">© 2026 그라운드팜. All rights reserved.</div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-2 p-3 bg-[rgba(250,248,243,0.97)] backdrop-blur border-t border-forest-100">
        <button onClick={onBook} className="flex-[2] bg-gradient-to-r from-forest-600 to-forest-800 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg">🏡 방갈로 예약하기</button>
        <a href="tel:1800-5171" className="flex-1 flex items-center justify-center border-2 border-forest-600 text-forest-700 font-bold rounded-2xl text-sm">📞 전화</a>
      </div>
      <div className="sm:hidden h-20" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal wrapper
// ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-100 flex items-center justify-between px-6 py-4 rounded-t-3xl z-10">
          <h2 className="font-korean font-bold text-forest-900 text-base">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors text-lg">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Success screen
// ─────────────────────────────────────────────────────────────
function BookingSuccess({ reservation, onClose }) {
  return (
    <div className="text-center py-4">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="font-display font-bold text-forest-900 text-2xl mb-2">예약 완료!</h3>
      <p className="text-stone-400 text-sm mb-6">예약이 성공적으로 접수되었습니다</p>
      <div className="bg-stone-50 rounded-2xl p-5 text-left text-sm mb-6">
        <div className="flex flex-col gap-2">
          {[
            ["예약번호", reservation.id],
            ["예약자",   reservation.name],
            ["방갈로",   reservation.bungalowName],
            ["예약일",   reservation.date],
            ["연락처",   reservation.phone],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-stone-400">{k}</span>
              <span className="font-semibold text-stone-700 font-mono">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-stone-400 mb-5">확인 연락을 드리겠습니다. 📞 1800-5171</p>
      <button onClick={onClose} className="w-full py-3.5 bg-gradient-to-r from-forest-600 to-forest-700 text-white font-bold rounded-2xl text-sm hover:shadow-lg transition-all">
        홈으로 돌아가기
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main App shell
// ─────────────────────────────────────────────────────────────
function AppShell() {
  const [modal, setModal] = useState(null); // "booking" | "admin" | null
  const [successRec, setSuccessRec] = useState(null);
  const { reservations, addReservation, updateStatus, deleteReservation, getBookedHours } = useReservations();

  function handleComplete(rec) {
    addReservation(rec);
    setModal(null);
    setSuccessRec(rec);
  }

  return (
    <>
      <HomePage
        onBook={() => { setModal("booking"); setSuccessRec(null); }}
        onAdmin={() => setModal("admin")}
      />

      {modal === "booking" && !successRec && (
        <Modal title="🏡 방갈로 예약" onClose={() => setModal(null)}>
          <BookingForm getBookedHours={getBookedHours} onComplete={handleComplete} />
        </Modal>
      )}

      {successRec && (
        <Modal title="예약 완료" onClose={() => setSuccessRec(null)}>
          <BookingSuccess reservation={successRec} onClose={() => setSuccessRec(null)} />
        </Modal>
      )}

      {modal === "admin" && (
        <Modal title="⚙️ 관리자 패널" onClose={() => setModal(null)}>
          <AdminPanel
            reservations={reservations}
            onUpdate={updateStatus}
            onDelete={deleteReservation}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />
      </Routes>
    </BrowserRouter>
  );
}
