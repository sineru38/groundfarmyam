// components/AdminPanel.jsx
import { useState } from "react";
import { STATUS_LABEL, STATUS_COLOR, getDateLabel, fmtHour, formatPrice } from "../utils/constants";
import { testConnection } from "../services/airtable";

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "admin1234";

export default function AdminPanel({ reservations, onUpdate, onDelete, onClose }) {
  const [authed,   setAuthed]   = useState(false);
  const [pw,       setPw]       = useState("");
  const [pwErr,    setPwErr]    = useState(false);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [sortBy,   setSortBy]   = useState("newest");
  const [atStatus, setAtStatus] = useState(null);
  const [testing,  setTesting]  = useState(false);

  function login() {
    if (pw === ADMIN_PASSWORD) setAuthed(true);
    else { setPwErr(true); setTimeout(() => setPwErr(false), 2000); }
  }

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-5xl mb-4">🔐</div>
        <h3 className="font-bold text-forest-900 text-lg mb-2">관리자 로그인</h3>
        <p className="text-sm text-stone-400 mb-6">예약 관리는 관리자만 접근 가능합니다</p>
        <input
          type="password" placeholder="비밀번호" value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          className={`border-2 rounded-xl px-4 py-3 text-sm outline-none w-full max-w-xs mb-3 font-sans transition-colors ${pwErr ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-forest-500"}`}
        />
        {pwErr && <p className="text-red-500 text-xs mb-3">비밀번호가 틀렸습니다</p>}
        <button onClick={login} className="bg-gradient-to-r from-forest-600 to-forest-700 text-white rounded-xl px-8 py-3 font-bold text-sm hover:shadow-lg transition-all">
          로그인
        </button>
        <p className="text-xs text-stone-300 mt-3">시연용: admin1234</p>
      </div>
    );
  }

  const counts = {
    all:       reservations.length,
    pending:   reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  const filtered = reservations
    .filter((r) => {
      const matchFilter = filter === "all" || r.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !search || r.name?.includes(q) || r.phone?.includes(q) || r.id?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    })
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.date) - new Date(b.date) || a.hours[0] - b.hours[0]
    );

  const detail = selected ? reservations.find((r) => r.id === selected) : null;

  async function handleTest() {
    setTesting(true);
    const r = await testConnection();
    setAtStatus(r.ok ? "✅ Airtable 연결 성공!" : "❌ " + r.err);
    setTesting(false);
    setTimeout(() => setAtStatus(null), 4000);
  }

  const filterBtns = [
    { key: "all",       label: `전체 (${counts.all})` },
    { key: "pending",   label: `대기 (${counts.pending})` },
    { key: "confirmed", label: `확정 (${counts.confirmed})` },
    { key: "cancelled", label: `취소 (${counts.cancelled})` },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="font-bold text-forest-900 text-base">⚙️ 예약 관리</h3>
        <div className="flex gap-2 items-center">
          <button onClick={handleTest} disabled={testing}
            className="text-xs bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-1.5 font-semibold hover:bg-green-100 transition-colors disabled:opacity-50">
            {testing ? "테스트중..." : "🔌 Airtable 테스트"}
          </button>
          <button onClick={onClose} className="text-xs bg-stone-100 text-stone-600 rounded-lg px-3 py-1.5 font-semibold hover:bg-stone-200 transition-colors">← 홈으로</button>
        </div>
      </div>

      {atStatus && (
        <div className={`text-sm font-semibold px-4 py-2 rounded-xl mb-3 ${atStatus.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {atStatus}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "전체", count: counts.all,       color: "text-stone-700",  bg: "bg-stone-50" },
          { label: "대기", count: counts.pending,   color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "확정", count: counts.confirmed, color: "text-green-700",  bg: "bg-green-50" },
          { label: "취소", count: counts.cancelled, color: "text-red-600",    bg: "bg-red-50" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center border border-stone-100`}>
            <div className={`font-bold text-lg ${color}`}>{count}</div>
            <div className="text-xs text-stone-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-2 mb-3">
        {filterBtns.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-xs rounded-lg px-3 py-1.5 font-semibold transition-colors ${filter === key ? "bg-forest-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
            {label}
          </button>
        ))}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="text-xs bg-stone-100 border-none rounded-lg px-2 py-1.5 font-semibold text-stone-600 outline-none ml-auto cursor-pointer">
          <option value="newest">최신순</option>
          <option value="date">예약일순</option>
        </select>
      </div>
      <input placeholder="이름, 연락처, 예약번호 검색..." value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full border-2 border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none mb-3 focus:border-forest-400 font-sans transition-colors" />

      {/* Reservation List */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-stone-400 text-sm">예약 내역이 없습니다</div>
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {filtered.map((r) => (
            <div key={r.id} onClick={() => setSelected(selected === r.id ? null : r.id)}
              className={`border rounded-2xl p-4 cursor-pointer transition-all ${selected === r.id ? "border-forest-400 bg-forest-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-forest-900">{r.name}</span>
                    <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1">{getDateLabel(r.date)} · {r.bungalowName}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{r.hours?.map(fmtHour).join(", ")}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-stone-400">{r.id}</div>
                  {r.amount > 0 && <div className="text-xs font-bold text-forest-700 mt-1">{formatPrice(r.amount)}</div>}
                </div>
              </div>

              {/* Detail panel */}
              {selected === r.id && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    {[
                      ["연락처", r.phone],
                      ["이메일", r.email || "-"],
                      ["인원수", `${r.guests}명`],
                      ["접수시각", new Date(r.createdAt).toLocaleString("ko-KR")],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span className="text-stone-400">{k}: </span>
                        <span className="font-medium text-stone-700">{v}</span>
                      </div>
                    ))}
                    {r.memo && (
                      <div className="col-span-2">
                        <span className="text-stone-400">요청사항: </span>
                        <span className="font-medium text-stone-700">{r.memo}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {r.status !== "confirmed" && (
                      <button onClick={(e) => { e.stopPropagation(); onUpdate(r.id, "confirmed"); }}
                        className="flex-1 py-2 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                        ✅ 확정
                      </button>
                    )}
                    {r.status !== "cancelled" && (
                      <button onClick={(e) => { e.stopPropagation(); onUpdate(r.id, "cancelled"); }}
                        className="flex-1 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
                        🚫 취소
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); if (window.confirm("삭제하시겠습니까?")) { onDelete(r.id); setSelected(null); } }}
                      className="flex-1 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                      🗑️ 삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
