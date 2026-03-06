// services/tossPayments.js
// 토스페이먼츠 결제 연동 로직

const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY || "test_ck_placeholder";

// 토스페이먼츠 SDK 동적 로드
export async function loadTossSDK() {
  if (window.TossPayments) return window.TossPayments;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment";
    script.onload = () => resolve(window.TossPayments);
    script.onerror = () => reject(new Error("토스페이먼츠 SDK 로드 실패"));
    document.head.appendChild(script);
  });
}

// 시간당 요금 계산
const PRICE_PER_HOUR = 30000;
export function calcAmount(hours) {
  return hours * PRICE_PER_HOUR;
}

// 결제 요청
export async function requestPayment({ reservation, amount }) {
  const TossPayments = await loadTossSDK();
  const toss = TossPayments(TOSS_CLIENT_KEY);

  const orderId = `GF-${reservation.id}-${Date.now()}`;
  const orderName = `그라운드팜 ${reservation.bungalowName} (${reservation.hours.length}시간)`;

  await toss.requestPayment("카드", {
    amount,
    orderId,
    orderName,
    customerName: reservation.name,
    customerEmail: reservation.email || undefined,
    customerMobilePhone: reservation.phone.replace(/-/g, ""),
    successUrl: `${window.location.origin}/payment/success?reservationId=${reservation.id}`,
    failUrl:    `${window.location.origin}/payment/fail`,
  });
}

// 결제 성공 처리 (서버리스 환경에서는 Vercel Edge Function 권장)
// 클라이언트에서는 paymentKey, orderId, amount를 받아 표시만 함
export function parseSuccessParams(searchParams) {
  return {
    paymentKey: searchParams.get("paymentKey"),
    orderId:    searchParams.get("orderId"),
    amount:     Number(searchParams.get("amount")),
    reservationId: searchParams.get("reservationId"),
  };
}
