// utils/constants.js

export const BUNGALOWS = [
  { id: "B1", name: "소나무 방갈로", capacity: "최대 4인", icon: "🌲", desc: "소나무 향 가득한 아늑한 공간", price: 30000 },
  { id: "B2", name: "달빛 방갈로",   capacity: "최대 6인", icon: "🌕", desc: "가족 단위에 딱 맞는 넉넉한 방갈로", price: 30000 },
  { id: "B3", name: "별빛 방갈로",   capacity: "최대 2인", icon: "⭐", desc: "커플·소모임을 위한 프라이빗 공간", price: 30000 },
];

export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const MENU_ITEMS = [
  {
    id: "garden",
    title: "텃밭 분양",
    subtitle: "My Little Garden",
    desc: "나만의 텃밭을 분양받아 직접 채소와 허브를 키워보세요.",
    tags: ["연간 계약", "씨앗 키트"],
    emoji: "🌱",
  },
  {
    id: "bungalow",
    title: "방갈로 예약",
    subtitle: "Stay & Breathe",
    desc: "자연 속 아늑한 방갈로에서 하룻밤. 새벽 새소리와 별빛을 만끽하세요.",
    tags: ["최대 6인", "반려견 가능"],
    emoji: "🏡",
    bookable: true,
  },
  {
    id: "program",
    title: "체험 프로그램",
    subtitle: "Hands-on Nature",
    desc: "김장 담그기, 천연 염색, 도자기 체험. 가족과 잊지 못할 추억을 만드세요.",
    tags: ["주말 운영", "어린이 환영"],
    emoji: "🎨",
  },
];

export const TESTIMONIALS = [
  { name: "김지은", tag: "텃밭 분양 이용", text: "아이들이 직접 키운 토마토를 먹고 너무 행복해했어요!" },
  { name: "박민준", tag: "방갈로 숙박",    text: "새소리에 눈을 뜨고 별빛 아래 잠드는 경험, 잊지 못할 것 같아요." },
  { name: "이서연", tag: "체험 프로그램",  text: "스태프분들이 너무 친절하셨어요. 아이가 정말 좋아했어요!" },
];

export const STATUS_LABEL = { pending: "대기중", confirmed: "확정", cancelled: "취소" };
export const STATUS_COLOR = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

// ── 헬퍼 함수 ──────────────────────────────────────────
export function fmtHour(h) {
  if (h < 12) return `오전${h}시`;
  if (h === 12) return "오후12시";
  return `오후${h - 12}시`;
}

export function getTodayStr() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export function getDateLabel(str) {
  if (!str) return "";
  const [y, m, d] = str.split("-").map(Number);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dow = new Date(y, m - 1, d).getDay();
  return `${y}년 ${m}월 ${d}일 (${days[dow]})`;
}

export function genId() {
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

export function formatPrice(n) {
  return n.toLocaleString("ko-KR") + "원";
}
