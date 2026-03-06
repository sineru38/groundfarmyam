// services/airtable.js
// 모든 Airtable API 호출 로직을 담당합니다.

const BASE_URL = "https://api.airtable.com/v0";

function getConfig() {
  return {
    apiKey:  process.env.REACT_APP_AIRTABLE_API_KEY  || "",
    baseId:  process.env.REACT_APP_AIRTABLE_BASE_ID  || "",
    tableId: process.env.REACT_APP_AIRTABLE_TABLE_NAME || "예약관리",
  };
}

function isConfigured(cfg) {
  return !!(cfg.apiKey && cfg.baseId && cfg.tableId);
}

// 예약 데이터 → Airtable 필드로 변환
function toAirtableFields(reservation) {
  return {
    "예약번호":  reservation.id,
    "예약자명":  reservation.name,
    "연락처":    reservation.phone,
    "이메일":    reservation.email || "",
    "예약일":    reservation.date,
    "방갈로":    reservation.bungalowName,
    "이용시간":  reservation.hours.map(formatHour).join(", "),
    "방문인원":  Number(reservation.guests),
    "요청사항":  reservation.memo || "",
    "상태":      "대기중",
    "접수시각":  reservation.createdAt,
    "결제금액":  Number(reservation.amount) || 0,
    "결제상태":  reservation.paymentStatus || "미결제",
  };
}

function formatHour(h) {
  if (h < 12) return `오전${h}시`;
  if (h === 12) return "오후12시";
  return `오후${h - 12}시`;
}

// 예약 생성
export async function createReservation(reservation) {
  const cfg = getConfig();
  if (!isConfigured(cfg)) {
    return { ok: false, err: "Airtable 환경변수가 설정되지 않았습니다." };
  }
  try {
    const res = await fetch(`${BASE_URL}/${cfg.baseId}/${encodeURIComponent(cfg.tableId)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: toAirtableFields(reservation) }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, err: body?.error?.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { ok: true, recordId: data.id };
  } catch (e) {
    return { ok: false, err: e.message || "네트워크 오류" };
  }
}

// 예약 목록 조회
export async function fetchReservations() {
  const cfg = getConfig();
  if (!isConfigured(cfg)) return { ok: false, err: "설정 없음", records: [] };
  try {
    const url = `${BASE_URL}/${cfg.baseId}/${encodeURIComponent(cfg.tableId)}?sort[0][field]=접수시각&sort[0][direction]=desc`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${cfg.apiKey}` },
    });
    if (!res.ok) return { ok: false, err: `HTTP ${res.status}`, records: [] };
    const data = await res.json();
    return { ok: true, records: data.records || [] };
  } catch (e) {
    return { ok: false, err: e.message, records: [] };
  }
}

// 예약 상태 업데이트
export async function updateReservationStatus(recordId, status) {
  const cfg = getConfig();
  if (!isConfigured(cfg)) return { ok: false };
  try {
    const res = await fetch(
      `${BASE_URL}/${cfg.baseId}/${encodeURIComponent(cfg.tableId)}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${cfg.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: { 상태: status } }),
      }
    );
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

// 연결 테스트
export async function testConnection() {
  const cfg = getConfig();
  if (!isConfigured(cfg)) return { ok: false, err: "환경변수 미설정" };
  try {
    const res = await fetch(
      `${BASE_URL}/${cfg.baseId}/${encodeURIComponent(cfg.tableId)}?maxRecords=1`,
      { headers: { Authorization: `Bearer ${cfg.apiKey}` } }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, err: body?.error?.message || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, err: e.message };
  }
}

export { isConfigured, getConfig };
